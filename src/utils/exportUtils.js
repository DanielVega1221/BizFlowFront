import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDateShort } from './formatters';

/**
 * Exporta datos a Excel
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 * @param {string} sheetName - Nombre de la hoja
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Datos') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Exporta datos a CSV
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToCSV = (data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

/**
 * Exporta ventas a PDF
 * @param {Array} sales - Array de ventas
 * @param {string} filename - Nombre del archivo
 */
export const exportSalesToPDF = (sales, filename = 'ventas') => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Reporte de Ventas', 14, 22);
  
  // Fecha del reporte
  doc.setFontSize(10);
  doc.text(`Generado: ${formatDateShort(new Date())}`, 14, 30);
  
  // Preparar datos para la tabla
  const tableData = sales.map(sale => [
    sale.client?.name || 'N/A',
    sale.description || '-',
    formatCurrency(sale.amount),
    formatDateShort(sale.date),
    sale.status === 'paid' ? 'Pagada' : sale.status === 'pending' ? 'Pendiente' : 'Cancelada'
  ]);
  
  // Calcular totales
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const paid = sales.filter(s => s.status === 'paid').reduce((sum, sale) => sum + sale.amount, 0);
  const pending = sales.filter(s => s.status === 'pending').reduce((sum, sale) => sum + sale.amount, 0);
  
  // Tabla
  doc.autoTable({
    startY: 35,
    head: [['Cliente', 'Descripción', 'Monto', 'Fecha', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 }
  });
  
  // Resumen
  const finalY = doc.lastAutoTable.finalY || 35;
  doc.setFontSize(11);
  doc.text(`Total ventas: ${formatCurrency(total)}`, 14, finalY + 10);
  doc.text(`Total pagado: ${formatCurrency(paid)}`, 14, finalY + 17);
  doc.text(`Total pendiente: ${formatCurrency(pending)}`, 14, finalY + 24);
  doc.text(`Cantidad de ventas: ${sales.length}`, 14, finalY + 31);
  
  doc.save(`${filename}.pdf`);
};

/**
 * Exporta clientes a PDF
 * @param {Array} clients - Array de clientes
 * @param {string} filename - Nombre del archivo
 */
export const exportClientsToPDF = (clients, filename = 'clientes') => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Listado de Clientes', 14, 22);
  
  // Fecha del reporte
  doc.setFontSize(10);
  doc.text(`Generado: ${formatDateShort(new Date())}`, 14, 30);
  
  // Preparar datos para la tabla
  const tableData = clients.map(client => [
    client.name,
    client.email,
    client.phone || '-',
    client.industry || '-'
  ]);
  
  // Tabla
  doc.autoTable({
    startY: 35,
    head: [['Nombre', 'Email', 'Teléfono', 'Industria']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 }
  });
  
  // Resumen
  const finalY = doc.lastAutoTable.finalY || 35;
  doc.setFontSize(11);
  doc.text(`Total de clientes: ${clients.length}`, 14, finalY + 10);
  
  doc.save(`${filename}.pdf`);
};

/**
 * Prepara datos de ventas para exportación
 * @param {Array} sales - Array de ventas
 * @returns {Array} - Datos formateados para exportación
 */
export const prepareSalesData = (sales) => {
  return sales.map(sale => ({
    Cliente: sale.client?.name || 'N/A',
    Email: sale.client?.email || 'N/A',
    Descripción: sale.description || '-',
    Monto: sale.amount,
    'Monto Formateado': formatCurrency(sale.amount),
    Fecha: formatDateShort(sale.date),
    Estado: sale.status === 'paid' ? 'Pagada' : sale.status === 'pending' ? 'Pendiente' : 'Cancelada'
  }));
};

/**
 * Prepara datos de clientes para exportación
 * @param {Array} clients - Array de clientes
 * @returns {Array} - Datos formateados para exportación
 */
export const prepareClientsData = (clients) => {
  return clients.map(client => ({
    Nombre: client.name,
    Email: client.email,
    Teléfono: client.phone || '-',
    Industria: client.industry || '-',
    Notas: client.notes || '-',
    'Fecha de Registro': formatDateShort(client.createdAt)
  }));
};
