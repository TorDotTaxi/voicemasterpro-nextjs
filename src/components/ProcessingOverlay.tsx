'use client'

import { motion } from 'framer-motion'

interface ProcessingOverlayProps {
  currentApi: string
  progress: number
  statusMessage: string
}

export default function ProcessingOverlay({
  currentApi,
  progress,
  statusMessage,
}: ProcessingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-6">
            <motion.div
              className="absolute inset-0 border-4 border-primary-200 dark:border-primary-900 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* API Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentApi}
          </h3>

          {/* Status Message */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {statusMessage}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary-600 dark:bg-primary-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Percentage */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress * 100)}%
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

