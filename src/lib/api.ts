import axios from 'axios'
import { TranscriptionResult, SpeakerGender, Speaker, SpeakerSegment } from '@/types'

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const DEEPGRAM_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
const FPT_AI_KEY = process.env.NEXT_PUBLIC_FPT_AI_API_KEY
const ASSEMBLY_AI_KEY = process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY

export class ApiService {
  private static updateProgress?: (api: string, progress: number, message: string) => void

  static setProgressCallback(callback: (api: string, progress: number, message: string) => void) {
    this.updateProgress = callback
  }

  static async transcribeAudio(
    audioBlob: Blob,
    enableDiarization: boolean = true
  ): Promise<TranscriptionResult> {
    // Check if API keys are configured
    if (!DEEPGRAM_KEY && !FPT_AI_KEY) {
      throw new Error('❌ No API keys configured! Please create .env.local file with your API keys.')
    }

    // Validate file size (25MB limit for most APIs)
    const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB in bytes
    if (audioBlob.size > MAX_FILE_SIZE) {
      const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
      throw new Error(
        `❌ File too large! Size: ${sizeMB}MB. Maximum allowed: 25MB. ` +
        `Please use a smaller audio file or compress it.`
      )
    }

    const apis = [
      { name: 'Deepgram', handler: this.transcribeWithDeepgram.bind(this), enabled: !!DEEPGRAM_KEY },
      { name: 'FPT.AI', handler: this.transcribeWithFPTAI.bind(this), enabled: !!FPT_AI_KEY },
    ].filter(api => api.enabled)

    if (apis.length === 0) {
      throw new Error('❌ No transcription APIs available. Check your API keys.')
    }

    for (let i = 0; i < apis.length; i++) {
      try {
        const api = apis[i]
        this.updateProgress?.(api.name, (i + 1) / apis.length, `Trying ${api.name}...`)
        
        const result = await api.handler(audioBlob, enableDiarization)
        return result
      } catch (error: any) {
        console.error(`${apis[i].name} failed:`, error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        })
        
        // If this was the last API, throw the error
        if (i === apis.length - 1) {
          let errorMsg = error.response?.data?.message || error.message || 'Unknown error'
          
          // Provide user-friendly error messages
          if (errorMsg.includes('size limit') || errorMsg.includes('too large') || errorMsg.includes('exceeded')) {
            const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
            errorMsg = `File too large (${sizeMB}MB). Maximum: 25MB. Please compress or split the audio file.`
          } else if (error.response?.status === 413) {
            const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
            errorMsg = `File too large (${sizeMB}MB). Maximum: 25MB. Please use a smaller file.`
          } else if (error.response?.status === 400) {
            errorMsg = `Invalid audio format. Please use MP3, WAV, or M4A format.`
          } else if (error.response?.status === 401 || error.response?.status === 403) {
            errorMsg = `API authentication failed. Please check your API keys.`
          }
          
          throw new Error(`❌ Transcription failed: ${errorMsg}`)
        }
        // Otherwise continue to the next API
      }
    }
    
    // TypeScript requires this: the loop above always returns or throws,
    // but TS can't prove it statically. This line will never execute.
    return undefined as never
  }

  private static async transcribeWithDeepgram(
    audioBlob: Blob,
    enableDiarization: boolean
  ): Promise<TranscriptionResult> {
    const url = enableDiarization
      ? 'https://api.deepgram.com/v1/listen?diarize=true&language=vi&punctuate=true&utterances=true'
      : 'https://api.deepgram.com/v1/listen?language=vi&punctuate=true'

    // Don't set Content-Type - let browser detect from blob type
    const response = await axios.post(url, audioBlob, {
      headers: {
        'Authorization': `Token ${DEEPGRAM_KEY}`,
      },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total 
          ? (progressEvent.loaded / progressEvent.total) 
          : 0
        this.updateProgress?.('Deepgram', progress, `Uploading... ${Math.round(progress * 100)}%`)
      },
      timeout: 300000, // 5 minute timeout for long audio files
    })

    return this.parseDeepgramResponse(response.data)
  }

  private static parseDeepgramResponse(data: any): TranscriptionResult {
    const results = data.results
    const channels = results.channels[0]
    const alternatives = channels.alternatives[0]
    
    const transcription = alternatives.transcript || ''
    const speakers: Speaker[] = []

    if (results.utterances) {
      const speakerMap = new Map<number, SpeakerSegment[]>()

      results.utterances.forEach((utterance: any) => {
        const speakerId = utterance.speaker
        const segment: SpeakerSegment = {
          startSeconds: Math.floor(utterance.start),
          endSeconds: Math.floor(utterance.end),
          text: utterance.transcript,
        }

        if (!speakerMap.has(speakerId)) {
          speakerMap.set(speakerId, [])
        }
        speakerMap.get(speakerId)!.push(segment)
      })

      let index = 0
      speakerMap.forEach((segments, speakerId) => {
        const totalSeconds = segments.reduce(
          (sum, seg) => sum + (seg.endSeconds - seg.startSeconds),
          0
        )

        speakers.push({
          id: `Voice ${String.fromCharCode(65 + index)}`,
          gender: SpeakerGender.UNKNOWN,
          totalSeconds,
          segments,
        })
        index++
      })
    }

    return {
      transcription,
      speakers,
      confidence: alternatives.confidence || 0,
    }
  }

  private static async transcribeWithFPTAI(
    audioBlob: Blob,
    enableDiarization: boolean
  ): Promise<TranscriptionResult> {
    const formData = new FormData()
    formData.append('file', audioBlob)

    const response = await axios.post(
      'https://api.fpt.ai/hmi/asr/general',
      audioBlob,
      {
        headers: {
          'api-key': FPT_AI_KEY!,
          'Content-Type': 'audio/wav',
        },
      }
    )

    const transcription = response.data.hypotheses?.[0]?.utterance || ''

    return {
      transcription,
      speakers: [],
      confidence: response.data.hypotheses?.[0]?.confidence || 0,
    }
  }

  static async textToSpeech(
    text: string,
    gender: SpeakerGender = SpeakerGender.FEMALE
  ): Promise<Blob> {
    const voice = gender === SpeakerGender.MALE ? 'leminh' : 'lannhi'

    const response = await axios.post(
      'https://api.fpt.ai/hmi/tts/v5',
      {
        text,
        voice,
        speed: 1.0,
        format: 'mp3',
      },
      {
        headers: {
          'api-key': FPT_AI_KEY!,
          'Content-Type': 'application/json',
        },
      }
    )

    const audioUrl = response.data.async

    // Download the audio
    const audioResponse = await axios.get(audioUrl, {
      responseType: 'blob',
    })

    return audioResponse.data
  }

  static async correctSpelling(text: string): Promise<string> {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Correct any spelling and grammar errors in the following Vietnamese text. Return only the corrected text without explanations:\n\n${text}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data.candidates[0].content.parts[0].text.trim()
    } catch (error) {
      console.error('Spelling correction failed:', error)
      return text
    }
  }
}
