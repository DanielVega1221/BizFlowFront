import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Spinner } from '../components/Spinner';
import { Dropdown, DropdownItem } from '../components/Dropdown';
import { useForm } from '../hooks/useForm';
import { useToast, ToastContainer } from '../components/Toast';
import { clientsAPI } from '../api/services';
import { 
  exportToExcel, 
  exportToCSV, 
  exportClientsToPDF, 
  prepareClientsData 
} from '../utils/exportUtils';
import { validateClientForm } from '../utils/validators';
import { clientsTour } from '../utils/appTour';

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]); // Para exportación
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const { values, handleChange, setValues, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    industry: '',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
    fetchAllClients();
  }, [page, search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll({ search, page, limit: 10 });
      setClients(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      addToast('Error al cargar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClients = async () => {
    try {
      const response = await clientsAPI.getAll({ limit: 10000 });
      setAllClients(response.data);
    } catch (error) {
      console.error('Error loading all clients');
    }
  };

  // Funciones de exportación
  const handleExportExcel = () => {
    const data = prepareClientsData(search ? clients : allClients);
    exportToExcel(data, `clientes_${new Date().toISOString().split('T')[0]}`, 'Clientes');
    addToast('Exportado a Excel exitosamente', 'success');
  };

  const handleExportCSV = () => {
    const data = prepareClientsData(search ? clients : allClients);
    exportToCSV(data, `clientes_${new Date().toISOString().split('T')[0]}`);
    addToast('Exportado a CSV exitosamente', 'success');
  };

  const handleExportPDF = () => {
    exportClientsToPDF(search ? clients : allClients, `clientes_${new Date().toISOString().split('T')[0]}`);
    addToast('Exportado a PDF exitosamente', 'success');
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setValues(client);
    } else {
      setEditingClient(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar datos del formulario
    const validation = validateClientForm(values);
    if (!validation.isValid) {
      addToast(validation.errors[0], 'error');
      return;
    }
    
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient._id, values);
        addToast('Cliente actualizado exitosamente', 'success');
      } else {
        await clientsAPI.create(values);
        addToast('Cliente creado exitosamente', 'success');
      }
      handleCloseModal();
      fetchClients();
    } catch (error) {
      addToast(error.response?.data?.error || 'Error al guardar cliente', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    
    try {
      await clientsAPI.delete(id);
      addToast('Cliente eliminado exitosamente', 'success');
      fetchClients();
    } catch (error) {
      addToast('Error al eliminar cliente', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Botón de ayuda flotante */}
      <button
        onClick={clientsTour}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl"
        title="Ver tutorial de Clientes"
      >
        ❓
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Gestiona tu cartera de clientes</p>
            </div>
            <div className="flex gap-2">
              <Dropdown
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
              <Button id="new-client-btn" onClick={() => handleOpenModal()} className="text-sm sm:text-base">
                <span className="sm:hidden">+ Nuevo</span>
                <span className="hidden sm:inline">+ Nuevo Cliente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <Input
            id="search-clients-input"
            placeholder="Buscar clientes por nombre, email o industria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-0"
          />
        </Card>

        {/* Clients Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <Spinner size="lg" className="py-8" />
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {search ? 'No se encontraron clientes' : '¡Empieza a construir tu cartera!'}
              </h3>
              <p className="text-gray-600 mb-4">
                {search
                  ? `No hay clientes que coincidan con "${search}"`
                  : 'Agrega tu primer cliente para gestionar tus ventas de forma organizada'}
              </p>
              {!search && (
                <Button onClick={() => handleOpenModal()} className="mt-2">
                  ➕ Agregar Primer Cliente
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Vista de tabla para desktop */}
              <div id="clients-table" className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Teléfono</th>
                      <th className="text-left py-3 px-4">Industria</th>
                      <th className="text-right py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{client.name}</td>
                        <td className="py-3 px-4">{client.email || '-'}</td>
                        <td className="py-3 px-4">{client.phone || '-'}</td>
                        <td className="py-3 px-4">{client.industry || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="secondary"
                            onClick={() => handleOpenModal(client)}
                            className="mr-2 text-sm"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(client._id)}
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
                {clients.map((client) => (
                  <div key={client._id} className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {client.email || '-'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Teléfono:</span> {client.phone || '-'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Industria:</span> {client.industry || '-'}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="secondary"
                        onClick={() => handleOpenModal(client)}
                        className="flex-1 text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(client._id)}
                        className="flex-1 text-sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
          <Input
            label="Teléfono"
            name="phone"
            value={values.phone}
            onChange={handleChange}
          />
          <Input
            label="Industria"
            name="industry"
            value={values.industry}
            onChange={handleChange}
          />
          <Input
            label="Notas"
            name="notes"
            value={values.notes}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" type="button" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingClient ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
      <Footer />
    </div>
  );
};
