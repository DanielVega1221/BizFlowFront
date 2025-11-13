export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-lg font-bold text-gray-900">BizFlow</span>
            </div>
            <p className="text-sm text-gray-600">
              Gestión inteligente para tu negocio
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Soporte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-gray-900 mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="mailto:info@bizflow.com" className="hover:text-primary-600 transition-colors">
                  info@bizflow.com
                </a>
              </li>
              <li>
                <a href="tel:+5491112345678" className="hover:text-primary-600 transition-colors">
                  +54 9 11 1234-5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} BizFlow. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
