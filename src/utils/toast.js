/**
 * Sistema de toast simple para notificaciones
 */

export const toast = {
  info: (message, duration = 5000) => {
    showToast(message, 'info', duration);
  },
  success: (message, duration = 3000) => {
    showToast(message, 'success', duration);
  },
  error: (message, duration = 5000) => {
    showToast(message, 'error', duration);
  },
  warning: (message, duration = 4000) => {
    showToast(message, 'warning', duration);
  }
};

function showToast(message, type = 'info', duration = 3000) {
  // Crear contenedor si no existe
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }

  // Crear toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };
  
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  toast.style.cssText = `
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
    background: white;
    border-left: 4px solid;
    max-width: 100%;
  `;

  toast.innerHTML = `
    <span style="font-size: 20px;">${icons[type]}</span>
    <span style="color: #374151; font-size: 14px; flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="
      color: #9CA3AF;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      padding: 0;
    ">×</button>
  `;

  // Color del borde según tipo
  const borderColors = {
    info: '#3B82F6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
  };
  toast.style.borderLeftColor = borderColors[type];

  // Agregar animación CSS si no existe
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  // Auto-remover después de la duración
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      toast.remove();
      // Remover contenedor si está vacío
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, duration);
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.toast = toast;
}
