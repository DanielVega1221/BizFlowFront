import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { Spinner } from '../components/Spinner';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { reportsAPI } from '../api/services';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { reportsTour } from '../utils/appTour';

export const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState({ totalSales: 0, totalRevenue: 0, averageTicket: 0, conversionRate: 0 });
  const [topClients, setTopClients] = useState([]);
  const [trends, setTrends] = useState({ currentMonth: 0, lastMonth: 0, weekly: [] });
  const [salesByIndustry, setSalesByIndustry] = useState([]);

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Calcular rango de fechas según el período
      const now = new Date();
      let from, to;
      
      switch (period) {
        case 'week':
          from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case 'month':
          from = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'year':
          from = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          from = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      to = now;
      
      const params = {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0]
      };
      
      const [summaryRes, topClientsRes, trendsRes, industryRes] = await Promise.all([
        reportsAPI.getSummary(params),
        reportsAPI.getTopClients({ limit: 10, ...params }),
        reportsAPI.getTrends(),
        reportsAPI.getSalesByIndustry(params)
      ]);
      
      // Validar y establecer datos con valores por defecto
      setSummary(summaryRes.data || { totalSales: 0, totalRevenue: 0, averageTicket: 0, conversionRate: 0, salesByMonth: [] });
      setTopClients(Array.isArray(topClientsRes.data) ? topClientsRes.data : []);
      setTrends(trendsRes.data || { currentMonth: 0, lastMonth: 0, weekly: [] });
      setSalesByIndustry(Array.isArray(industryRes.data) ? industryRes.data : []);
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      // Mantener valores por defecto en caso de error
      setSummary({ totalSales: 0, totalRevenue: 0, averageTicket: 0, conversionRate: 0, salesByMonth: [] });
      setTopClients([]);
      setTrends({ currentMonth: 0, lastMonth: 0, weekly: [] });
      setSalesByIndustry([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = () => {
    if (!trends || trends.currentMonth === undefined || trends.lastMonth === undefined) return '0.0';
    const { currentMonth, lastMonth } = trends;
    
    // Si no hay ventas en ningún mes
    if (currentMonth === 0 && lastMonth === 0) return '0.0';
    
    // Si no había ventas el mes pasado pero ahora sí
    if (lastMonth === 0 && currentMonth > 0) return 'Nuevo';
    
    // Si había ventas pero ahora no
    if (lastMonth > 0 && currentMonth === 0) return '-100.0';
    
    // Cálculo normal
    const growth = ((currentMonth - lastMonth) / lastMonth * 100).toFixed(1);
    return isNaN(growth) ? '0.0' : growth;
  };
  
  const generateInsights = () => {
    const insights = [];
    const growth = calculateGrowth();
    const avgTicket = (summary?.totalSales || 0) / (summary?.totalSalesCount || 1);
    const conversionRate = (summary?.totalSalesCount || 0) / (summary?.totalClients || 1) * 100;
    
    // Insight de crecimiento
    if (growth === 'Nuevo') {
      insights.push({
        icon: '🎉',
        color: 'blue',
        title: '¡Bienvenido!',
        message: 'Este es tu primer mes con ventas. ¡Excelente comienzo!'
      });
    } else if (parseFloat(growth) > 20) {
      insights.push({
        icon: '🚀',
        color: 'green',
        title: 'Crecimiento Explosivo',
        message: `Tu negocio creció un <strong>${growth}%</strong>. ¡Mantén el impulso!`
      });
    } else if (parseFloat(growth) > 0) {
      insights.push({
        icon: '📈',
        color: 'blue',
        title: 'Tendencia Positiva',
        message: `Crecimiento de <strong>${growth}%</strong> respecto al mes anterior.`
      });
    } else if (parseFloat(growth) < -10) {
      insights.push({
        icon: '⚠️',
        color: 'red',
        title: 'Atención Requerida',
        message: `Las ventas bajaron <strong>${Math.abs(parseFloat(growth))}%</strong>. Revisa tu estrategia.`
      });
    } else if (parseFloat(growth) < 0) {
      insights.push({
        icon: '📉',
        color: 'yellow',
        title: 'Ligera Disminución',
        message: `Ventas <strong>${Math.abs(parseFloat(growth))}%</strong> más bajas. Oportunidad de mejora.`
      });
    }
    
    // Insight de mejor cliente
    if (topClients.length > 0) {
      insights.push({
        icon: '🏆',
        color: 'green',
        title: 'Cliente Estrella',
        message: `<strong>${topClients[0].name}</strong> lidera con <strong>${formatCurrency(topClients[0].totalSales)}</strong> en ventas.`
      });
    }
    
    // Insight de ticket promedio
    if (avgTicket < 2000) {
      insights.push({
        icon: '🎯',
        color: 'yellow',
        title: 'Oportunidad de Upselling',
        message: `Ticket promedio: <strong>${formatCurrency(avgTicket)}</strong>. Considera ofrecer productos/servicios adicionales.`
      });
    } else if (avgTicket > 5000) {
      insights.push({
        icon: '💰',
        color: 'green',
        title: 'Alto Valor por Venta',
        message: `Ticket promedio excelente: <strong>${formatCurrency(avgTicket)}</strong>.`
      });
    }
    
    // Insight de conversión
    if (conversionRate < 50) {
      insights.push({
        icon: '📊',
        color: 'yellow',
        title: 'Mejora tu Conversión',
        message: `Tasa de conversión: <strong>${conversionRate.toFixed(1)}%</strong>. Trabaja en el seguimiento de clientes.`
      });
    } else if (conversionRate > 100) {
      insights.push({
        icon: '✨',
        color: 'green',
        title: 'Excelente Retención',
        message: `Más de una venta por cliente en promedio. ¡Gran fidelización!`
      });
    }
    
    // Insight de industrias
    if (salesByIndustry.length > 0) {
      const topIndustry = salesByIndustry[0];
      insights.push({
        icon: '🏭',
        color: 'blue',
        title: 'Sector Más Rentable',
        message: `<strong>${topIndustry._id}</strong> representa el <strong>${topIndustry.percentage?.toFixed(1) || 0}%</strong> de tus ventas.`
      });
    }
    
    return insights;
  };

  const profitabilityData = Array.isArray(topClients) ? topClients.map(client => ({
    name: client.name || 'Sin nombre',
    ventas: client.totalSales || 0,
    cantidad: client.salesCount || 0
  })) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Botón de ayuda flotante */}
      <button
        onClick={reportsTour}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl"
        title="Ver tutorial de Reportes"
      >
        ❓
      </button>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reportes Avanzados</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                📊 Análisis detallado de tu negocio con insights personalizados
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Usa el selector de período para ver datos de diferentes rangos de tiempo
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Select
                id="period-selector"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                options={[
                  { value: 'week', label: 'Última semana' },
                  { value: 'month', label: 'Último mes' },
                  { value: 'quarter', label: 'Último trimestre' },
                  { value: 'year', label: 'Último año' }
                ]}
                className="w-full sm:w-auto"
              />
              <Button onClick={fetchReports} variant="secondary" className="whitespace-nowrap">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card id="growth-kpi">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Crecimiento</p>
              <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-2 ${
                calculateGrowth() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateGrowth()}%
              </p>
              <p className="text-xs text-gray-500 mt-1">vs. mes anterior</p>
            </div>
          </Card>

          <Card id="avg-ticket-kpi">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Ticket Promedio</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2 break-words">
                {formatCurrency((summary?.totalSales || 0) / (summary?.totalSalesCount || 1))}
              </p>
              <p className="text-xs text-gray-500 mt-1">por venta</p>
            </div>
          </Card>

          <Card id="conversion-kpi">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Tasa de Conversión</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                {((summary?.totalSalesCount || 0) / (summary?.totalClients || 1) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">ventas/clientes</p>
            </div>
          </Card>

          <Card id="projection-kpi">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Proyección Anual</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 mt-2 break-words">
                {(() => {
                  // Proyección basada en promedio de mes actual y anterior
                  const avg = ((trends?.currentMonth || 0) + (trends?.lastMonth || 0)) / 2;
                  return formatCurrency(avg * 12);
                })()}
              </p>
              <p className="text-xs text-gray-500 mt-1">basado en promedio</p>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Top 10 Clientes por Rentabilidad */}
          <Card id="top-clients-chart" title="Top 10 Clientes - Rentabilidad" className="overflow-hidden">
            {profitabilityData.length > 0 ? (
              <div className="w-full" style={{ height: '300px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis style={{ fontSize: '10px' }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="ventas" fill="#0ea5e9" name="Ventas Totales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </Card>

          {/* Análisis de Tendencias */}
          <Card id="trends-chart" title="Análisis de Tendencias" className="overflow-hidden">
            {summary?.salesByMonth && summary.salesByMonth.length > 0 ? (
              <div className="w-full" style={{ height: '300px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: '10px' }} />
                    <YAxis style={{ fontSize: '10px' }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      name="Ventas"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </Card>
        </div>

        {/* Ventas por Industria */}
        <Card id="industry-chart" title="Distribución por Industria" className="mb-6 sm:mb-8 overflow-hidden">
          {salesByIndustry.length > 0 ? (
            <>
              {/* Vista de tabla para desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Industria</th>
                      <th className="text-right py-3 px-4">Ventas</th>
                      <th className="text-right py-3 px-4">Monto Total</th>
                      <th className="text-right py-3 px-4">Promedio</th>
                      <th className="text-right py-3 px-4">% del Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesByIndustry.map((industry, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{industry._id || 'Sin especificar'}</td>
                        <td className="py-3 px-4 text-right">{industry.count}</td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {formatCurrency(industry.total)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(industry.average)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {industry.percentage ? industry.percentage.toFixed(1) : '0.0'}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de tarjetas para móvil */}
              <div className="md:hidden space-y-4">
                {salesByIndustry.map((industry, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {industry._id || 'Sin especificar'}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {industry.percentage ? industry.percentage.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ventas:</span>
                        <span className="font-medium">{industry.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monto Total:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(industry.total)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Promedio:</span>
                        <span className="font-medium">
                          {formatCurrency(industry.average)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          )}
        </Card>

        {/* Insights y Recomendaciones */}
        <Card id="insights-section" className="insights-section" title="💡 Insights y Recomendaciones">
          <div className="space-y-4">
            {generateInsights().map((insight, index) => {
              const bgColors = {
                blue: 'bg-blue-50',
                green: 'bg-green-50',
                yellow: 'bg-yellow-50',
                red: 'bg-red-50'
              };
              
              return (
                <div key={index} className={`flex items-start gap-3 p-3 ${bgColors[insight.color]} rounded-lg`}>
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: insight.message }} />
                  </div>
                </div>
              );
            })}
            
            {generateInsights().length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay suficientes datos para generar insights.</p>
            )}
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};
