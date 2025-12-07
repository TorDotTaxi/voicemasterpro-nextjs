'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import RecordingScreen from '@/components/screens/RecordingScreen'
import HistoryScreen from '@/components/screens/HistoryScreen'
import TtsScreen from '@/components/screens/TtsScreen'
import SttScreen from '@/components/screens/SttScreen'
import { 
  MicrophoneIcon, 
  ClockIcon, 
  SpeakerWaveIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline'
import {
  MicrophoneIcon as MicrophoneSolid,
  ClockIcon as ClockSolid,
  SpeakerWaveIcon as SpeakerWaveSolid,
  DocumentTextIcon as DocumentTextSolid
} from '@heroicons/react/24/solid'

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { 
      id: 0, 
      name: 'Record', 
      icon: MicrophoneIcon,
      iconSolid: MicrophoneSolid,
      component: RecordingScreen 
    },
    { 
      id: 1, 
      name: 'History', 
      icon: ClockIcon,
      iconSolid: ClockSolid,
      component: HistoryScreen 
    },
    { 
      id: 2, 
      name: 'TTS', 
      icon: SpeakerWaveIcon,
      iconSolid: SpeakerWaveSolid,
      component: TtsScreen 
    },
    { 
      id: 3, 
      name: 'STT', 
      icon: DocumentTextIcon,
      iconSolid: DocumentTextSolid,
      component: SttScreen 
    },
  ]

  const ActiveComponent = tabs[activeTab].component

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                VoiceMaster Pro
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional Audio Transcription & Analysis
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <span className="w-2 h-2 mr-2 bg-green-600 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = activeTab === tab.id ? tab.iconSolid : tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center py-3 px-6 relative transition-colors duration-200
                    ${activeTab === tab.id 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{tab.name}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 dark:bg-primary-400"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </main>
  )
}

