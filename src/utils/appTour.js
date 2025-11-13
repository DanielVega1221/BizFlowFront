import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Estilos personalizados para el tour
const customStyles = `
  .driver-popover {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 20px 60px rgba(79, 70, 229, 0.4);
    max-width: 420px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .driver-popover-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    color: white;
    letter-spacing: -0.5px;
  }
  
  .driver-popover-description {
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 400;
  }
  
  .driver-popover-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  .driver-popover-navigation-btns {
    display: flex;
    gap: 8px;
  }
  
  .driver-popover-prev-btn,
  .driver-popover-next-btn {
    background: white;
    color: #4f46e5;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .driver-popover-prev-btn:hover,
  .driver-popover-next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #f8fafc;
  }
  
  .driver-popover-prev-btn:active,
  .driver-popover-next-btn:active {
    transform: translateY(0);
  }
  
  .driver-popover-close-btn {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }
  
  .driver-popover-close-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg) scale(1.1);
  }
  
  .driver-popover-progress-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  
  .driver-popover-arrow {
    border-color: #4f46e5;
  }
  
  .driver-popover-arrow-side-left.driver-popover-arrow {
    border-left-color: #4f46e5;
  }
  
  .driver-popover-arrow-side-right.driver-popover-arrow {
    border-right-color: #4f46e5;
  }
  
  .driver-popover-arrow-side-top.driver-popover-arrow {
    border-top-color: #4f46e5;
  }
  
  .driver-popover-arrow-side-bottom.driver-popover-arrow {
    border-bottom-color: #4f46e5;
  }
`;

// Inyectar estilos personalizados
const styleElement = document.createElement('style');
styleElement.textContent = customStyles;
document.head.appendChild(styleElement);

// Tour del Dashboard
export const dashboardTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: '➡️ Siguiente',
    prevBtnText: '⬅️ Anterior',
    doneBtnText: '🎉 ¡Entendido!',
    progressText: 'Paso {{current}} de {{total}}',
    steps: [
      {
        element: '#dashboard-welcome',
        popover: {
          title: '🏠 ¡Bienvenido al Dashboard!',
          description: 'Este es tu centro de control. Aquí verás un resumen completo de tu negocio: ventas totales, número de clientes y gráficos de rendimiento.',
          position: 'bottom'
        }
      },
      {
        element: '#total-sales-card',
        popover: {
          title: '💰 Ventas Totales',
          description: 'Muestra el total de ingresos del período seleccionado. El indicador de crecimiento te dice si estás mejorando respecto al mes anterior.',
          position: 'bottom'
        }
      },
      {
        element: '#clients-card',
        popover: {
          title: '👥 Total de Clientes',
          description: 'Cantidad de clientes registrados en tu sistema. Mantén este número creciendo para expandir tu negocio.',
          position: 'bottom'
        }
      },
      {
        element: '#pending-sales-card',
        popover: {
          title: '⏳ Ventas Pendientes',
          description: 'Ventas que aún no han sido cobradas. Usa esta información para hacer seguimiento de pagos pendientes.',
          position: 'bottom'
        }
      },
      {
        element: '#sales-chart',
        popover: {
          title: '📈 Gráfico de Ventas',
          description: 'Visualiza la evolución de tus ventas a lo largo del tiempo. Identifica tendencias, picos y oportunidades de mejora.',
          position: 'top'
        }
      },
      {
        element: '#top-clients',
        popover: {
          title: '🌟 Mejores Clientes',
          description: 'Tus clientes más valiosos. Mantén una buena relación con ellos, son el motor de tu negocio.',
          position: 'left'
        }
      }
    ]
  });

  driverObj.drive();
};

// Tour de Clientes
export const clientsTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: '➡️ Siguiente',
    prevBtnText: '⬅️ Anterior',
    doneBtnText: '🎉 ¡Entendido!',
    progressText: 'Paso {{current}} de {{total}}',
    steps: [
      {
        popover: {
          title: '👥 Gestión de Clientes',
          description: 'Aquí administras toda tu cartera de clientes. Puedes crear, editar, buscar y exportar información de tus clientes.',
        }
      },
      {
        element: '#new-client-btn',
        popover: {
          title: '➕ Crear Nuevo Cliente',
          description: 'Haz clic aquí para agregar un nuevo cliente. Completa nombre, email, teléfono e industria para mantener tu base de datos organizada.',
          position: 'bottom'
        }
      },
      {
        element: '#export-clients-btn',
        popover: {
          title: '📊 Exportar Datos',
          description: 'Descarga tu lista de clientes en formato Excel, CSV o PDF. Ideal para reportes o respaldos.',
          position: 'bottom'
        }
      },
      {
        element: '#search-clients-input',
        popover: {
          title: '🔍 Búsqueda Inteligente',
          description: 'Busca clientes por nombre, email o industria. La búsqueda es instantánea y te ayuda a encontrar información rápidamente.',
          position: 'bottom'
        }
      },
      {
        element: '#clients-table',
        popover: {
          title: '📋 Lista de Clientes',
          description: 'Cada cliente muestra su información completa. Usa los botones de acción para editar o eliminar registros. En móviles se muestran como tarjetas.',
          position: 'top'
        }
      }
    ]
  });

  driverObj.drive();
};

// Tour de Ventas
export const salesTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: '➡️ Siguiente',
    prevBtnText: '⬅️ Anterior',
    doneBtnText: '🎉 ¡Entendido!',
    progressText: 'Paso {{current}} de {{total}}',
    steps: [
      {
        popover: {
          title: '💼 Gestión de Ventas',
          description: 'El corazón de tu negocio. Aquí registras todas las transacciones, haces seguimiento de pagos y analizas tu flujo de ingresos.',
        }
      },
      {
        element: '#new-sale-btn',
        popover: {
          title: '➕ Registrar Nueva Venta',
          description: 'Crea una nueva venta seleccionando el cliente, monto y estado. Todos los datos quedan registrados automáticamente.',
          position: 'bottom'
        }
      },
      {
        element: '#filters-container',
        popover: {
          title: '🎯 Filtros Avanzados',
          description: 'Filtra ventas por búsqueda, estado (pendiente/pagada/cancelada) o rango de fechas. Combina filtros para análisis precisos.',
          position: 'bottom'
        }
      },
      {
        element: '#status-filter',
        popover: {
          title: '📊 Filtro por Estado',
          description: 'Filtra por: Pendiente ⏳ (sin cobrar), Pagada ✅ (cobrada) o Cancelada ❌. Útil para seguimiento de cuentas por cobrar.',
          position: 'bottom'
        }
      },
      {
        element: '#date-filters',
        popover: {
          title: '📅 Filtro por Fechas',
          description: 'Define un rango de fechas para ver ventas específicas. Perfecto para análisis mensuales o trimestrales.',
          position: 'bottom'
        }
      },
      {
        element: '#export-sales-btn',
        popover: {
          title: '📄 Exportar Ventas',
          description: 'Descarga reportes de ventas en Excel, CSV o PDF. Incluye todos los filtros aplicados para reportes personalizados.',
          position: 'bottom'
        }
      },
      {
        element: '#sales-table',
        popover: {
          title: '📋 Listado de Ventas',
          description: 'Cada venta muestra cliente, monto, fecha y estado. Los badges de colores indican el estado: 🟡 Pendiente, 🟢 Pagada, 🔴 Cancelada.',
          position: 'top'
        }
      }
    ]
  });

  driverObj.drive();
};

// Tour de Reportes
export const reportsTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: '➡️ Siguiente',
    prevBtnText: '⬅️ Anterior',
    doneBtnText: '🎉 ¡Entendido!',
    progressText: 'Paso {{current}} de {{total}}',
    steps: [
      {
        popover: {
          title: '📊 Reportes y Analytics',
          description: 'Tu centro de inteligencia de negocio. Analiza tendencias, identifica oportunidades y toma decisiones basadas en datos reales.',
        }
      },
      {
        element: '#period-selector',
        popover: {
          title: '📅 Selector de Período',
          description: 'Cambia entre Semana, Mes, Trimestre o Año para ver diferentes perspectivas de tu negocio.',
          position: 'bottom'
        }
      },
      {
        element: '#growth-kpi',
        popover: {
          title: '📈 Crecimiento',
          description: 'Porcentaje de crecimiento respecto al período anterior. Verde = crecimiento, Rojo = decrecimiento. Meta: mantenerlo positivo.',
          position: 'bottom'
        }
      },
      {
        element: '#avg-ticket-kpi',
        popover: {
          title: '💳 Ticket Promedio',
          description: 'Monto promedio por venta. Un aumento indica que estás vendiendo productos/servicios de mayor valor o haciendo upselling exitoso.',
          position: 'bottom'
        }
      },
      {
        element: '#conversion-kpi',
        popover: {
          title: '🎯 Tasa de Conversión',
          description: 'Porcentaje de ventas cerradas vs totales. Una tasa alta indica eficiencia en tu proceso de ventas.',
          position: 'bottom'
        }
      },
      {
        element: '#projection-kpi',
        popover: {
          title: '🔮 Proyección Anual',
          description: 'Estimación de ingresos anuales basada en el ritmo actual. Útil para planificación financiera y metas.',
          position: 'bottom'
        }
      },
      {
        element: '#trends-chart',
        popover: {
          title: '📊 Análisis de Tendencias',
          description: 'Gráfico temporal que muestra la evolución de tus ventas. Identifica patrones estacionales y picos de actividad.',
          position: 'top'
        }
      },
      {
        element: '#top-clients-chart',
        popover: {
          title: '🌟 Top 10 Clientes',
          description: 'Tus clientes más rentables. Enfoca tus esfuerzos en mantenerlos satisfechos y busca más clientes con perfil similar.',
          position: 'top'
        }
      },
      {
        element: '#industry-chart',
        popover: {
          title: '🏭 Distribución por Industria',
          description: 'Qué sectores generan más ingresos. Identifica tu nicho más rentable y considera especializarte.',
          position: 'top'
        }
      },
      {
        element: '#insights-section',
        popover: {
          title: '💡 Insights Inteligentes',
          description: 'Recomendaciones automáticas basadas en tus datos. Usa estos insights para mejorar tu estrategia comercial.',
          position: 'top'
        }
      }
    ]
  });

  driverObj.drive();
};

// Tour inicial completo (al hacer login)
export const welcomeTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: '➡️ Siguiente',
    prevBtnText: '⬅️ Anterior',
    doneBtnText: '🚀 ¡Comenzar!',
    progressText: 'Paso {{current}} de {{total}}',
    steps: [
      {
        popover: {
          title: '🎉 ¡Bienvenido a BizFlow!',
          description: 'Te voy a mostrar cómo usar la plataforma. Este tour te llevará por las principales funcionalidades para que aproveches al máximo el sistema.',
        }
      },
      {
        element: 'nav',
        popover: {
          title: '🧭 Barra de Navegación',
          description: 'Desde aquí accedes a todas las secciones: Dashboard, Clientes, Ventas y Reportes. Tu perfil y logout están en la esquina superior derecha.',
          position: 'bottom'
        }
      },
      {
        element: 'a[href="/dashboard"]',
        popover: {
          title: '🏠 Dashboard',
          description: 'Tu página de inicio. Resume todo tu negocio en un vistazo: ventas, clientes, gráficos y tendencias.',
          position: 'bottom'
        }
      },
      {
        element: 'a[href="/clients"]',
        popover: {
          title: '👥 Clientes',
          description: 'Gestiona tu cartera de clientes. Agrega nuevos contactos, edita información y exporta tu base de datos.',
          position: 'bottom'
        }
      },
      {
        element: 'a[href="/sales"]',
        popover: {
          title: '💼 Ventas',
          description: 'El corazón del sistema. Registra transacciones, haz seguimiento de pagos y filtra por estado o fechas.',
          position: 'bottom'
        }
      },
      {
        element: 'a[href="/reports"]',
        popover: {
          title: '📊 Reportes',
          description: 'Analytics avanzado. Ve KPIs, tendencias, mejores clientes e insights inteligentes para tomar mejores decisiones.',
          position: 'bottom'
        }
      },
      {
        element: '#user-menu',
        popover: {
          title: '👤 Menú de Usuario',
          description: 'Aquí encuentras tu perfil y la opción para cerrar sesión de forma segura.',
          position: 'bottom'
        }
      },
      {
        popover: {
          title: '🎓 Tours Específicos',
          description: 'En cada página encontrarás un botón "?" o "Ayuda" para ver el tour específico de esa sección. ¡No dudes en usarlo!',
        }
      },
      {
        popover: {
          title: '💡 Consejos Finales',
          description: 'Empieza agregando algunos clientes, luego registra tus ventas. Los reportes se generarán automáticamente. ¡Que tengas éxito! 🚀',
        }
      }
    ]
  });

  driverObj.drive();
};

// Tour rápido de características clave
export const quickFeaturesTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: '➡️ Siguiente',
    prevBtnText: '⬅️ Anterior',
    doneBtnText: '✅ ¡Listo!',
    progressText: 'Característica {{current}} de {{total}}',
    steps: [
      {
        popover: {
          title: '⚡ Características Destacadas',
          description: 'Conoce las funcionalidades más útiles de BizFlow en 60 segundos.',
        }
      },
      {
        popover: {
          title: '🔍 Búsqueda Inteligente',
          description: 'Todos los listados tienen búsqueda en tiempo real. Solo escribe y los resultados se filtran instantáneamente.',
        }
      },
      {
        popover: {
          title: '📊 Exportación Múltiple',
          description: 'Exporta datos en Excel, CSV o PDF desde cualquier listado. Perfecto para reportes externos o respaldos.',
        }
      },
      {
        popover: {
          title: '📱 100% Responsive',
          description: 'Funciona perfecto en celulares y tablets. Las tablas se convierten en tarjetas para mejor visualización móvil.',
        }
      },
      {
        popover: {
          title: '🔐 Seguridad Robusta',
          description: 'Todas las entradas son validadas, sanitizadas y protegidas contra inyecciones. Tus datos están seguros.',
        }
      },
      {
        popover: {
          title: '💡 Insights Automáticos',
          description: 'El sistema analiza tus datos y genera recomendaciones inteligentes en la sección de Reportes.',
        }
      },
      {
        popover: {
          title: '⚡ Tiempo Real',
          description: 'Todos los cambios se reflejan instantáneamente. Sin recargas, sin esperas.',
        }
      }
    ]
  });

  driverObj.drive();
};

// Resetear tour (para testing o si el usuario quiere verlo de nuevo)
export const resetTour = () => {
  localStorage.removeItem('bizflow_tour_completed');
};
