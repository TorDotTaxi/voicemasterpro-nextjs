'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function WaveformVisualizer() {
  const bars = 40

  return (
    <div className="flex items-center justify-center h-32 gap-1">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary-600 rounded-full"
          animate={{
            height: [
              Math.random() * 40 + 20,
              Math.random() * 100 + 20,
              Math.random() * 60 + 20,
            ],
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

