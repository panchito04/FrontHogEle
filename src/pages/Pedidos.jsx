import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Toast from '../components/common/Toast'

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
  const [filterCliente, setFilterCliente] = useState('todos')
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

      // Filtro por cliente
      const matchesCliente = filterCliente === 'todos' || 
        pedido.id_cliente?.toString() === filterCliente

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

      return matchesSearch && matchesEstado && matchesCliente && 
             matchesCategoria && matchesCaja && matchesFechaInicio && matchesFechaFin
    })
  }, [pedidos, searchTerm, filterEstado, filterCliente, filterCategoria, 
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
      showToast('✅ Venta registrada exitosamente', 'success')
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

    showToast('✅ Pago registrado y pedido entregado', 'success')
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
      showToast('❌ No se puede eliminar un pedido pagado o entregado', 'error')
      return
    }
    setDeletingPedidoId(pedido.id_pedido)
    setShowDeleteConfirm(true)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar user={user} />

      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        {/* Header MEJORADO - Similar a Productos */}
        <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan1-600 via-ocean1-600 to-pink-600 bg-clip-text text-transparent">
                  Pedidos y Ventas
                </h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">
                  Administra reservas y ventas
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPedidoModal(true)}
                  className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-cyan1-700 hover:to-ocean1-700 transition-all duration-200 flex items-center justify-center space-x-1.5 text-xs sm:text-sm shadow-lg hover:shadow-xl"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Reserva</span>
                </button>

                <button
                  onClick={() => setShowVentaModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-1.5 text-xs sm:text-sm shadow-lg hover:shadow-xl"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Venta</span>
                </button>
              </div>
            </div>

            {/* Tabs MEJORADOS */}
            <div className="flex gap-2 mt-4 border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('reservados')}
                className={`px-4 py-2 font-semibold transition-all relative whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === 'reservados'
                    ? 'text-cyan1-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Reservados</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-bold">
                    {pedidos.filter(p => p.estado === 'pendiente').length}
                  </span>
                </div>
                {activeTab === 'reservados' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan1-600 to-ocean1-600" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('vendidos')}
                className={`px-4 py-2 font-semibold transition-all relative whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === 'vendidos'
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Vendidos</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">
                    {pedidos.filter(p => p.estado === 'pagado' || p.estado === 'entregado').length}
                  </span>
                </div>
                {activeTab === 'vendidos' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* CAMBIO IMPORTANTE: Pasar pedidosFiltrados en lugar de pedidos */}
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
            filterCliente={filterCliente}
            setFilterCliente={setFilterCliente}
            filterCategoria={filterCategoria}
            setFilterCategoria={setFilterCategoria}
            filterCaja={filterCaja}
            setFilterCaja={setFilterCaja}
            filterFechaInicio={filterFechaInicio}
            setFilterFechaInicio={setFilterFechaInicio}
            filterFechaFin={filterFechaFin}
            setFilterFechaFin={setFilterFechaFin}
            clientes={clientes}
            categorias={categorias}
            cajas={cajas}
            activeTab={activeTab}
          />

          {/* Lista de Pedidos */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : pedidosFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-semibold">
                  No hay {activeTab === 'reservados' ? 'reservas' : 'ventas'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {activeTab === 'reservados' 
                    ? 'Crea tu primera reserva'
                    : 'Registra tu primera venta'
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
      </div>

      {/* Modales */}
      <PedidoModal
        isOpen={showPedidoModal}
        onClose={() => setShowPedidoModal(false)}
        onSubmit={handleCreatePedido}
        clientes={clientes}
        productos={productos}
      />

      <VentaModal
        isOpen={showVentaModal}
        onClose={() => setShowVentaModal(false)}
        onSubmit={handleCreateVenta}
        clientes={clientes}
        productos={productos}
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