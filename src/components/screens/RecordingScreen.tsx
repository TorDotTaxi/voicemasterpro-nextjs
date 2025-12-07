'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MicrophoneIcon, StopIcon, PlayIcon, DocumentTextIcon } from '@heroicons/react/24/solid'
import WaveformVisualizer from '@/components/WaveformVisualizer'
import ProcessingOverlay from '@/components/ProcessingOverlay'
import { ApiService } from '@/lib/api'
import { StorageService } from '@/lib/storage'
import { Recording, RecordingStatus, ApiProgress } from '@/types'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'

export default function RecordingScreen() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [apiProgress, setApiProgress] = useState<ApiProgress>({
    currentApi: '',
    progress: 0,
    statusMessage: '',
    isProcessing: false,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setDuration(0)
      
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Failed to access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob))
      audioRef.current = audio
      
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    }
  }

  const transcribeRecording = async () => {
    if (!audioBlob) return

    ApiService.setProgressCallback((api, progress, message) => {
      setApiProgress({
        currentApi: api,
        progress,
        statusMessage: message,
        isProcessing: true,
      })
    })

    try {
      const result = await ApiService.transcribeAudio(audioBlob, true)
      
      // Correct spelling
      const correctedText = await ApiService.correctSpelling(result.transcription)
      
      // Save to storage
      const recording: Recording = {
        id: nanoid(),
        audioBlob,
        transcription: correctedText,
        createdAt: new Date(),
        uploadedAt: new Date(),
        duration,
        speakers: result.speakers,
        status: RecordingStatus.COMPLETED,
      }
      
      await StorageService.saveRecording(recording)
      
      toast.success('Transcription complete!')
      
      // Show result
      alert(`Transcription:\n\n${correctedText}\n\nSpeakers: ${result.speakers.length}`)
      
      // Reset
      setAudioBlob(null)
      setDuration(0)
    } catch (error) {
      console.error('Transcription failed:', error)
      toast.error('Transcription failed. Please try again.')
    } finally {
      setApiProgress({
        currentApi: '',
        progress: 0,
        statusMessage: '',
        isProcessing: false,
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Waveform or Mic Icon */}
          <div className="flex justify-center mb-8">
            {isRecording ? (
              <WaveformVisualizer />
            ) : (
              <MicrophoneIcon className="w-32 h-32 text-primary-500 opacity-30" />
            )}
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold font-mono text-gray-900 dark:text-white">
              {formatDuration(duration)}
            </div>
          </div>

          {/* Record Button */}
          <div className="flex justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`
                w-24 h-24 rounded-full flex items-center justify-center
                transition-colors shadow-lg
                ${isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-primary-600 hover:bg-primary-700'
                }
              `}
            >
              {isRecording ? (
                <StopIcon className="w-12 h-12 text-white" />
              ) : (
                <MicrophoneIcon className="w-12 h-12 text-white" />
              )}
            </motion.button>
          </div>

          <div className="text-center text-gray-600 dark:text-gray-400 mb-8">
            {isRecording ? 'Recording...' : 'Tap to start recording'}
          </div>

          {/* Post-recording options */}
          {audioBlob && !isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4"
            >
              <button
                onClick={playRecording}
                disabled={isPlaying}
                className="flex flex-col items-center px-6 py-3 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-xl hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors disabled:opacity-50"
              >
                <PlayIcon className="w-8 h-8 mb-1" />
                <span className="text-sm">Play</span>
              </button>
              
              <button
                onClick={transcribeRecording}
                className="flex flex-col items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                <DocumentTextIcon className="w-8 h-8 mb-1" />
                <span className="text-sm">Transcribe</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Processing Overlay */}
      {apiProgress.isProcessing && <ProcessingOverlay {...apiProgress} />}
    </div>
  )
}

