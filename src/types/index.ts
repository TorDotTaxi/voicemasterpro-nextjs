export enum SpeakerGender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum RecordingStatus {
  RECORDING = 'recording',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface SpeakerSegment {
  startSeconds: number
  endSeconds: number
  text: string
}

export interface Speaker {
  id: string
  gender: SpeakerGender
  totalSeconds: number
  segments: SpeakerSegment[]
  voiceFeatures?: Record<string, any>
}

export interface Recording {
  id: string
  filePath?: string
  audioBlob?: Blob
  transcription?: string
  createdAt: Date
  uploadedAt?: Date
  duration: number
  speakers?: Speaker[]
  status: RecordingStatus
}

export interface ApiProgress {
  currentApi: string
  progress: number
  statusMessage: string
  isProcessing: boolean
}

export interface TranscriptionResult {
  transcription: string
  speakers: Speaker[]
  confidence: number
}

