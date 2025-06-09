/**
 * VetUni Appointment Booking Component
 * Maneja toda la funcionalidad relacionada con el agendamiento de citas
 */

class AppointmentBooking {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.selectedData = {
            service: null,
            pet: null,
            date: null,
            time: null,
            veterinarian: null
        };
        this.availableTimes = [];
        this.init();
    }

    /**
     * Inicializa el componente
     */
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.updateStepIndicator();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Botones de navegación
        const nextBtn = document.getElementById('nextStepBtn');
        const prevBtn = document.getElementById('prevStepBtn');
        const confirmBtn = document.getElementById('confirmAppointmentBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmBooking());
        }

        // Selección de servicios
        document.addEventListener('click', (e) => {
            if (e.target.matches('.service-option')) {
                this.selectService(e.target);
            }
        });

        // Selección de mascotas
        document.addEventListener('click', (e) => {
            if (e.target.matches('.pet-option')) {
                this.selectPet(e.target);
            }
        });

        // Selección de fecha
        const datePicker = document.getElementById('appointmentDate');
        if (datePicker) {
            datePicker.addEventListener('change', (e) => {
                this.selectDate(e.target.value);
            });
        }

        // Selección de hora
        document.addEventListener('click', (e) => {
            if (e.target.matches('.time-slot')) {
                this.selectTime(e.target);
            }
        });

        // Selección de veterinario
        document.addEventListener('click', (e) => {
            if (e.target.matches('.vet-option')) {
                this.selectVeterinarian(e.target);
            }
        });
    }

    /**
     * Carga los datos iniciales
     */
    loadInitialData() {
        this.loadServices();
        this.loadPets();
        this.setupDatePicker();
        this.loadVeterinarians();
    }

    /**
     * Carga los servicios disponibles
     */
    loadServices() {
        const services = [
            {
                id: 'consultation',
                name: 'Consulta General',
                description: 'Examen médico completo',
                price: 45000,
                duration: 45,
                icon: '🩺'
            },
            {
                id: 'vaccination',
                name: 'Vacunación',
                description: 'Vacunas preventivas',
                price: 35000,
                duration: 30,
                icon: '💉'
            },
            {
                id: 'surgery',
                name: 'Cirugía',
                description: 'Procedimientos quirúrgicos',
                price: 150000,
                duration: 120,
                icon: '⚕️'
            },
            {
                id: 'grooming',
                name: 'Grooming',
                description: 'Cuidado estético completo',
                price: 25000,
                duration: 60,
                icon: '✂️'
            },
            {
                id: 'dental',
                name: 'Limpieza Dental',
                description: 'Higiene dental profesional',
                price: 80000,
                duration: 90,
                icon: '🦷'
            },
            {
                id: 'emergency',
                name: 'Urgencias',
                description: 'Atención de emergencia',
                price: 80000,
                duration: 60,
                icon: '🚨'
            }
        ];

        this.renderServices(services);
    }

    /**
     * Renderiza los servicios en el DOM
     */
    renderServices(services) {
        const container = document.getElementById('servicesContainer');
        if (!container) return;

        const servicesHTML = services.map(service => `
            <div class="service-option" data-service-id="${service.id}" data-price="${service.price}" data-duration="${service.duration}">
                <div class="service-icon">${service.icon}</div>
                <div class="service-info">
                    <h3 class="service-name">${service.name}</h3>
                    <p class="service-description">${service.description}</p>
                    <div class="service-details">
                        <span class="service-price">$${service.price.toLocaleString()}</span>
                        <span class="service-duration">${service.duration} min</span>
                    </div>
                </div>
                <div class="service-selector">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </div>
            </div>
        `).join('');

        container.innerHTML = servicesHTML;
    }

    /**
     * Carga las mascotas del usuario
     */
    loadPets() {
        // Obtener mascotas del localStorage o usar datos de ejemplo
        const pets = JSON.parse(localStorage.getItem('vetuni_pets')) || [
            {
                id: 'max',
                name: 'Max',
                species: 'Perro',
                breed: 'Golden Retriever',
                age: 3,
                weight: 28,
                avatar: '🐕'
            },
            {
                id: 'luna',
                name: 'Luna',
                species: 'Gato',
                breed: 'Siamés',
                age: 2,
                weight: 4,
                avatar: '🐱'
            }
        ];

        this.renderPets(pets);
    }

    /**
     * Renderiza las mascotas en el DOM
     */
    renderPets(pets) {
        const container = document.getElementById('petsContainer');
        if (!container) return;

        const petsHTML = pets.map(pet => `
            <div class="pet-option" data-pet-id="${pet.id}">
                <div class="pet-avatar">${pet.avatar}</div>
                <div class="pet-info">
                    <h3 class="pet-name">${pet.name}</h3>
                    <p class="pet-details">${pet.breed} • ${pet.age} años • ${pet.weight} kg</p>
                </div>
                <div class="pet-selector">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </div>
            </div>
        `).join('');

        container.innerHTML = petsHTML;
    }

    /**
     * Configura el selector de fecha
     */
    setupDatePicker() {
        const datePicker = document.getElementById('appointmentDate');
        if (!datePicker) return;

        // Establecer fecha mínima (mañana)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        datePicker.min = tomorrow.toISOString().split('T')[0];

        // Establecer fecha máxima (3 meses adelante)
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        datePicker.max = maxDate.toISOString().split('T')[0];
    }

    /**
     * Carga los veterinarios disponibles
     */
    loadVeterinarians() {
        const veterinarians = [
            {
                id: 'rosa-martinez',
                name: 'Dr. Rosa Martínez',
                specialty: 'Medicina General',
                experience: '8 años',
                rating: 4.9,
                image: '👩‍⚕️'
            },
            {
                id: 'carlos-lopez',
                name: 'Dr. Carlos López',
                specialty: 'Cirugía Veterinaria',
                experience: '12 años',
                rating: 4.8,
                image: '👨‍⚕️'
            },
            {
                id: 'ana-garcia',
                name: 'Dr. Ana García',
                specialty: 'Dermatología Veterinaria',
                experience: '6 años',
                rating: 4.7,
                image: '👩‍⚕️'
            }
        ];

        this.renderVeterinarians(veterinarians);
    }

    /**
     * Renderiza los veterinarios en el DOM
     */
    renderVeterinarians(veterinarians) {
        const container = document.getElementById('veterinariansContainer');
        if (!container) return;

        const vetsHTML = veterinarians.map(vet => `
            <div class="vet-option" data-vet-id="${vet.id}">
                <div class="vet-image">${vet.image}</div>
                <div class="vet-info">
                    <h3 class="vet-name">${vet.name}</h3>
                    <p class="vet-specialty">${vet.specialty}</p>
                    <div class="vet-details">
                        <span class="vet-experience">${vet.experience} de experiencia</span>
                        <span class="vet-rating">⭐ ${vet.rating}</span>
                    </div>
                </div>
                <div class="vet-selector">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </div>
            </div>
        `).join('');

        container.innerHTML = vetsHTML;
    }

    /**
     * Selecciona un servicio
     */
    selectService(element) {
        // Remover selección anterior
        document.querySelectorAll('.service-option').forEach(el => {
            el.classList.remove('selected');
        });

        // Seleccionar nuevo servicio
        element.classList.add('selected');
        
        this.selectedData.service = {
            id: element.dataset.serviceId,
            name: element.querySelector('.service-name').textContent,
            price: parseInt(element.dataset.price),
            duration: parseInt(element.dataset.duration)
        };

        this.updateNextButton();
    }

    /**
     * Selecciona una mascota
     */
    selectPet(element) {
        // Remover selección anterior
        document.querySelectorAll('.pet-option').forEach(el => {
            el.classList.remove('selected');
        });

        // Seleccionar nueva mascota
        element.classList.add('selected');
        
        this.selectedData.pet = {
            id: element.dataset.petId,
            name: element.querySelector('.pet-name').textContent
        };

        this.updateNextButton();
    }

    /**
     * Selecciona una fecha
     */
    selectDate(dateValue) {
        this.selectedData.date = dateValue;
        this.loadAvailableTimes(dateValue);
        this.updateNextButton();
    }

    /**
     * Carga los horarios disponibles para una fecha
     */
    loadAvailableTimes(date) {
        // Simular carga de horarios disponibles
        const timeSlots = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30'
        ];

        // Filtrar horarios ocupados (simulado)
        const occupiedSlots = ['09:30', '11:00', '15:00'];
        this.availableTimes = timeSlots.filter(slot => !occupiedSlots.includes(slot));

        this.renderTimeSlots();
    }

    /**
     * Renderiza los horarios disponibles
     */
    renderTimeSlots() {
        const container = document.getElementById('timeSlotsContainer');
        if (!container) return;

        const timeSlotsHTML = this.availableTimes.map(time => `
            <div class="time-slot" data-time="${time}">
                <span class="time-value">${time}</span>
            </div>
        `).join('');

        container.innerHTML = timeSlotsHTML;
    }

    /**
     * Selecciona una hora
     */
    selectTime(element) {
        // Remover selección anterior
        document.querySelectorAll('.time-slot').forEach(el => {
            el.classList.remove('selected');
        });

        // Seleccionar nueva hora
        element.classList.add('selected');
        
        this.selectedData.time = element.dataset.time;
        this.updateNextButton();
    }

    /**
     * Selecciona un veterinario
     */
    selectVeterinarian(element) {
        // Remover selección anterior
        document.querySelectorAll('.vet-option').forEach(el => {
            el.classList.remove('selected');
        });

        // Seleccionar nuevo veterinario
        element.classList.add('selected');
        
        this.selectedData.veterinarian = {
            id: element.dataset.vetId,
            name: element.querySelector('.vet-name').textContent,
            specialty: element.querySelector('.vet-specialty').textContent
        };

        this.updateNextButton();
        this.generateSummary();
    }

    /**
     * Avanza al siguiente paso
     */
    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateStepIndicator();
            this.showCurrentStep();
            this.updateNavigationButtons();
        }
    }

    /**
     * Retrocede al paso anterior
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepIndicator();
            this.showCurrentStep();
            this.updateNavigationButtons();
        }
    }

    /**
     * Valida el paso actual
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedData.service) {
                    this.showError('Por favor selecciona un servicio');
                    return false;
                }
                break;
            case 2:
                if (!this.selectedData.pet) {
                    this.showError('Por favor selecciona una mascota');
                    return false;
                }
                break;
            case 3:
                if (!this.selectedData.date || !this.selectedData.time) {
                    this.showError('Por favor selecciona fecha y hora');
                    return false;
                }
                break;
            case 4:
                if (!this.selectedData.veterinarian) {
                    this.showError('Por favor selecciona un veterinario');
                    return false;
                }
                break;
        }
        return true;
    }

    /**
     * Actualiza el indicador de pasos
     */
    updateStepIndicator() {
        const steps = document.querySelectorAll('.step-indicator .step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    /**
     * Muestra el paso actual
     */
    showCurrentStep() {
        const steps = document.querySelectorAll('.booking-step');
        steps.forEach((step, index) => {
            step.style.display = (index + 1 === this.currentStep) ? 'block' : 'none';
        });
    }

    /**
     * Actualiza los botones de navegación
     */
    updateNavigationButtons() {
        const nextBtn = document.getElementById('nextStepBtn');
        const prevBtn = document.getElementById('prevStepBtn');
        const confirmBtn = document.getElementById('confirmAppointmentBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        }

        if (confirmBtn) {
            confirmBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
        }
    }

    /**
     * Actualiza el botón siguiente
     */
    updateNextButton() {
        const nextBtn = document.getElementById('nextStepBtn');
        if (nextBtn) {
            const isValid = this.validateCurrentStep();
            nextBtn.disabled = !isValid;
            nextBtn.classList.toggle('disabled', !isValid);
        }
    }

    /**
     * Genera el resumen de la cita
     */
    generateSummary() {
        const summaryContainer = document.getElementById('appointmentSummary');
        if (!summaryContainer) return;

        const formattedDate = this.formatDate(this.selectedData.date);
        const summaryHTML = `
            <div class="summary-item">
                <h4>Servicio</h4>
                <p>${this.selectedData.service.name}</p>
                <span>$${this.selectedData.service.price.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <h4>Mascota</h4>
                <p>${this.selectedData.pet.name}</p>
            </div>
            <div class="summary-item">
                <h4>Fecha y Hora</h4>
                <p>${formattedDate} a las ${this.selectedData.time}</p>
                <span>${this.selectedData.service.duration} minutos</span>
            </div>
            <div class="summary-item">
                <h4>Veterinario</h4>
                <p>${this.selectedData.veterinarian.name}</p>
                <span>${this.selectedData.veterinarian.specialty}</span>
            </div>
            <div class="summary-total">
                <h3>Total: $${this.selectedData.service.price.toLocaleString()}</h3>
            </div>
        `;

        summaryContainer.innerHTML = summaryHTML;
    }

    /**
     * Confirma la reserva de la cita
     */
    confirmBooking() {
        this.showLoader();

        // Simular proceso de confirmación
        setTimeout(() => {
            this.hideLoader();
            
            // Guardar la cita
            this.saveAppointment();
            
            // Mostrar confirmación
            this.showSuccessMessage();
            
            // Redirigir a confirmación
            setTimeout(() => {
                if (window.VetUniNav) {
                    window.VetUniNav.navigateTo('client.appointmentsConfirmation', {
                        id: this.generateAppointmentId(),
                        from: 'booking'
                    });
                }
            }, 2000);
        }, 1500);
    }

    /**
     * Guarda la cita en localStorage
     */
    saveAppointment() {
        const appointment = {
            id: this.generateAppointmentId(),
            ...this.selectedData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        const appointments = JSON.parse(localStorage.getItem('vetuni_appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('vetuni_appointments', JSON.stringify(appointments));
    }

    /**
     * Genera un ID único para la cita
     */
    generateAppointmentId() {
        return 'APT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Formatea una fecha
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Muestra un mensaje de error
     */
    showError(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#2E7D5E'
            });
        } else {
            alert(message);
        }
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccessMessage() {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '¡Cita agendada exitosamente!',
                text: 'Te hemos enviado la confirmación por correo electrónico.',
                confirmButtonColor: '#2E7D5E'
            });
        } else {
            alert('¡Cita agendada exitosamente!');
        }
    }

    /**
     * Muestra el loader
     */
    showLoader() {
        const confirmBtn = document.getElementById('confirmAppointmentBtn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = `
                <div class="spinner"></div>
                Confirmando...
            `;
        }
    }

    /**
     * Oculta el loader
     */
    hideLoader() {
        const confirmBtn = document.getElementById('confirmAppointmentBtn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Confirmar Cita';
        }
    }
}

// Inicializar el componente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.appointment-booking-container')) {
        window.AppointmentBookingComponent = new AppointmentBooking();
        console.log('Appointment Booking Component inicializado');
    }
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppointmentBooking;
}