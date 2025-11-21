import { useRef, useState, useEffect } from 'react'

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)

  // Dimensiones del recuadro de captura (puedes ajustarlas)
  const CAPTURE_WIDTH = 300
  const CAPTURE_HEIGHT = 300

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Cámara trasera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    
    // Establecer el tamaño del canvas al tamaño del recuadro
    canvas.width = CAPTURE_WIDTH
    canvas.height = CAPTURE_HEIGHT

    // Calcular la posición central del recuadro en el video
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight
    
    const sx = (videoWidth - CAPTURE_WIDTH) / 2  // Posición X de inicio en el video
    const sy = (videoHeight - CAPTURE_HEIGHT) / 2 // Posición Y de inicio en el video

    // Dibujar solo la parte del video que está dentro del recuadro
    ctx.drawImage(
      video,
      sx, sy,                    // Posición de inicio en el video fuente
      CAPTURE_WIDTH, CAPTURE_HEIGHT, // Tamaño a capturar del video
      0, 0,                      // Posición en el canvas destino
      CAPTURE_WIDTH, CAPTURE_HEIGHT  // Tamaño en el canvas destino
    )

    // Convertir a blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'foto.jpg', { type: 'image/jpeg' })
        onCapture(file, URL.createObjectURL(blob))
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error de Cámara</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">📸 Capturar Foto</h3>
        <button
          onClick={() => {
            stopCamera()
            onClose()
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Vista de la cámara */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        {/* Recuadro de captura centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative border-4 border-white rounded-2xl shadow-2xl"
            style={{ 
              width: `${CAPTURE_WIDTH}px`, 
              height: `${CAPTURE_HEIGHT}px` 
            }}
          >
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 -mb-1 -mr-1"></div>
            
            {/* Texto instructivo */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-white font-semibold text-sm drop-shadow-lg">
                Centra el producto en el recuadro
              </p>
            </div>
          </div>
        </div>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Botón de captura */}
      <div className="bg-gradient-to-t from-black to-transparent p-6 flex justify-center">
        <button
          onClick={capturePhoto}
          className="bg-white hover:bg-gray-100 text-gray-800 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-4 border-gray-300"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

export default CameraCapture