import { useRef, useState } from 'react'

function CameraCapture({ onCapture, onClose }) {
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Dimensiones del recuadro de captura
  const CAPTURE_SIZE = 400

  const handleNativeCapture = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsProcessing(true)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setCapturedImage({ img, file })
        setIsProcessing(false)
      }
      img.src = event.target.result
    }
    
    reader.readAsDataURL(file)
  }

  const cropAndSave = () => {
  if (!capturedImage) return

  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const { img } = capturedImage

  // Calcular el tamaño real del recuadro en la imagen original
  // El recuadro es de CAPTURE_SIZE px en pantalla, pero necesitamos su tamaño real en la imagen
  
  const minDimension = Math.min(img.width, img.height)
  
  // El recuadro cubre el área cuadrada central SIN ESCALAR
  // Tomamos exactamente minDimension x minDimension píxeles del centro
  canvas.width = minDimension
  canvas.height = minDimension

  // Calcular posición del centro
  const sx = (img.width - minDimension) / 2
  const sy = (img.height - minDimension) / 2

  // Dibujar SIN ESCALAR - tamaño 1:1
  ctx.drawImage(
    img,
    sx, sy,                    // Inicio en la imagen original
    minDimension, minDimension, // Tamaño a capturar
    0, 0,                      // Posición en canvas
    minDimension, minDimension  // MISMO tamaño en canvas (sin escalar)
  )

  // Convertir a blob con alta calidad
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], 'producto.jpg', { type: 'image/jpeg' })
      onCapture(file, URL.createObjectURL(blob))
    }
  }, 'image/jpeg', 0.95)
}

  const retake = () => {
    setCapturedImage(null)
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
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

      {/* Input oculto para cámara nativa */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeCapture}
        className="hidden"
      />

      {/* Canvas oculto para procesamiento */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Vista principal */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {isProcessing ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-semibold">Procesando imagen...</p>
          </div>
        ) : capturedImage ? (
          /* Preview con recuadro de recorte */
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative" style={{ maxWidth: '90%', maxHeight: '90%' }}>
              <img
                src={capturedImage.img.src}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              
              {/* Overlay con recuadro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="border-4 border-green-400 rounded-2xl shadow-2xl"
                  style={{
                    width: `${CAPTURE_SIZE}px`,
                    height: `${CAPTURE_SIZE}px`,
                    maxWidth: '90%',
                    maxHeight: '90%'
                  }}
                >
                  {/* Esquinas decorativas */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 right-0 text-center px-4">
              <p className="text-white font-semibold text-sm drop-shadow-lg bg-black bg-opacity-50 rounded-lg py-2 px-4 inline-block">
                ✂️ Se guardará solo el área dentro del recuadro verde
              </p>
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
                <li>✓ Asegúrate de tener buena luz natural o artificial</li>
                <li>✓ Mantén el teléfono estable al tomar la foto</li>
                <li>✓ Centra el producto en el recuadro que aparecerá</li>
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
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
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