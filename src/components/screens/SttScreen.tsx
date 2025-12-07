'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon,
  MicrophoneIcon 
} from '@heroicons/react/24/outline'
import { ApiService } from '@/lib/api'
import ProcessingOverlay from '@/components/ProcessingOverlay'
import toast from 'react-hot-toast'

export default function SttScreen() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState('')
  const [speakers, setSpeakers] = useState<any[]>([])
  const [enableDiarization, setEnableDiarization] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiProgress, setApiProgress] = useState({
    currentApi: '',
    progress: 0,
    statusMessage: '',
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAudioFile(acceptedFiles[0])
      setTranscription('')
      setSpeakers([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.webm', '.mp4', '.m4a', '.ogg']
    },
    multiple: false,
  })

  const transcribe = async () => {
    if (!audioFile) {
      toast.error('Please select an audio file')
      return
    }

    ApiService.setProgressCallback((api, progress, message) => {
      setApiProgress({ currentApi: api, progress, statusMessage: message })
    })

    setIsProcessing(true)
    try {
      const result = await ApiService.transcribeAudio(audioFile, enableDiarization)
      const correctedText = await ApiService.correctSpelling(result.transcription)
      
      setTranscription(correctedText)
      setSpeakers(result.speakers)
      toast.success('Transcription complete!')
    } catch (error) {
      console.error('Transcription failed:', error)
      toast.error('Transcription failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Speech to Text
        </h2>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Audio Source
          </label>
          
          {audioFile ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    {audioFile.name}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setAudioFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`
                p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  {isDragActive ? 'Drop file here...' : 'Drag & drop audio file'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                  MP3, WAV, WEBM, MP4, M4A, OGG
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enableDiarization}
              onChange={(e) => setEnableDiarization(e.target.checked)}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                Enable Speaker Diarization
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Identify and separate different speakers
              </p>
            </div>
          </label>
        </div>

        {/* Transcribe Button */}
        <button
          onClick={transcribe}
          disabled={!audioFile || isProcessing}
          className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <DocumentTextIcon className="w-5 h-5" />
          {isProcessing ? 'Transcribing...' : 'Transcribe'}
        </button>

        {/* Results */}
        {(speakers.length > 0 || transcription) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {/* Speaker Analysis */}
            {speakers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Speaker Analysis
                </h3>
                <div className="space-y-2">
                  {speakers.map((speaker, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {speaker.id.slice(-1)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {speaker.id} ({speaker.gender})
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Spoke for {formatDuration(speaker.totalSeconds)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcription */}
            {transcription && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Transcription
                  </h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transcription)
                      toast.success('Copied to clipboard!')
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap">
                    {transcription}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {isProcessing && (
        <ProcessingOverlay {...apiProgress} />
      )}
    </div>
  )
}

