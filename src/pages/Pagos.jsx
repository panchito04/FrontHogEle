import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import FormField from '../components/common/FormField'

function Pagos({ user }) {
  const location = useLocation()
  const [pagos, setPagos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newPago, setNewPago] = useState({
    id_pedido: '',
    monto: '',
    metodo: '',
    comprobante_url: ''
  })

  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [pagosRes, pedidosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/pagos`),
        fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`)
      ])
      
      const pagosData = await pagosRes.json()
      const pedidosData = await pedidosRes.json()
      
      const pgData = Array.isArray(pagosData) 
        ? pagosData 
        : (pagosData && Array.isArray(pagosData.data) ? pagosData.data : [])
      const pData = Array.isArray(pedidosData) 
        ? pedidosData 
        : (pedidosData && Array.isArray(pedidosData.data) ? pedidosData.data : [])
      
      setPagos(pgData)
      setPedidos(pData)
    } catch (error) {
      console.error('Error al obtener datos:', error)
      alert('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePago = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPago,
          id_pedido: parseInt(newPago.id_pedido),
          monto: parseFloat(newPago.monto)
        })
      })
      
      if (response.ok) {
        alert('Pago registrado exitosamente')
        setShowModal(false)
        setNewPago({ id_pedido: '', monto: '', metodo: '', comprobante_url: '' })
        fetchData()
      } else {
        alert('Error al registrar el pago')
      }
    } catch (error) {
      console.error('Error al crear pago:', error)
      alert('Error al registrar el pago')
    }
  }

  const getPedidoInfo = (id_pedido) => {
    if (!Array.isArray(pedidos)) return 'Desconocido'
    const pedido = pedidos.find(p => p.id_pedido === id_pedido)
    return pedido ? `Pedido #${pedido.id_pedido}` : 'Desconocido'
  }

  const getMetodoBadge = (metodo) => {
    const metodos = {
      'Efectivo': 'bg-emerald-50 text-emerald-800 border border-emerald-200/50',
      'Tarjeta': 'bg-blue-50 text-blue-800 border border-blue-200/50',
      'Transferencia': 'bg-purple-50 text-purple-800 border border-purple-200/50',
      'QR': 'bg-cyan1-50 text-cyan1-700 border border-cyan1-200/50',
      'Otro': 'bg-stone-50 text-stone-600 border border-stone-200/50'
    }
    return metodos[metodo] || 'bg-stone-50 text-stone-600 border border-stone-200/50'
  }

  const getMetodoIcon = (metodo) => {
    switch(metodo) {
      case 'Efectivo':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'Tarjeta':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'Transferencia':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      case 'QR':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        )
      default:
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const filteredPagos = Array.isArray(pagos) ? pagos.filter(pago => {
    const searchLower = searchTerm.toLowerCase()
    const pedidoInfo = getPedidoInfo(pago.id_pedido).toLowerCase()
    return (
      pago.id_pago?.toString().includes(searchLower) ||
      pedidoInfo.includes(searchLower) ||
      pago.metodo?.toLowerCase().includes(searchLower) ||
      pago.monto?.toString().includes(searchLower)
    )
  }) : []

  const totalMonto = filteredPagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0)

  const headerActions = [
    {
      label: 'Registrar Pago',
      variant: 'primary',
      onClick: () => setShowModal(true),
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-cream-luxury font-sans-premium">
      <Sidebar user={user} />
      
      <div className="flex-1 overflow-auto pt-16 lg:pt-0 pb-20 lg:pb-8">
        <PageHeader 
          title="Gestión de Pagos"
          description="Administra y rastrea todos los ingresos de caja del negocio"
          actions={headerActions}
        />

        {/* Contenido principal */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Métricas destacadas con diseño premium de boutique */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-stone-200/50 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-cyan1-550 flex items-center justify-center text-cyan1-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Total Transacciones</p>
                <p className="font-serif-editorial text-2xl font-bold text-stone-900 mt-0.5">{Array.isArray(pagos) ? pagos.length : 0}</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-stone-200/50 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Monto Recaudado</p>
                <p className="font-serif-editorial text-2xl font-bold text-emerald-600 mt-0.5">Bs. {totalMonto.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-stone-200/50 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l-4-4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Filtrados / Buscados</p>
                <p className="font-serif-editorial text-2xl font-bold text-purple-750 mt-0.5">{filteredPagos.length}</p>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda estilizada */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-stone-200/40 shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Busca transacciones por ID, pedido, método de pago o valor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 bg-white/70 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Vista Desktop - Tabla Premium */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-9 w-9 text-cyan1-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredPagos.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-serif-editorial text-base text-stone-800">No se encontraron pagos</h4>
                <p className="text-stone-400 text-xs mt-1">Prueba redefiniendo tu búsqueda</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-100">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Transacción</th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Origen Pedido</th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Monto Total</th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Método de Pago</th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                    {filteredPagos.map((pago) => (
                      <tr key={pago.id_pago} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-stone-400 font-sans-premium">#{pago.id_pago}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-cyan1-600">{getPedidoInfo(pago.id_pedido)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-stone-900">Bs. {parseFloat(pago.monto).toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex items-center gap-1.5 text-xs font-medium rounded-full ${getMetodoBadge(pago.metodo)}`}>
                            {getMetodoIcon(pago.metodo)}
                            <span>{pago.metodo}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-stone-600">
                            {new Date(pago.fecha).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pago.comprobante_url ? (
                            <a 
                              href={pago.comprobante_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan1-600 hover:text-cyan1-800 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Ver</span>
                            </a>
                          ) : (
                            <span className="text-xs text-stone-400 italic font-light">Sin enlace</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Vista Mobile - Premium Cards */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-9 w-9 text-cyan1-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredPagos.length === 0 ? (
              <div className="text-center py-16 bg-white/60 rounded-2xl border border-stone-200/50">
                <p className="text-stone-500 font-serif-editorial">No se encontraron registros</p>
              </div>
            ) : (
              filteredPagos.map((pago) => (
                <div key={pago.id_pago} className="bg-white rounded-2xl shadow-sm border border-stone-200/50 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif-editorial text-base text-stone-900 leading-tight">
                        {getPedidoInfo(pago.id_pedido)}
                      </h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold font-sans-premium mt-0.5">
                        Transacción #{pago.id_pago}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-stone-950">Bs. {parseFloat(pago.monto).toFixed(2)}</p>
                      <span className={`px-2 py-0.5 inline-flex items-center gap-1 text-[10px] font-medium rounded-full mt-1.5 ${getMetodoBadge(pago.metodo)}`}>
                        {getMetodoIcon(pago.metodo)}
                        <span>{pago.metodo}</span>
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(pago.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    
                    {pago.comprobante_url && (
                      <a 
                        href={pago.comprobante_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan1-600 hover:text-cyan1-850 inline-flex items-center gap-1 font-semibold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Comprobante</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Registro de Pago Modular y Estilizado */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setNewPago({ id_pedido: '', monto: '', metodo: '', comprobante_url: '' })
        }}
        title="Registrar Pago de Caja"
        subtitle="Agrega una nueva transacción vinculada a un pedido existente"
        maxWidth="max-w-md"
        theme="payment"
      >
        <form onSubmit={handleCreatePago} className="p-5 space-y-4">
          <FormField 
            label="Selecciona un Pedido"
            id="id_pedido"
            type="select"
            required
            value={newPago.id_pedido}
            placeholder="Elige una orden pendiente o completada..."
            onChange={(e) => setNewPago({...newPago, id_pedido: e.target.value})}
            options={Array.isArray(pedidos) ? pedidos.map(pedido => ({
              value: pedido.id_pedido,
              label: `Pedido #${pedido.id_pedido} - Estado: ${pedido.estado}`
            })) : []}
          />

          <FormField 
            label="Monto de Transacción (Bs.)"
            id="monto"
            type="number"
            required
            placeholder="0.00"
            value={newPago.monto}
            onChange={(e) => setNewPago({...newPago, monto: e.target.value})}
          />

          <FormField 
            label="Método de Pago"
            id="metodo"
            type="select"
            required
            placeholder="Elige la forma de cobro..."
            value={newPago.metodo}
            onChange={(e) => setNewPago({...newPago, metodo: e.target.value})}
            options={[
              { value: 'Efectivo', label: 'Efectivo' },
              { value: 'Tarjeta', label: 'Tarjeta de Crédito/Débito' },
              { value: 'Transferencia', label: 'Transferencia Bancaria' },
              { value: 'QR', label: 'Pago QR' },
              { value: 'Otro', label: 'Otro' }
            ]}
          />

          <FormField 
            label="Enlace del Comprobante (Opcional)"
            id="comprobante_url"
            type="url"
            placeholder="https://ejemplo.com/archivo-digital.pdf"
            value={newPago.comprobante_url}
            onChange={(e) => setNewPago({...newPago, comprobante_url: e.target.value})}
          />

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setNewPago({ id_pedido: '', monto: '', metodo: '', comprobante_url: '' })
              }}
              className="flex-1 py-3 text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-all font-medium text-sm text-center active:scale-[0.98]"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="flex-1 py-3 text-white bg-cyan1-600 hover:bg-cyan1-700 rounded-xl transition-all font-semibold text-sm text-center shadow-md active:scale-[0.98]"
            >
              Guardar Pago
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Pagos