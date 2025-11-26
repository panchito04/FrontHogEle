import { useRef, useState, useEffect } from 'react'

function CameraCapture({ onCapture, onClose }) {
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const imageContainerRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Posición del recuadro (porcentajes de la imagen)
  const [cropPosition, setCropPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Tamaño del recuadro más pequeño
  const CAPTURE_SIZE = 250 // Reducido de 400 a 250

  const handleNativeCapture = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsProcessing(true)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setCapturedImage({ img, file })
        setCropPosition({ x: 50, y: 50 }) // Reset posición al centro
        setIsProcessing(false)
      }
      img.src = event.target.result
    }
    
    reader.readAsDataURL(file)
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
    
    // Calcular movimiento en píxeles
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    
    // Convertir a porcentaje de la imagen
    const percentX = (deltaX / container.width) * 100
    const percentY = (deltaY / container.height) * 100
    
    // Nueva posición con límites
    let newX = dragStart.cropX + percentX
    let newY = dragStart.cropY + percentY
    
    // Límites para que el recuadro no salga de la imagen
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

    // ESTA PARTE ES CRÍTICA - DEBE LLAMAR A onCapture
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'producto.jpg', { type: 'image/jpeg' })
        const previewUrl = URL.createObjectURL(blob) // ASEGURAR QUE ESTA LÍNEA EXISTE
        onCapture(file, previewUrl) // DEBE PASAR AMBOS PARÁMETROS
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 p-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">📸 Capturar Producto</h3>
        <button
          onClick={onClose}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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

      {/* Vista principal */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-900">
        {isProcessing ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-semibold">Procesando imagen...</p>
          </div>
        ) : capturedImage ? (
          /* Preview con recuadro movible */
          <div 
            ref={imageContainerRef}
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{ touchAction: 'none' }}
          >
            {/* Imagen completa */}
            <img
              src={capturedImage.img.src}
              alt="Preview"
              className="max-w-full max-h-full object-contain select-none"
              draggable="false"
            />
            
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none" />

            {/* Recuadro movible */}
            <div
              className="absolute border-4 border-green-400 rounded-xl shadow-2xl cursor-move"
              style={{
                width: `${CAPTURE_SIZE}px`,
                height: `${CAPTURE_SIZE}px`,
                left: `${cropPosition.x}%`,
                top: `${cropPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Esquinas decorativas */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white -mb-1 -mr-1"></div>

              {/* Cruz central */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 border-2 border-white rounded-full bg-green-400 bg-opacity-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="absolute top-4 left-0 right-0 text-center px-4 pointer-events-none">
              <div className="bg-black bg-opacity-70 rounded-lg py-2 px-4 inline-flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
                <p className="text-white font-semibold text-sm">
                  Arrastra el recuadro para ajustar
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Pantalla inicial */
          <div className="text-center px-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 mb-6">
              <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-white text-2xl font-bold mb-2">Fotografía tu producto</h3>
              <p className="text-gray-300 text-sm mb-4">Usa buena iluminación para mejores resultados</p>
            </div>

            <div className="bg-yellow-500 bg-opacity-20 border-2 border-yellow-400 rounded-xl p-4 mb-6">
              <p className="text-yellow-200 text-sm font-semibold mb-2">💡 Consejos:</p>
              <ul className="text-yellow-100 text-xs space-y-1 text-left">
                <li>✓ Coloca el producto en un fondo limpio</li>
                <li>✓ Asegúrate de tener buena luz</li>
                <li>✓ Mantén el teléfono estable</li>
                <li>✓ Podrás ajustar el recuadro después</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="bg-gradient-to-t from-black to-transparent p-6">
        {capturedImage ? (
          <div className="flex gap-3 justify-center">
            <button
              onClick={retake}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Tomar otra</span>
            </button>
            <button
              onClick={cropAndSave}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Usar esta foto</span>
            </button>
          </div>
        ) : (
          <button
            onClick={triggerCamera}
            disabled={isProcessing}
            className="bg-white hover:bg-gray-100 text-gray-800 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-4 border-gray-300 mx-auto disabled:opacity-50"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-cyan1-600 to-ocean1-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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