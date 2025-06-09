// REEMPLAZAR COMPLETAMENTE js/navigation.js CON ESTE CÓDIGO:

// Configuración de rutas base
const BASE_PATHS = {
    client: '/pages/client/',
    shared: '/shared/',
    admin: '/pages/admin/',
    vet: '/pages/veterinarian/'
};

// Función de navegación mejorada
window.navigateTo = (page, showLoading = true) => {
    try {
        // Verificar si la página es una URL completa o relativa
        if (page.startsWith('http') || page.startsWith('/')) {
            if (showLoading && typeof VetAlert !== 'undefined') {
                VetAlert.loading('Cargando...');
                setTimeout(() => {
                    VetAlert.close();
                    window.location.href = page;
                }, 800);
            } else {
                window.location.href = page;
            }
            return;
        }

        // Determinar la ruta correcta basada en la ubicación actual
        let targetUrl = page;
        const currentPath = window.location.pathname;
        
        // Si estamos en una subcarpeta, ajustar la ruta
        if (currentPath.includes('/client/')) {
            // Ya estamos en client, usar ruta relativa
            if (!page.includes('/') && !page.startsWith('.')) {
                targetUrl = page;
            }
        } else if (currentPath.includes('/shared/')) {
            // Estamos en shared, ajustar para ir a client
            if (page.includes('dashboard.html') || page.includes('.html')) {
                targetUrl = '../pages/client/' + page;
            }
        }

        if (showLoading && typeof VetAlert !== 'undefined') {
            VetAlert.loading('Cargando...');
            setTimeout(() => {
                VetAlert.close();
                window.location.href = targetUrl;
            }, 800);
        } else {
            window.location.href = targetUrl;
        }
    } catch (error) {
        console.error('Error en navegación:', error);
        // Fallback sin loading
        window.location.href = page;
    }
};

// Función para ir al dashboard desde cualquier página
window.goToDashboard = () => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/client/')) {
        navigateTo('dashboard.html');
    } else if (currentPath.includes('/shared/')) {
        navigateTo('../pages/client/dashboard.html');
    } else if (currentPath.includes('/admin/')) {
        navigateTo('dashboard.html');
    } else if (currentPath.includes('/veterinarian/')) {
        navigateTo('dashboard.html');
    } else {
        // Desde la raíz
        navigateTo('pages/client/dashboard.html');
    }
};

// Función mejorada para volver atrás
window.smartGoBack = () => {
    const referrer = document.referrer;
    const currentPath = window.location.pathname;
    
    // Si hay un referrer y es del mismo dominio, usar history.back()
    if (referrer && referrer.includes(window.location.origin)) {
        window.history.back();
    } else {
        // Fallback: ir al dashboard correspondiente
        if (currentPath.includes('/client/')) {
            navigateTo('dashboard.html');
        } else if (currentPath.includes('/admin/')) {
            navigateTo('dashboard.html');
        } else if (currentPath.includes('/veterinarian/')) {
            navigateTo('dashboard.html');
        } else {
            goToDashboard();
        }
    }
};

// Función para navegar a agendamiento desde cualquier página
window.goToBooking = (petId = '', serviceId = '') => {
    const currentPath = window.location.pathname;
    let bookingUrl = '';
    
    if (currentPath.includes('/client/')) {
        bookingUrl = '../shared/appointment-booking.html';
    } else if (currentPath.includes('/shared/')) {
        bookingUrl = 'appointment-booking.html';
    } else {
        bookingUrl = 'shared/appointment-booking.html';
    }
    
    // Agregar parámetros si se proporcionan
    const params = new URLSearchParams();
    if (petId) params.append('pet', petId);
    if (serviceId) params.append('service', serviceId);
    
    if (params.toString()) {
        bookingUrl += '?' + params.toString();
    }
    
    navigateTo(bookingUrl);
};

// Detectar la carga de la página para inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation system loaded successfully');
    
    // Verificar si VetAlert está disponible
    if (typeof VetAlert === 'undefined') {
        console.warn('VetAlert no está disponible. Algunas funciones de navegación pueden verse afectadas.');
    }
});