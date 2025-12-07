import axios from 'axios'
import { TranscriptionResult, SpeakerGender, Speaker, SpeakerSegment } from '@/types'

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const DEEPGRAM_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
const FPT_AI_KEY = process.env.NEXT_PUBLIC_FPT_AI_API_KEY
const ASSEMBLY_AI_KEY = process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY

// New APIs with large file support
const WHISPER_API_KEY = process.env.NEXT_PUBLIC_WHISPER_API_KEY
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY
const GLADIA_API_KEY = process.env.NEXT_PUBLIC_GLADIA_API_KEY
const SPEECHTEXT_API_KEY = process.env.NEXT_PUBLIC_SPEECHTEXT_API_KEY
const DEAPI_KEY = process.env.NEXT_PUBLIC_DEAPI_KEY
const AZURE_TTS_KEY = process.env.NEXT_PUBLIC_AZURE_TTS_KEY

export class ApiService {
  private static updateProgress?: (api: string, progress: number, message: string) => void

  static setProgressCallback(callback: (api: string, progress: number, message: string) => void) {
    this.updateProgress = callback
  }

  static async transcribeAudio(
    audioBlob: Blob,
    enableDiarization: boolean = true
  ): Promise<TranscriptionResult> {
    // Check if any API keys are configured
    if (!DEEPGRAM_KEY && !FPT_AI_KEY && !WHISPER_API_KEY && !GROQ_API_KEY && !GLADIA_API_KEY) {
      throw new Error('❌ No API keys configured! Please create .env.local file with your API keys.')
    }


    // API-specific file size limits (in bytes)
    const DEEPGRAM_MAX_SIZE = 2 * 1024 * 1024 // 2MB
    const FPT_AI_MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const GROQ_MAX_SIZE = 25 * 1024 * 1024 // 25MB
    const WHISPER_MAX_SIZE = 10 * 1024 * 1024 * 1024 // 10GB
    const DEAPI_MAX_SIZE = 10 * 1024 * 1024 // 10MB
    
    // Find the largest available API limit
    const availableLimits: number[] = []
    if (WHISPER_API_KEY) availableLimits.push(WHISPER_MAX_SIZE)
    if (GROQ_API_KEY) availableLimits.push(GROQ_MAX_SIZE)
    if (DEAPI_KEY) availableLimits.push(DEAPI_MAX_SIZE)
    if (GLADIA_API_KEY) availableLimits.push(100 * 1024 * 1024) // Assume 100MB for Gladia
    if (FPT_AI_KEY) availableLimits.push(FPT_AI_MAX_SIZE)
    if (DEEPGRAM_KEY) availableLimits.push(DEEPGRAM_MAX_SIZE)
    
    const MAX_AVAILABLE_SIZE = availableLimits.length > 0 ? Math.max(...availableLimits) : 2 * 1024 * 1024

    // Only validate if file is larger than any available API can handle
    if (audioBlob.size > MAX_AVAILABLE_SIZE) {
      const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
      const maxGB = (MAX_AVAILABLE_SIZE / (1024 * 1024 * 1024)).toFixed(1)
      const maxMB = (MAX_AVAILABLE_SIZE / (1024 * 1024)).toFixed(0)
      
      let errorMsg = `❌ File quá lớn! Kích thước: ${sizeMB}MB. `
      
      if (MAX_AVAILABLE_SIZE >= WHISPER_MAX_SIZE) {
        errorMsg += `Giới hạn tối đa: ${maxGB}GB (Whisper). `
      } else if (MAX_AVAILABLE_SIZE >= GROQ_MAX_SIZE) {
        errorMsg += `Giới hạn tối đa: ${maxMB}MB (Groq). `
      } else {
        errorMsg += `Giới hạn tối đa: ${maxMB}MB. `
      }
      
      errorMsg += `Vui lòng nén file hoặc chia nhỏ file.`
      
      throw new Error(errorMsg)
    }

    const apis = [
      { name: 'Deepgram', handler: this.transcribeWithDeepgram.bind(this), enabled: !!DEEPGRAM_KEY, maxSize: DEEPGRAM_MAX_SIZE },
      { name: 'FPT.AI', handler: this.transcribeWithFPTAI.bind(this), enabled: !!FPT_AI_KEY, maxSize: FPT_AI_MAX_SIZE },
    ].filter(api => api.enabled)

    // Additional validation: if Deepgram is enabled and file is > 2MB, skip it
    const validApis = apis.filter(api => {
      if (api.name === 'Deepgram' && audioBlob.size > DEEPGRAM_MAX_SIZE) {
        return false
      }
      if (api.name === 'FPT.AI' && audioBlob.size > FPT_AI_MAX_SIZE) {
        return false
      }
      return true
    })

    if (validApis.length === 0) {
      const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
      throw new Error(
        `❌ File quá lớn cho tất cả các API! Kích thước: ${sizeMB}MB. ` +
        `Deepgram giới hạn: 2MB, FPT AI giới hạn: 5MB. ` +
        `Vui lòng nén file hoặc chia nhỏ file.`
      )
    }

    for (let i = 0; i < validApis.length; i++) {
      try {
        const api = validApis[i]
        this.updateProgress?.(api.name, (i + 1) / validApis.length, `Trying ${api.name}...`)
        
        const result = await api.handler(audioBlob, enableDiarization)
        return result
      } catch (error: any) {
        console.error(`${validApis[i].name} failed:`, error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        })
        
        // If this was the last API, throw the error
        if (i === validApis.length - 1) {
          let errorMsg = error.response?.data?.message || error.message || 'Unknown error'
          
          // Provide user-friendly error messages
          if (errorMsg.includes('size limit') || errorMsg.includes('too large') || errorMsg.includes('exceeded')) {
            const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
            if (DEEPGRAM_KEY && audioBlob.size > DEEPGRAM_MAX_SIZE) {
              errorMsg = `File quá lớn (${sizeMB}MB). Giới hạn Deepgram: 2MB. Vui lòng nén hoặc chia nhỏ file.`
            } else if (FPT_AI_KEY) {
              errorMsg = `File quá lớn (${sizeMB}MB). Giới hạn FPT AI: 5MB. Vui lòng nén hoặc chia nhỏ file.`
            } else {
              errorMsg = `File quá lớn (${sizeMB}MB). Vui lòng nén hoặc chia nhỏ file.`
            }
          } else if (error.response?.status === 413) {
            const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2)
            if (DEEPGRAM_KEY && audioBlob.size > DEEPGRAM_MAX_SIZE) {
              errorMsg = `File quá lớn (${sizeMB}MB). Giới hạn Deepgram: 2MB. Vui lòng dùng file nhỏ hơn.`
            } else if (FPT_AI_KEY) {
              errorMsg = `File quá lớn (${sizeMB}MB). Giới hạn FPT AI: 5MB. Vui lòng dùng file nhỏ hơn.`
            } else {
              errorMsg = `File quá lớn (${sizeMB}MB). Vui lòng dùng file nhỏ hơn.`
            }
          } else if (error.response?.status === 400) {
            errorMsg = `Định dạng audio không hợp lệ. Vui lòng dùng MP3, WAV, hoặc M4A.`
          } else if (error.response?.status === 401 || error.response?.status === 403) {
            errorMsg = `Lỗi xác thực API. Vui lòng kiểm tra API keys trong .env.local`
          } else if (error.response?.status === 429) {
            errorMsg = `API rate limit exceeded. Vui lòng thử lại sau vài phút.`
          } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            errorMsg = `Hết thời gian chờ. File có thể quá lớn hoặc kết nối chậm.`
          } else if (!error.response && error.request) {
            errorMsg = `Không thể kết nối đến API. Vui lòng kiểm tra kết nối internet.`
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

    // Determine Content-Type from blob type or fallback to common audio types
    let contentType = audioBlob.type || ''
    
    // Fallback for empty or generic blob types
    if (!contentType || contentType === 'application/octet-stream') {
      // Try to infer from filename if available (for File objects)
      const file = audioBlob as File
      if (file?.name) {
        const ext = file.name.toLowerCase().split('.').pop()
        const mimeMap: Record<string, string> = {
          'mp3': 'audio/mpeg',
          'wav': 'audio/wav',
          'm4a': 'audio/mp4',
          'webm': 'audio/webm',
          'ogg': 'audio/ogg',
          'flac': 'audio/flac',
        }
        contentType = mimeMap[ext || ''] || 'audio/wav' // Default to wav
      } else {
        contentType = 'audio/wav' // Default fallback
      }
    }

    const response = await axios.post(url, audioBlob, {
      headers: {
        'Authorization': `Token ${DEEPGRAM_KEY}`,
        'Content-Type': contentType,
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
    if (!data?.results) {
      throw new Error('Invalid Deepgram response: missing results')
    }

    const results = data.results
    const channels = results?.channels?.[0]
    const alternatives = channels?.alternatives?.[0]
    
    if (!alternatives) {
      throw new Error('Invalid Deepgram response: no transcription found')
    }
    
    const transcription = alternatives.transcript || ''
    const speakers: Speaker[] = []

    if (results.utterances && Array.isArray(results.utterances)) {
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
    formData.append('file', audioBlob, 'audio.wav')

    const response = await axios.post(
      'https://api.fpt.ai/hmi/asr/general',
      formData,
      {
        headers: {
          'api-key': FPT_AI_KEY!,
          // Don't set Content-Type - FormData sets it automatically with boundary
        },
        timeout: 300000, // 5 minute timeout
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? (progressEvent.loaded / progressEvent.total) 
            : 0
          this.updateProgress?.('FPT.AI', progress, `Uploading... ${Math.round(progress * 100)}%`)
        },
      }
    )

    const transcription = response.data.hypotheses?.[0]?.utterance || response.data.asr?.hypotheses?.[0]?.utterance || ''

    return {
      transcription,
      speakers: [],
      confidence: response.data.hypotheses?.[0]?.confidence || response.data.asr?.hypotheses?.[0]?.confidence || 0,
    }
  }

  static async textToSpeech(
    text: string,
    gender: SpeakerGender = SpeakerGender.FEMALE
  ): Promise<Blob> {
    if (!FPT_AI_KEY) {
      throw new Error('❌ FPT AI API key không được cấu hình! Vui lòng thêm NEXT_PUBLIC_FPT_AI_API_KEY vào .env.local')
    }

    // Validate text length (FPT AI limit is usually ~5000 characters)
    if (text.length > 5000) {
      throw new Error(`❌ Text quá dài! Giới hạn: 5000 ký tự. Text của bạn: ${text.length} ký tự.`)
    }

    if (!text.trim()) {
      throw new Error('❌ Vui lòng nhập text để chuyển đổi thành giọng nói.')
    }

    const voice = gender === SpeakerGender.MALE ? 'leminh' : 'lannhi'

    try {
      const response = await axios.post(
        'https://api.fpt.ai/hmi/tts/v5',
        text, // FPT AI TTS v5 expects text as body, not JSON
        {
          headers: {
            'api-key': FPT_AI_KEY,
            'voice': voice,
            'speed': '1',
            'format': 'mp3',
          },
          timeout: 30000, // 30 second timeout
        }
      )

      // FPT AI returns audio URL in response
      let audioUrl: string
      
      if (typeof response.data === 'string') {
        // Direct URL response
        audioUrl = response.data
      } else if (response.data?.async) {
        // Async URL in data object
        audioUrl = response.data.async
      } else if (response.data?.url) {
        audioUrl = response.data.url
      } else {
        throw new Error('Invalid response format from FPT AI TTS API')
      }

      if (!audioUrl) {
        throw new Error('Không nhận được URL audio từ FPT AI API')
      }

      // Wait a bit for the audio to be ready (async processing)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Download the audio
      const audioResponse = await axios.get(audioUrl, {
        responseType: 'blob',
        timeout: 30000,
      })

      return audioResponse.data
    } catch (error: any) {
      console.error('TTS API error:', error)
      
      let errorMsg = 'Không thể tạo giọng nói. '
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        errorMsg += 'API key không hợp lệ hoặc hết hạn. Vui lòng kiểm tra lại FPT AI API key.'
      } else if (error.response?.status === 400) {
        errorMsg += 'Text không hợp lệ hoặc quá dài. Vui lòng kiểm tra lại text.'
      } else if (error.response?.status === 429) {
        errorMsg += 'Đã vượt quá giới hạn API. Vui lòng thử lại sau.'
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMsg += 'Hết thời gian chờ. Vui lòng thử lại.'
      } else if (!error.response && error.request) {
        errorMsg += 'Không thể kết nối đến API. Vui lòng kiểm tra kết nối internet.'
      } else {
        errorMsg += error.response?.data?.message || error.message || 'Lỗi không xác định.'
      }
      
      throw new Error(errorMsg)
    }
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
