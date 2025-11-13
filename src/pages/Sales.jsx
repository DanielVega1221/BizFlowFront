import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { Spinner } from '../components/Spinner';
import { Dropdown, DropdownItem } from '../components/Dropdown';
import { useForm } from '../hooks/useForm';
import { useToast, ToastContainer } from '../components/Toast';
import { salesAPI, clientsAPI } from '../api/services';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import { 
  exportToExcel, 
  exportToCSV, 
  exportSalesToPDF, 
  prepareSalesData 
} from '../utils/exportUtils';
import { validateSaleForm } from '../utils/validators';
import { salesTour } from '../utils/appTour';

export const Sales = () => {
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]); // Para exportación
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const { toasts, addToast, removeToast } = useToast();

  const { values, handleChange, setValues, reset } = useForm({
    clientId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchAllSales();
  }, [page]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAll({ page, limit: 10 });
      setSales(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      addToast('Error al cargar ventas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSales = async () => {
    try {
      const response = await salesAPI.getAll({ limit: 10000 });
      setAllSales(response.data);
    } catch (error) {
      console.error('Error loading all sales');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll({ limit: 100 });
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients');
    }
  };

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setEditingSale(sale);
      setValues({
        clientId: sale.client?._id || '',
        amount: sale.amount,
        description: sale.description || '',
        date: new Date(sale.date).toISOString().split('T')[0],
        status: sale.status
      });
    } else {
      setEditingSale(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar datos del formulario
    const validation = validateSaleForm(values);
    if (!validation.isValid) {
      addToast(validation.errors[0], 'error');
      return;
    }
    
    try {
      if (editingSale) {
        await salesAPI.update(editingSale._id, values);
        addToast('Venta actualizada exitosamente', 'success');
      } else {
        await salesAPI.create(values);
        addToast('Venta creada exitosamente', 'success');
      }
      handleCloseModal();
      fetchSales();
    } catch (error) {
      addToast(error.response?.data?.error || 'Error al guardar venta', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta venta?')) return;
    
    try {
      await salesAPI.delete(id);
      addToast('Venta eliminada exitosamente', 'success');
      fetchSales();
    } catch (error) {
      addToast('Error al eliminar venta', 'error');
    }
  };

  // Funciones de exportación
  const handleExportExcel = () => {
    const data = prepareSalesData(filteredSales);
    exportToExcel(data, `ventas_${new Date().toISOString().split('T')[0]}`, 'Ventas');
    addToast('Exportado a Excel exitosamente', 'success');
  };

  const handleExportCSV = () => {
    const data = prepareSalesData(filteredSales);
    exportToCSV(data, `ventas_${new Date().toISOString().split('T')[0]}`);
    addToast('Exportado a CSV exitosamente', 'success');
  };

  const handleExportPDF = () => {
    exportSalesToPDF(filteredSales, `ventas_${new Date().toISOString().split('T')[0]}`);
    addToast('Exportado a PDF exitosamente', 'success');
  };

  // Filtrado de ventas
  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const matchesSearch = !searchTerm || 
        sale.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
      
      const saleDate = new Date(sale.date);
      const matchesDateFrom = !dateFrom || saleDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || saleDate <= new Date(dateTo);
      
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [allSales, searchTerm, statusFilter, dateFrom, dateTo]);

  const statusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'Pendiente',
      paid: 'Pagada',
      cancelled: 'Cancelada'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Botón de ayuda flotante */}
      <button
        onClick={salesTour}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl"
        title="Ver tutorial de Ventas"
      >
        ❓
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ventas</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Gestiona tus operaciones comerciales</p>
            </div>
            <div className="flex gap-2">
              <Dropdown
                id="export-sales-btn"
                trigger={
                <Button variant="secondary" className="text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
              }
            >
              <DropdownItem onClick={handleExportExcel}>
                📊 Exportar a Excel
              </DropdownItem>
              <DropdownItem onClick={handleExportCSV}>
                📄 Exportar a CSV
              </DropdownItem>
              <DropdownItem onClick={handleExportPDF}>
                📕 Exportar a PDF
              </DropdownItem>
            </Dropdown>
              <Button id="new-sale-btn" onClick={() => handleOpenModal()} className="text-sm sm:text-base">
                <span className="sm:hidden">+ Nueva</span>
                <span className="hidden sm:inline">+ Nueva Venta</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card id="filters-container" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                label="🔍 Buscar"
                placeholder="Ej: Juan Pérez, Servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Busca por cliente o descripción</p>
            </div>
            <div>
              <Select
                id="status-filter"
                label="📋 Estado"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'pending', label: '⏳ Pendientes' },
                  { value: 'paid', label: '✅ Pagadas' },
                  { value: 'cancelled', label: '❌ Canceladas' }
                ]}
              />
            </div>
            <div id="date-filters">
              <Input
                label="📅 Desde"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="📅 Hasta"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          {(searchTerm || statusFilter !== 'all' || dateFrom || dateTo) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredSales.length} venta{filteredSales.length !== 1 ? 's' : ''} encontrada{filteredSales.length !== 1 ? 's' : ''}
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </Card>

        {/* Sales Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <Spinner size="lg" className="py-8" />
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron ventas</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || dateFrom || dateTo
                  ? 'Intenta ajustar los filtros para ver más resultados'
                  : '¡Crea tu primera venta para comenzar!'}
              </p>
              {!searchTerm && statusFilter === 'all' && !dateFrom && !dateTo && (
                <Button onClick={() => setShowModal(true)} className="mt-2">
                  ➕ Crear Primera Venta
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Vista de tabla para desktop */}
              <div id="sales-table" className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Cliente</th>
                      <th className="text-left py-3 px-4">Descripción</th>
                      <th className="text-left py-3 px-4">Monto</th>
                      <th className="text-left py-3 px-4">Fecha</th>
                      <th className="text-left py-3 px-4">Estado</th>
                      <th className="text-right py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{sale.client?.name || 'N/A'}</td>
                        <td className="py-3 px-4">{sale.description || '-'}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(sale.amount)}</td>
                        <td className="py-3 px-4">{formatDateShort(sale.date)}</td>
                        <td className="py-3 px-4">{statusBadge(sale.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="secondary"
                            onClick={() => handleOpenModal(sale)}
                            className="mr-2 text-sm"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(sale._id)}
                            className="text-sm"
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de tarjetas para móvil */}
              <div className="md:hidden space-y-4">
                {filteredSales.map((sale) => (
                  <div key={sale._id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{sale.client?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mt-1">{sale.description || '-'}</p>
                      </div>
                      {statusBadge(sale.status)}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(sale.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDateShort(sale.date)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleOpenModal(sale)}
                          className="text-xs px-3 py-1"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(sale._id)}
                          className="text-xs px-3 py-1"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination - solo mostrar si no hay filtros activos */}
          {totalPages > 1 && !searchTerm && statusFilter === 'all' && !dateFrom && !dateTo && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="px-4 py-2">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSale ? '✏️ Editar Venta' : '➕ Nueva Venta'}
      >
        <p className="text-sm text-gray-600 mb-4">
          {editingSale 
            ? 'Modifica los datos de la venta existente'
            : '💡 Completa los datos para registrar una nueva venta en el sistema'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select
              label="👤 Cliente"
              name="clientId"
              value={values.clientId}
              onChange={handleChange}
              options={clients.map(c => ({ value: c._id, label: c.name }))}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Selecciona el cliente asociado a esta venta</p>
          </div>
          
          <div>
            <Input
              label="💰 Monto"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Ej: 15000.00"
              value={values.amount}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Ingresa el monto total en pesos argentinos (ARS)</p>
          </div>
          
          <div>
            <Input
              label="📝 Descripción"
              name="description"
              placeholder="Ej: Consultoría mensual, Servicio de diseño..."
              value={values.description}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Opcional: Describe brevemente el servicio o producto</p>
          </div>
          
          <div>
            <Input
              label="📅 Fecha"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Fecha de la transacción</p>
          </div>
          
          <div>
            <Select
              label="📊 Estado"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: '⏳ Pendiente' },
                { value: 'paid', label: '✅ Pagada' },
                { value: 'cancelled', label: '❌ Cancelada' }
              ]}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Estado actual del pago
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" type="button" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingSale ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
      <Footer />
    </div>
  );
};
