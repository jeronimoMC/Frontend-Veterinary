// Configuración global de SweetAlert2
const AlertConfig = {
    success: {
        icon: 'success',
        confirmButtonColor: '#2E7D5E',
        cancelButtonColor: '#6B7280'
    },
    error: {
        icon: 'error',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280'
    },
    warning: {
        icon: 'warning',
        confirmButtonColor: '#F59E0B',
        cancelButtonColor: '#6B7280'
    },
    info: {
        icon: 'info',
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#6B7280'
    }
};

// Funciones de alerta personalizadas
window.VetAlert = {
    success: (title, text = '') => {
        return Swal.fire({
            ...AlertConfig.success,
            title: title,
            text: text,
            showConfirmButton: true,
            timer: 3000,
            timerProgressBar: true
        });
    },

    error: (title, text = '') => {
        return Swal.fire({
            ...AlertConfig.error,
            title: title,
            text: text,
            showConfirmButton: true
        });
    },

    warning: (title, text = '') => {
        return Swal.fire({
            ...AlertConfig.warning,
            title: title,
            text: text,
            showConfirmButton: true
        });
    },

    info: (title, text = '') => {
        return Swal.fire({
            ...AlertConfig.info,
            title: title,
            text: text,
            showConfirmButton: true
        });
    },

    confirm: (title, text, confirmText = 'Sí, confirmar') => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2E7D5E',
            cancelButtonColor: '#6B7280',
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancelar'
        });
    },

    loading: (title = 'Procesando...') => {
        return Swal.fire({
            title: title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    close: () => {
        Swal.close();
    }
};

// Función para formatear fechas
window.formatDate = (date) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'America/Bogota'
    };
    return new Date(date).toLocaleDateString('es-CO', options);
};

// Función para formatear moneda colombiana
window.formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

// Función para validar email
window.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Función para validar teléfono colombiano
window.isValidPhone = (phone) => {
    const phoneRegex = /^(\+57|57)?[3][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Simulación de datos del usuario (en una app real vendría del backend)
window.UserData = {
    profile: {
        id: 'CLI001',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+57 300 123 4567',
        address: 'Calle 123 #45-67, Armenia, Quindío',
        memberSince: '2023-01-15',
        avatar: 'CR'
    },
    pets: [
        {
            id: 'PET001',
            name: 'Max',
            species: 'Perro',
            breed: 'Golden Retriever',
            age: 3,
            weight: 28,
            birthDate: '2021-03-15',
            color: 'Dorado',
            microchip: 'MC001234567',
            status: 'Activo',
            avatar: '🐕',
            lastVisit: '2024-05-20',
            nextVisit: '2024-06-10'
        },
        {
            id: 'PET002',
            name: 'Luna',
            species: 'Gato',
            breed: 'Siamés',
            age: 2,
            weight: 4,
            birthDate: '2022-08-10',
            color: 'Crema con puntos oscuros',
            microchip: 'MC001234568',
            status: 'Activo',
            avatar: '🐱',
            lastVisit: '2024-05-15',
            nextVisit: '2024-06-12'
        }
    ],
    appointments: [
        {
            id: 'APT001',
            petId: 'PET001',
            petName: 'Max',
            service: 'Control de Rutina',
            date: '2024-06-07',
            time: '10:30',
            veterinarian: 'Dr. Rosa Martínez',
            status: 'Pendiente',
            notes: 'Revisión anual de salud'
        },
        {
            id: 'APT002',
            petId: 'PET002',
            petName: 'Luna',
            service: 'Vacunación',
            date: '2024-06-12',
            time: '15:00',
            veterinarian: 'Dr. Carlos López',
            status: 'Confirmada',
            notes: 'Vacuna antirrábica anual'
        },
        {
            id: 'APT003',
            petId: 'PET001',
            petName: 'Max',
            service: 'Grooming',
            date: '2024-06-20',
            time: '11:15',
            veterinarian: 'Especialista en Estética',
            status: 'Confirmada',
            notes: 'Corte de pelo y baño'
        }
    ],
    medicalHistory: [
        {
            id: 'MH001',
            petId: 'PET001',
            date: '2024-05-20',
            type: 'Consulta General',
            veterinarian: 'Dr. Rosa Martínez',
            diagnosis: 'Estado de salud excelente',
            treatment: 'Continuar con alimentación actual',
            medications: [],
            weight: 28,
            temperature: 38.5,
            notes: 'Mascota en perfecto estado de salud'
        },
        {
            id: 'MH002',
            petId: 'PET002',
            date: '2024-05-15',
            type: 'Vacunación',
            veterinarian: 'Dr. Carlos López',
            diagnosis: 'Vacunación preventiva',
            treatment: 'Aplicación de vacuna múltiple',
            medications: ['Vacuna Triple Felina'],
            weight: 4,
            temperature: 38.8,
            notes: 'Próxima vacuna en 6 meses'
        }
    ]
};

// Función para obtener datos simulados
window.getData = (type, id = null) => {
    if (id) {
        return UserData[type].find(item => item.id === id);
    }
    return UserData[type];
};

// Inicialización global
document.addEventListener('DOMContentLoaded', function() {
    console.log('VetUni Client Module - Loaded successfully');
    
    // Verificar si SweetAlert2 está disponible
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 no está cargado. Por favor incluir la librería.');
        return;
    }

    // Configurar tema personalizado de SweetAlert2
    const style = document.createElement('style');
    style.textContent = `
        .swal2-popup {
            border-radius: 16px !important;
            font-family: 'Inter', sans-serif !important;
        }
        .swal2-title {
            color: #111827 !important;
            font-weight: 600 !important;
        }
        .swal2-content {
            color: #6B7280 !important;
        }
        .swal2-confirm {
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 500 !important;
        }
        .swal2-cancel {
            border-radius: 8px !important;
            padding: 10px 20px !important;
            font-weight: 500 !important;
        }
    `;
    document.head.appendChild(style);
});

// Función de navegación mejorada
window.navigateTo = (page) => {
    // Simular carga con loading
    VetAlert.loading('Cargando...');
    
    setTimeout(() => {
        VetAlert.close();
        window.location.href = page;
    }, 800);
};