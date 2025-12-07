'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StorageService } from '@/lib/storage'
import { Recording } from '@/types'
import { 
  MagnifyingGlassIcon, 
  TrashIcon, 
  PlayIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

export default function HistoryScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecordings()
  }, [])

  const loadRecordings = async () => {
    setIsLoading(true)
    const data = await StorageService.getAllRecordings()
    setRecordings(data)
    setIsLoading(false)
  }

  const filteredRecordings = recordings.filter((rec) => {
    const query = searchQuery.toLowerCase()
    return (
      rec.transcription?.toLowerCase().includes(query) ||
      rec.speakers?.some(s => s.id.toLowerCase().includes(query))
    )
  })

  const deleteRecording = async (id: string) => {
    if (confirm('Delete this recording?')) {
      await StorageService.deleteRecording(id)
      toast.success('Recording deleted')
      loadRecordings()
    }
  }

  const deleteAll = async () => {
    if (confirm('Delete ALL recordings? This cannot be undone!')) {
      await StorageService.deleteAllRecordings()
      toast.success('All recordings deleted')
      loadRecordings()
    }
  }

  const playRecording = async (id: string) => {
    const blob = await StorageService.getAudioBlob(id)
    if (blob) {
      const audio = new Audio(URL.createObjectURL(blob))
      audio.play()
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recording History
          </h2>
          {recordings.length > 0 && (
            <button
              onClick={deleteAll}
              className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Delete All
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Recordings List */}
      {filteredRecordings.length === 0 ? (
        <div className="text-center py-16">
          <SpeakerWaveIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No recordings found' : 'No recordings yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredRecordings.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <SpeakerWaveIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {dayjs(recording.createdAt).format('MMM DD, YYYY - HH:mm')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Duration: {formatDuration(recording.duration)}
                        </p>
                      </div>
                    </div>

                    {recording.speakers && recording.speakers.length > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Speakers: {recording.speakers.map(s => s.id).join(', ')}
                      </div>
                    )}

                    {recording.transcription && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {recording.transcription}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => playRecording(recording.id)}
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title="Play"
                    >
                      <PlayIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

