import { useRef, useState, useEffect } from 'react'

function CameraCapture({ onCapture, onClose, initialFile = null }) {
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const imageContainerRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [cropPosition, setCropPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const CAPTURE_SIZE = 250

  useEffect(() => {
    if (initialFile) {
      loadImageFromFile(initialFile)
    }
  }, [initialFile])

  const loadImageFromFile = (file) => {
    setIsProcessing(true)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setCapturedImage({ img, file })
        setCropPosition({ x: 50, y: 50 })
        setIsProcessing(false)
      }
      img.src = event.target.result
    }
    
    reader.readAsDataURL(file)
  }

  const handleNativeCapture = (e) => {
    const file = e.target.files[0]
    if (!file) return
    loadImageFromFile(file)
  }

  const handleTouchStart = (e) => {
    if (!capturedImage) return
    e.preventDefault()
    
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      cropX: cropPosition.x,
      cropY: cropPosition.y
    })
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !capturedImage || !imageContainerRef.current) return
    e.preventDefault()

    const touch = e.touches[0]
    const container = imageContainerRef.current.getBoundingClientRect()
    
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    
    const percentX = (deltaX / container.width) * 100
    const percentY = (deltaY / container.height) * 100
    
    let newX = dragStart.cropX + percentX
    let newY = dragStart.cropY + percentY
    
    const margin = (CAPTURE_SIZE / Math.min(container.width, container.height)) * 50
    newX = Math.max(margin, Math.min(100 - margin, newX))
    newY = Math.max(margin, Math.min(100 - margin, newY))
    
    setCropPosition({ x: newX, y: newY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e) => {
    if (!capturedImage) return
    e.preventDefault()
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      cropX: cropPosition.x,
      cropY: cropPosition.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !capturedImage || !imageContainerRef.current) return
    e.preventDefault()

    const container = imageContainerRef.current.getBoundingClientRect()
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    const percentX = (deltaX / container.width) * 100
    const percentY = (deltaY / container.height) * 100
    
    let newX = dragStart.cropX + percentX
    let newY = dragStart.cropY + percentY
    
    const margin = (CAPTURE_SIZE / Math.min(container.width, container.height)) * 50
    newX = Math.max(margin, Math.min(100 - margin, newX))
    newY = Math.max(margin, Math.min(100 - margin, newY))
    
    setCropPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, cropPosition])

  const cropAndSave = () => {
    if (!capturedImage || !imageContainerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { img } = capturedImage
    const container = imageContainerRef.current.getBoundingClientRect()

    const displayWidth = container.width
    const displayHeight = container.height
    const scale = img.width / displayWidth

    const cropSizeInImage = CAPTURE_SIZE * scale

    const cropX = (cropPosition.x / 100) * img.width - (cropSizeInImage / 2)
    const cropY = (cropPosition.y / 100) * img.height - (cropSizeInImage / 2)

    canvas.width = cropSizeInImage
    canvas.height = cropSizeInImage

    ctx.drawImage(
      img,
      cropX, cropY,
      cropSizeInImage, cropSizeInImage,
      0, 0,
      cropSizeInImage, cropSizeInImage
    )

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'producto.jpg', { type: 'image/jpeg' })
        const previewUrl = URL.createObjectURL(blob)
        onCapture(file, previewUrl)
      }
    }, 'image/jpeg', 0.95)
  }

  const retake = () => {
    setCapturedImage(null)
    setCropPosition({ x: 50, y: 50 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerCamera = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 bg-stone-950 z-50 flex flex-col font-sans-premium">
      {/* Top bar with glassmorphism */}
      <div className="bg-stone-900/60 backdrop-blur-md border-b border-stone-800/80 px-6 py-4 flex items-center justify-between z-10">
        <h3 className="text-white font-serif-editorial text-lg tracking-wide">
          {initialFile ? 'Cortar Imagen de Producto' : 'Capturar Producto'}
        </h3>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeCapture}
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />

      {/* Main viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-stone-900">
        {isProcessing ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-stone-400 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-stone-300 text-sm font-light tracking-wide">Procesando imagen...</p>
          </div>
        ) : capturedImage ? (
          <div 
            ref={imageContainerRef}
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{ touchAction: 'none' }}
          >
            <img
              src={capturedImage.img.src}
              alt="Preview"
              className="max-w-full max-h-full object-contain select-none"
              draggable="false"
            />
            
            {/* Dark mask overlay around viewport */}
            <div className="absolute inset-0 bg-stone-950/50 pointer-events-none" />

            {/* Custom high-end targeting viewfinder box */}
            <div
              className="absolute border-2 border-ocean1-600 rounded-2xl shadow-2xl cursor-move transition-shadow duration-300"
              style={{
                width: `${CAPTURE_SIZE}px`,
                height: `${CAPTURE_SIZE}px`,
                left: `${cropPosition.x}%`,
                top: `${cropPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(12, 10, 9, 0.65)'
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-white -mt-0.5 -ml-0.5 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-white -mt-0.5 -mr-0.5 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-white -mb-0.5 -ml-0.5 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-white -mb-0.5 -mr-0.5 rounded-br-lg"></div>

              {/* Central crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-6 h-6 border border-white/50 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Guidelines banner */}
            <div className="absolute top-6 left-0 right-0 text-center px-4 pointer-events-none z-10">
              <div className="bg-stone-950/80 backdrop-blur-md rounded-full py-2 px-5 inline-flex items-center space-x-2 border border-stone-800 shadow-lg">
                <span className="w-2.5 h-2.5 bg-ocean1-600 rounded-full animate-ping"></span>
                <p className="text-white text-xs font-medium tracking-wide">
                  Arrastra el recuadro para encuadrar tu producto
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center px-6 max-w-sm">
            <div className="bg-stone-900/60 backdrop-blur-md rounded-3xl p-8 mb-6 border border-stone-800/80 shadow-xl">
              <div className="w-20 h-20 bg-stone-800/60 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-700/50">
                <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-white font-serif-editorial text-xl mb-1.5">Fotografía de Catálogo</h3>
              <p className="text-stone-400 text-xs font-light tracking-wide">
                Registra fotos limpias para vestir el catálogo digital de lujo
              </p>
            </div>

            <div className="bg-stone-900/40 rounded-2xl p-4 border border-stone-800/60 text-left space-y-2">
              <p className="text-stone-300 text-xs font-semibold tracking-wider uppercase">Recomendaciones:</p>
              <ul className="text-stone-400 text-xs space-y-1.5 font-light">
                <li className="flex items-center space-x-2">
                  <span className="text-ocean1-600">•</span>
                  <span>Usa un fondo liso, idealmente de color claro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-ocean1-600">•</span>
                  <span>Asegúrate de tener luz indirecta o de día</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-ocean1-600">•</span>
                  <span>Sostén el encuadre centrado al capturar</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-stone-950 px-6 py-6 border-t border-stone-900/80">
        {capturedImage ? (
          <div className="flex gap-4 max-w-sm mx-auto">
            <button
              onClick={retake}
              className="flex-1 py-3.5 bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-xl font-medium text-xs tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 border border-stone-700/40 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Tomar Otra</span>
            </button>
            
            <button
              onClick={cropAndSave}
              className="flex-1 py-3.5 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-cyan1-600/10 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Aplicar Corte</span>
            </button>
          </div>
        ) : (
          <button
            onClick={triggerCamera}
            disabled={isProcessing}
            className="w-16 h-16 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 mx-auto border-4 border-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-cyan1-600 rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default CameraCapture