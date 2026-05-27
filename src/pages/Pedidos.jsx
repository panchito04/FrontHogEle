import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Toast from '../components/common/Toast'
import PageHeader from '../components/common/PageHeader'

import { usePedidos } from '../hooks/usePedidos'
import { useClientes } from '../hooks/useClientes'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../hooks/useCategorias'
import { useCajas } from '../hooks/useCajas'
import { useToast } from '../hooks/useToast'

import PedidoStats from '../components/pedidos/PedidoStats'
import PedidoFilters from '../components/pedidos/PedidoFilters'
import PedidoCard from '../components/pedidos/PedidoCard'
import PedidoModal from '../components/pedidos/PedidoModal'
import VentaModal from '../components/pedidos/VentaModal'
import PedidoDetailModal from '../components/pedidos/PedidoDetailModal'
import DeleteConfirmModal from '../components/pedidos/DeleteConfirmModal'
import PagoEntregaModal from '../components/pedidos/PagoEntregaModal'

function Pedidos({ user }) {
  const { pedidos, isLoading, fetchPedidos, createPedido, updatePedido, deletePedido, registrarPago } = usePedidos()
  const { clientes, fetchClientes } = useClientes()
  const { productos, fetchProductos } = useProductos()
  const { categorias, fetchCategorias } = useCategorias()
  const { cajas, fetchCajas } = useCajas()
  const { toast, showToast, hideToast } = useToast()

  const [activeTab, setActiveTab] = useState('reservados')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [filterCaja, setFilterCaja] = useState('todas')
  const [filterFechaInicio, setFilterFechaInicio] = useState('')
  const [filterFechaFin, setFilterFechaFin] = useState('')

  const [showPedidoModal, setShowPedidoModal] = useState(false)
  const [showVentaModal, setShowVentaModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPagoModal, setShowPagoModal] = useState(false)

  const [selectedPedido, setSelectedPedido] = useState(null)
  const [deletingPedidoId, setDeletingPedidoId] = useState(null)
  const [pedidoParaEntregar, setPedidoParaEntregar] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPedidos(),
        fetchClientes(),
        fetchProductos(),
        fetchCategorias(),
        fetchCajas()
      ])
    }
    loadData()
  }, [])

  // Filtrar pedidos con TODOS los filtros
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(pedido => {
      // Filtro por tab
      if (activeTab === 'reservados') {
        if (pedido.estado !== 'pendiente') return false
      } else if (activeTab === 'vendidos') {
        if (pedido.estado === 'cancelado') return false
        if (pedido.estado === 'pendiente') return false
      }

      // Filtro por búsqueda
      const cliente = clientes.find(c => c.id_cliente === pedido.id_cliente)
      const clienteNombre = cliente?.nombre?.toLowerCase() || ''
      const searchLower = searchTerm.toLowerCase()

      const matchesSearch = 
        pedido.id_pedido.toString().includes(searchLower) ||
        clienteNombre.includes(searchLower) ||
        pedido.observaciones?.toLowerCase().includes(searchLower)

      // Filtro por estado
      const matchesEstado = filterEstado === 'todos' || pedido.estado === filterEstado

      // Filtro por categoría (revisar productos del pedido)
      const matchesCategoria = filterCategoria === 'todas' || 
        pedido.detalles?.some(detalle => {
          const producto = productos.find(p => p.id_producto === detalle.id_producto)
          return producto?.id_categoria?.toString() === filterCategoria
        })

      // Filtro por caja (revisar productos del pedido)
      const matchesCaja = filterCaja === 'todas' ||
        pedido.detalles?.some(detalle => {
          const producto = productos.find(p => p.id_producto === detalle.id_producto)
          return producto?.id_caja?.toString() === filterCaja
        })

      // Filtro por rango de fechas
      const pedidoFecha = new Date(pedido.fecha)
      const matchesFechaInicio = !filterFechaInicio || 
        pedidoFecha >= new Date(filterFechaInicio + 'T00:00:00')
      const matchesFechaFin = !filterFechaFin || 
        pedidoFecha <= new Date(filterFechaFin + 'T23:59:59')

      return matchesSearch && matchesEstado && 
             matchesCategoria && matchesCaja && matchesFechaInicio && matchesFechaFin
    })
  }, [pedidos, searchTerm, filterEstado, filterCategoria, 
      filterCaja, filterFechaInicio, filterFechaFin, activeTab, clientes, productos])

  const handleCreatePedido = async (pedidoData) => {
    const result = await createPedido(pedidoData)
    
    if (result.success) {
      showToast(result.message, 'success')
      setShowPedidoModal(false)
      await fetchProductos()
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleCreateVenta = async (ventaData) => {
    const result = await createPedido(ventaData)
    
    if (result.success) {
      showToast('Venta registrada exitosamente', 'success')
      setShowVentaModal(false)
      await fetchProductos()
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleUpdateEstado = async (id, nuevoEstado) => {
    const result = await updatePedido(id, { estado: nuevoEstado })
    
    if (result.success) {
      showToast(result.message, 'success')
      setShowDetailModal(false)
      setSelectedPedido(null)
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleEntregar = (pedido) => {
    setPedidoParaEntregar(pedido)
    setShowPagoModal(true)
  }

  const handleConfirmarPago = async (pagoData) => {
    if (!pedidoParaEntregar) return

    const resultPago = await registrarPago(pedidoParaEntregar.id_pedido, pagoData)
    
    if (!resultPago.success) {
      showToast(resultPago.message, 'error')
      return
    }

    showToast('Pago registrado y pedido entregado', 'success')
    setPedidoParaEntregar(null)
    await fetchProductos()
  }

  const handleDeletePedido = async () => {
    const result = await deletePedido(deletingPedidoId)
    
    if (result.success) {
      showToast(result.message, 'success')
      setShowDeleteConfirm(false)
      setDeletingPedidoId(null)
      await fetchProductos()
    } else {
      showToast(result.message, 'error')
    }
  }

  const openDetailModal = (pedido) => {
    setSelectedPedido(pedido)
    setShowDetailModal(true)
  }

  const confirmDelete = (pedido) => {
    if (pedido.estado === 'pagado' || pedido.estado === 'entregado') {
      showToast('No se puede eliminar un pedido pagado o entregado', 'error')
      return
    }
    setDeletingPedidoId(pedido.id_pedido)
    setShowDeleteConfirm(true)
  }

  const headerActions = [
    {
      label: 'Registrar Reserva',
      variant: 'secondary',
      onClick: () => setShowPedidoModal(true),
      icon: (
        <svg className="w-4 h-4 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      label: 'Registrar Venta',
      variant: 'primary',
      onClick: () => setShowVentaModal(true),
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-cream-luxury font-sans-premium">
      <Sidebar user={user} />

      <div className="flex-1 overflow-auto pt-16 lg:pt-0 pb-20 lg:pb-8">
        <PageHeader 
          title="Pedidos y Ventas"
          description="Monitorea y registra reservas y ventas directas"
          actions={headerActions}
        />

        {/* Contenido Principal */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Segmented Pill Selector (Aesthetic Tabs) */}
          <div className="flex justify-center sm:justify-start">
            <div className="bg-stone-200/50 p-1 rounded-xl flex space-x-1 border border-stone-200/40">
              <button
                onClick={() => setActiveTab('reservados')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'reservados'
                    ? 'bg-white text-cyan1-600 shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-white/30'
                }`}
              >
                <span>Reservas</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'reservados' ? 'bg-cyan1-50 text-cyan1-700' : 'bg-stone-200 text-stone-600'
                }`}>
                  {pedidos.filter(p => p.estado === 'pendiente').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('vendidos')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === 'vendidos'
                    ? 'bg-cyan1-600 text-white shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-white/30'
                }`}
              >
                <span>Ventas</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'vendidos' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {pedidos.filter(p => p.estado === 'pagado' || p.estado === 'entregado').length}
                </span>
              </button>
            </div>
          </div>

          <PedidoStats
            pedidos={pedidosFiltrados}
            pedidosFiltrados={pedidosFiltrados}
            activeTab={activeTab}
          />

          <PedidoFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterEstado={filterEstado}
            setFilterEstado={setFilterEstado}
            filterCategoria={filterCategoria}
            setFilterCategoria={setFilterCategoria}
            filterCaja={filterCaja}
            setFilterCaja={setFilterCaja}
            filterFechaInicio={filterFechaInicio}
            setFilterFechaInicio={setFilterFechaInicio}
            filterFechaFin={filterFechaFin}
            setFilterFechaFin={setFilterFechaFin}
            categorias={categorias}
            cajas={cajas}
            activeTab={activeTab}
          />

          {/* Grid de Pedidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/60 border border-stone-200/50 rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="h-6 bg-stone-200 rounded w-1/2"></div>
                  <div className="h-4 bg-stone-200 rounded w-full"></div>
                  <div className="h-10 bg-stone-200 rounded w-full"></div>
                </div>
              ))
            ) : pedidosFiltrados.length === 0 ? (
              <div className="col-span-full py-16 bg-white/40 border border-stone-200/40 rounded-3xl text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-serif-editorial text-lg text-stone-800">
                  No hay {activeTab === 'reservados' ? 'reservas' : 'ventas'} registradas
                </h3>
                <p className="text-stone-500 text-xs mt-1.5 max-w-xs font-light">
                  {activeTab === 'reservados' 
                    ? 'Comienza registrando una reserva con el botón superior'
                    : 'Comienza registrando una venta con el botón superior'
                  }
                </p>
              </div>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <PedidoCard
                  key={pedido.id_pedido}
                  pedido={pedido}
                  clientes={clientes}
                  productos={productos}
                  onViewDetail={openDetailModal}
                  onDelete={confirmDelete}
                  onUpdateEstado={handleUpdateEstado}
                  onEntregar={handleEntregar}
                />
              ))
            )}
          </div>
        </div>

        {/* Floating Action Button for Mobile Users */}
        <div className="fixed bottom-24 right-5 lg:hidden flex flex-col space-y-3.5 z-30">
          <button
            onClick={() => setShowPedidoModal(true)}
            className="w-12 h-12 rounded-full bg-white text-cyan1-600 shadow-lg border border-stone-200/50 flex items-center justify-center active:scale-95 transition-transform"
            title="Nueva Reserva"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowVentaModal(true)}
            className="w-14 h-14 rounded-full bg-cyan1-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
            title="Nueva Venta"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modales unificados y actualizados */}
      <PedidoModal
        isOpen={showPedidoModal}
        onClose={() => setShowPedidoModal(false)}
        onSubmit={handleCreatePedido}
        productos={productos}
        user={user}
      />

      <VentaModal
        isOpen={showVentaModal}
        onClose={() => setShowVentaModal(false)}
        onSubmit={handleCreateVenta}
        productos={productos}
        user={user}
      />

      {showDetailModal && selectedPedido && (
        <PedidoDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedPedido(null)
          }}
          pedido={selectedPedido}
          clientes={clientes}
          productos={productos}
          onUpdateEstado={handleUpdateEstado}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeletingPedidoId(null)
        }}
        onConfirm={handleDeletePedido}
      />

      <PagoEntregaModal
        isOpen={showPagoModal}
        onClose={() => {
          setShowPagoModal(false)
          setPedidoParaEntregar(null)
        }}
        onConfirm={handleConfirmarPago}
        pedido={pedidoParaEntregar}
        productos={productos}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={toast.duration}
        />
      )}
    </div>
  )
}

export default Pedidos