// Validaciones para formularios del frontend

// Validar email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El email es requerido';
  if (!re.test(email)) return 'Email inválido';
  if (email.length > 100) return 'Email demasiado largo (máx. 100 caracteres)';
  return null;
};

// Validar nombre (solo letras, espacios y algunos caracteres especiales)
export const validateName = (name, fieldName = 'nombre') => {
  if (!name || name.trim().length === 0) return `El ${fieldName} es requerido`;
  if (name.length < 2) return `El ${fieldName} debe tener al menos 2 caracteres`;
  if (name.length > 100) return `El ${fieldName} no puede tener más de 100 caracteres`;
  
  // Permitir letras, espacios, guiones, apóstrofes y tildes
  const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/;
  if (!re.test(name)) return `El ${fieldName} solo puede contener letras, espacios y guiones`;
  
  return null;
};

// Validar teléfono argentino
export const validatePhone = (phone) => {
  if (!phone) return null; // Opcional
  
  // Remover espacios y guiones
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Formatos argentinos: +54911..., 011..., 15...
  const re = /^(\+54)?(\d{2,4})?\d{6,10}$/;
  
  if (!re.test(cleanPhone)) {
    return 'Formato de teléfono inválido (Ej: 011-1234-5678, +54 9 11 1234-5678)';
  }
  
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    return 'El teléfono debe tener entre 8 y 15 dígitos';
  }
  
  return null;
};

// Validar monto (positivo, máximo 2 decimales)
export const validateAmount = (amount, fieldName = 'monto') => {
  if (!amount && amount !== 0) return `El ${fieldName} es requerido`;
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) return `El ${fieldName} debe ser un número válido`;
  if (numAmount < 0) return `El ${fieldName} no puede ser negativo`;
  if (numAmount > 99999999.99) return `El ${fieldName} es demasiado grande`;
  
  // Validar máximo 2 decimales
  const decimals = (amount.toString().split('.')[1] || '').length;
  if (decimals > 2) return `El ${fieldName} solo puede tener hasta 2 decimales`;
  
  return null;
};

// Validar descripción/notas (limitar caracteres especiales peligrosos)
export const validateText = (text, fieldName = 'texto', maxLength = 500, required = false) => {
  if (!text || text.trim().length === 0) {
    return required ? `${fieldName} es requerido` : null;
  }
  
  if (text.length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`;
  }
  
  // Prevenir scripts y código malicioso
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(text)) {
      return `${fieldName} contiene caracteres no permitidos`;
    }
  }
  
  return null;
};

// Validar contraseña
export const validatePassword = (password, confirmPassword = null) => {
  if (!password) return 'La contraseña es requerida';
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (password.length > 128) {
    return 'La contraseña es demasiado larga (máx. 128 caracteres)';
  }
  
  // Validar complejidad mínima
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return 'La contraseña debe contener al menos una letra y un número';
  }
  
  if (confirmPassword !== null && password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  
  return null;
};

// Validar fecha
export const validateDate = (date, fieldName = 'fecha') => {
  if (!date) return `La ${fieldName} es requerida`;
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} inválida`;
  }
  
  // No permitir fechas muy antiguas (ej: antes de 2000)
  const minDate = new Date('2000-01-01');
  if (dateObj < minDate) {
    return `${fieldName} no puede ser anterior al año 2000`;
  }
  
  // No permitir fechas muy futuras (ej: más de 10 años)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  if (dateObj > maxDate) {
    return `${fieldName} no puede ser posterior a ${maxDate.getFullYear()}`;
  }
  
  return null;
};

// Validar industria/categoría (de lista predefinida)
export const validateIndustry = (industry) => {
  if (!industry) return null; // Opcional
  
  const validIndustries = [
    'Tecnología',
    'Retail',
    'Salud',
    'Educación',
    'Construcción',
    'Manufactura',
    'Servicios Financieros',
    'Alimentos y Bebidas',
    'Turismo',
    'Transporte',
    'Servicios',
    'Hostelería',
    'Otro'
  ];
  
  if (!validIndustries.includes(industry)) {
    return 'Industria no válida';
  }
  
  return null;
};

// Validar estado de venta
export const validateStatus = (status) => {
  const validStatuses = ['pending', 'paid', 'cancelled'];
  
  if (!status) return 'El estado es requerido';
  if (!validStatuses.includes(status)) return 'Estado no válido';
  
  return null;
};

// Sanitizar input (remover caracteres peligrosos pero mantener tildes)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<[^>]*>/g, '') // Remover tags HTML
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+\s*=/gi, '') // Remover event handlers
    .trim();
};

// Validar formulario completo de cliente
export const validateClientForm = (values) => {
  const errors = {};
  
  const nameError = validateName(values.name, 'nombre');
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;
  
  const industryError = validateIndustry(values.industry);
  if (industryError) errors.industry = industryError;
  
  const notesError = validateText(values.notes, 'Notas', 1000, false);
  if (notesError) errors.notes = notesError;
  
  return errors;
};

// Validar formulario completo de venta
export const validateSaleForm = (values) => {
  const errors = {};
  
  if (!values.clientId) {
    errors.clientId = 'Debes seleccionar un cliente';
  }
  
  const amountError = validateAmount(values.amount);
  if (amountError) errors.amount = amountError;
  
  const descriptionError = validateText(values.description, 'Descripción', 500, false);
  if (descriptionError) errors.description = descriptionError;
  
  const dateError = validateDate(values.date);
  if (dateError) errors.date = dateError;
  
  const statusError = validateStatus(values.status);
  if (statusError) errors.status = statusError;
  
  return errors;
};

// Validar formulario de registro/login
export const validateAuthForm = (values, isRegister = false) => {
  const errors = {};
  
  if (isRegister) {
    const nameError = validateName(values.name, 'nombre');
    if (nameError) errors.name = nameError;
  }
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(
    values.password,
    isRegister ? values.confirmPassword : null
  );
  if (passwordError) errors.password = passwordError;
  
  return errors;
};
