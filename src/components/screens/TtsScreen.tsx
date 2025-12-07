'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SpeakerWaveIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import { ApiService } from '@/lib/api'
import { SpeakerGender } from '@/types'
import ProcessingOverlay from '@/components/ProcessingOverlay'
import toast from 'react-hot-toast'

export default function TtsScreen() {
  const [text, setText] = useState('')
  const [gender, setGender] = useState<SpeakerGender>(SpeakerGender.FEMALE)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useState<HTMLAudioElement | null>(null)[0]

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setIsGenerating(true)
    try {
      const blob = await ApiService.textToSpeech(text, gender)
      setAudioBlob(blob)
      toast.success('Speech generated!')
    } catch (error: any) {
      console.error('TTS failed:', error)
      const errorMessage = error?.message || 'Không thể tạo giọng nói. Vui lòng thử lại.'
      toast.error(errorMessage, { duration: 5000 })
    } finally {
      setIsGenerating(false)
    }
  }

  const playSpeech = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob))
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    }
  }

  const stopSpeech = () => {
    if (audioRef) {
      audioRef.pause()
      audioRef.currentTime = 0
      setIsPlaying(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Text to Speech
        </h2>

        {/* Voice Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Voice
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setGender(SpeakerGender.FEMALE)}
              className={`
                flex-1 py-3 px-4 rounded-xl border-2 transition-all
                ${gender === SpeakerGender.FEMALE
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
              `}
            >
              Female Voice
            </button>
            <button
              onClick={() => setGender(SpeakerGender.MALE)}
              className={`
                flex-1 py-3 px-4 rounded-xl border-2 transition-all
                ${gender === SpeakerGender.MALE
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
              `}
            >
              Male Voice
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to convert to speech..."
            rows={8}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateSpeech}
          disabled={isGenerating}
          className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <SpeakerWaveIcon className="w-5 h-5" />
          {isGenerating ? 'Generating...' : 'Generate Speech'}
        </button>

        {/* Playback Controls */}
        {audioBlob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Generated Audio
            </h3>
            <div className="flex gap-3">
              <button
                onClick={playSpeech}
                disabled={isPlaying}
                className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlayIcon className="w-4 h-4" />
                {isPlaying ? 'Playing...' : 'Play'}
              </button>
              <button
                onClick={stopSpeech}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <StopIcon className="w-4 h-4" />
                Stop
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {isGenerating && (
        <ProcessingOverlay
          currentApi="FPT.AI TTS"
          progress={0.5}
          statusMessage="Generating speech..."
        />
      )}
    </div>
  )
}

