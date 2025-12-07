import localforage from 'localforage'
import { Recording } from '@/types'

// Configure localforage
const recordingsStore = localforage.createInstance({
  name: 'voicemaster-pro',
  storeName: 'recordings',
})

const audioStore = localforage.createInstance({
  name: 'voicemaster-pro',
  storeName: 'audio',
})

export class StorageService {
  static async saveRecording(recording: Recording): Promise<void> {
    // Save audio blob separately
    if (recording.audioBlob) {
      await audioStore.setItem(recording.id, recording.audioBlob)
    }
    
    // Save recording metadata
    const { audioBlob, ...recordingData } = recording
    await recordingsStore.setItem(recording.id, {
      ...recordingData,
      createdAt: recording.createdAt.toISOString(),
      uploadedAt: recording.uploadedAt?.toISOString(),
    })
  }

  static async getRecording(id: string): Promise<Recording | null> {
    const data = await recordingsStore.getItem<any>(id)
    if (!data) return null

    const audioBlob = await audioStore.getItem<Blob>(id)
    
    return {
      ...data,
      audioBlob,
      createdAt: new Date(data.createdAt),
      uploadedAt: data.uploadedAt ? new Date(data.uploadedAt) : undefined,
    }
  }

  static async getAllRecordings(): Promise<Recording[]> {
    const recordings: Recording[] = []
    await recordingsStore.iterate<any, void>((value, key) => {
      recordings.push({
        ...value,
        createdAt: new Date(value.createdAt),
        uploadedAt: value.uploadedAt ? new Date(value.uploadedAt) : undefined,
      })
    })
    
    // Sort by createdAt descending
    return recordings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static async deleteRecording(id: string): Promise<void> {
    await recordingsStore.removeItem(id)
    await audioStore.removeItem(id)
  }

  static async deleteAllRecordings(): Promise<void> {
    await recordingsStore.clear()
    await audioStore.clear()
  }

  static async getAudioBlob(id: string): Promise<Blob | null> {
    return await audioStore.getItem<Blob>(id)
  }
}

