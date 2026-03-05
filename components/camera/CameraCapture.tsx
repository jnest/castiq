'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, RefreshCw, Upload, Zap, X, Aperture } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CameraCaptureProps {
  onCapture: (imageBase64: string, mimeType: string) => void
  mode?: 'analyze' | 'fishread' | 'catch'
  isAnalyzing?: boolean
}

export default function CameraCapture({ onCapture, mode = 'analyze', isAnalyzing = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flashActive, setFlashActive] = useState(false)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  const modeConfig = {
    analyze: {
      accentColor: 'border-hook-500',
      buttonColor: 'bg-hook-500 hover:bg-hook-600',
      label: 'Capture for Analysis',
      scanColor: 'bg-hook-500/10',
    },
    fishread: {
      accentColor: 'border-water-500',
      buttonColor: 'bg-water-500 hover:bg-water-600',
      label: 'Capture for FishRead',
      scanColor: 'bg-water-500/10',
    },
    catch: {
      accentColor: 'border-depth-500',
      buttonColor: 'bg-depth-500 hover:bg-depth-600',
      label: 'Capture Fish Photo',
      scanColor: 'bg-depth-500/10',
    },
  }

  const config = modeConfig[mode]

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(devices => {
      const videoCameras = devices.filter(d => d.kind === 'videoinput')
      setHasMultipleCameras(videoCameras.length > 1)
    }).catch(() => {})

    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or upload a photo.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const flipCamera = async () => {
    stopCamera()
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newMode)
    setTimeout(() => {
      startCamera()
    }, 100)
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    // Flash effect
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 200)

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    const base64 = dataUrl.split(',')[1]

    setCapturedImage(dataUrl)
    stopCamera()
    onCapture(base64, 'image/jpeg')
  }, [onCapture])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      const base64 = dataUrl.split(',')[1]
      const mimeType = file.type || 'image/jpeg'
      setCapturedImage(dataUrl)
      onCapture(base64, mimeType)
    }
    reader.readAsDataURL(file)
  }

  const reset = () => {
    setCapturedImage(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full">
      {capturedImage ? (
        // Captured image preview
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={capturedImage}
            alt="Captured water"
            className="w-full object-cover"
            style={{ maxHeight: '60vh' }}
          />

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-950/80 backdrop-blur-sm">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-water-500/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-water-500/50 flex items-center justify-center animate-pulse">
                    <Aperture size={28} className="text-water-400 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                {/* Ripple rings */}
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-water-400/20"
                    style={{
                      animation: `ripple 1.5s ease-out ${i * 0.5}s infinite`,
                    }}
                  />
                ))}
              </div>
              <p className="text-white font-semibold mt-4 text-sm">Reading the water...</p>
              <p className="text-dark-400 text-xs mt-1">AI analyzing features & cast spots</p>
              {/* Scan line effect */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-water-400/60 to-transparent"
                style={{ animation: 'scan-line 2s linear infinite' }}
              />
            </div>
          )}

          {!isAnalyzing && (
            <button
              onClick={reset}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-dark-900/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-dark-800 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : cameraActive ? (
        // Live camera viewfinder
        <div className="relative rounded-2xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full object-cover"
            style={{ maxHeight: '60vh' }}
          />

          {/* Flash overlay */}
          {flashActive && (
            <div className="absolute inset-0 bg-white opacity-80 pointer-events-none" />
          )}

          {/* Viewfinder overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute inset-6">
              <div className="viewfinder-corner viewfinder-corner-tl" />
              <div className="viewfinder-corner viewfinder-corner-tr" />
              <div className="viewfinder-corner viewfinder-corner-bl" />
              <div className="viewfinder-corner viewfinder-corner-br" />
            </div>

            {/* Rule-of-thirds grid */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute left-1/3 inset-y-0 w-px bg-white/40" />
              <div className="absolute left-2/3 inset-y-0 w-px bg-white/40" />
              <div className="absolute top-1/3 inset-x-0 h-px bg-white/40" />
              <div className="absolute top-2/3 inset-x-0 h-px bg-white/40" />
            </div>

            {/* Hint text */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <div className="glass rounded-full px-3 py-1.5">
                <p className="text-xs text-white/80">Aim at water surface</p>
              </div>
            </div>
          </div>

          {/* Camera controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6">
            {/* Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 rounded-full glass flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <Upload size={18} />
            </button>

            {/* Capture button */}
            <button
              onClick={capturePhoto}
              className="relative w-16 h-16 rounded-full active:scale-95 transition-transform"
            >
              <div className="absolute inset-0 rounded-full border-4 border-white/60" />
              <div className={cn('absolute inset-1.5 rounded-full', config.buttonColor)} />
            </button>

            {/* Flip camera */}
            <button
              onClick={flipCamera}
              disabled={!hasMultipleCameras}
              className={cn(
                'w-11 h-11 rounded-full glass flex items-center justify-center text-white active:scale-95 transition-transform',
                !hasMultipleCameras && 'opacity-40'
              )}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      ) : (
        // Initial state - launch camera or upload
        <div className="space-y-3">
          {error && (
            <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={startCamera}
            className={cn(
              'w-full relative overflow-hidden rounded-2xl border-2 py-12 flex flex-col items-center gap-4 transition-all active:scale-[0.98]',
              config.accentColor,
              'bg-dark-800/50 hover:bg-dark-800'
            )}
          >
            <div className={cn('absolute inset-0', config.scanColor)} />
            <div className="relative">
              <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', config.buttonColor)}>
                <Camera size={28} className="text-white" />
              </div>
              {/* Ripple rings */}
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ animation: `ripple 2s ease-out ${i * 0.8}s infinite` }}
                />
              ))}
            </div>
            <div className="relative text-center">
              <p className="font-semibold text-white">{config.label}</p>
              <p className="text-xs text-dark-400 mt-1">Opens camera viewfinder</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl py-4 flex items-center justify-center gap-3 glass border-dark-600/50 border hover:bg-dark-700/50 transition-colors active:scale-[0.98]"
          >
            <Upload size={18} className="text-dark-400" />
            <span className="text-sm text-dark-300 font-medium">Upload from gallery</span>
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  )
}
