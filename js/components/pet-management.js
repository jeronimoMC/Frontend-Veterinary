/**
 * VetUni Pet Management Component
 * Maneja toda la funcionalidad relacionada con la gestión de mascotas
 */

class PetManagement {
    constructor() {
        this.pets = [];
        this.currentPet = null;
        this.editMode = false;
        this.init();
    }

    /**
     * Inicializa el componente
     */
    init() {
        this.loadPets();
        this.setupEventListeners();
        this.renderPets();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Formulario de agregar/editar mascota
        const petForm = document.getElementById('petForm');
        if (petForm) {
            petForm.addEventListener('submit', (e) => this.handlePetSubmit(e));
        }

        // Botón de agregar mascota
        const addPetBtn = document.getElementById('addPetBtn');
        if (addPetBtn) {
            addPetBtn.addEventListener('click', () => this.showAddPetModal());
        }

        // Botones de acción en tarjetas de mascotas
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-pet-btn')) {
                const petId = e.target.closest('.pet-card').dataset.petId;
                this.editPet(petId);
            }

            if (e.target.matches('.delete-pet-btn')) {
                const petId = e.target.closest('.pet-card').dataset.petId;
                this.deletePet(petId);
            }

            if (e.target.matches('.view-pet-btn')) {
                const petId = e.target.closest('.pet-card').dataset.petId;
                this.viewPetDetails(petId);
            }

            if (e.target.matches('.schedule-appointment-btn')) {
                const petId = e.target.closest('.pet-card').dataset.petId;
                this.scheduleAppointment(petId);
            }
        });

        // Cerrar modal
        const closeModalBtns = document.querySelectorAll('.close-modal, .modal-overlay');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target === btn) {
                    this.closeModal();
                }
            });
        });

        // Validación en tiempo real
        const formFields = document.querySelectorAll('#petForm input, #petForm select, #petForm textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Previsualización de imagen
        const photoInput = document.getElementById('petPhoto');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.previewPhoto(e));
        }
    }

    /**
     * Carga las mascotas desde localStorage
     */
    loadPets() {
        const storedPets = localStorage.getItem('vetuni_pets');
        if (storedPets) {
            this.pets = JSON.parse(storedPets);
        } else {
            // Datos de ejemplo si no hay mascotas guardadas
            this.pets = [
                {
                    id: 'max-001',
                    name: 'Max',
                    species: 'Perro',
                    breed: 'Golden Retriever',
                    gender: 'Macho',
                    birthDate: '2021-03-15',
                    weight: 28,
                    color: 'Dorado',
                    microchip: 'MIC123456789',
                    avatar: '🐕',
                    status: 'Activo',
                    medicalNotes: 'Mascota saludable, al día con vacunas',
                    owner: 'Carlos Rodríguez',
                    lastVisit: '2024-05-15',
                    nextVaccine: '2024-08-15',
                    createdAt: '2023-01-15T10:00:00Z'
                },
                {
                    id: 'luna-002',
                    name: 'Luna',
                    species: 'Gato',
                    breed: 'Siamés',
                    gender: 'Hembra',
                    birthDate: '2022-07-20',
                    weight: 4,
                    color: 'Blanco y Negro',
                    microchip: 'MIC987654321',
                    avatar: '🐱',
                    status: 'Activo',
                    medicalNotes: 'Requiere vacuna de refuerzo próximamente',
                    owner: 'Carlos Rodríguez',
                    lastVisit: '2024-06-01',
                    nextVaccine: '2024-06-20',
                    createdAt: '2023-03-20T14:30:00Z'
                }
            ];
            this.savePets();
        }
    }

    /**
     * Guarda las mascotas en localStorage
     */
    savePets() {
        localStorage.setItem('vetuni_pets', JSON.stringify(this.pets));
    }

    /**
     * Renderiza las mascotas en el DOM
     */
    renderPets() {
        const container = document.getElementById('petsContainer');
        if (!container) return;

        if (this.pets.length === 0) {
            this.renderEmptyState(container);
            return;
        }

        const petsHTML = this.pets.map(pet => this.renderPetCard(pet)).join('');
        container.innerHTML = petsHTML;

        // Actualizar estadísticas
        this.updateStatistics();
    }

    /**
     * Renderiza una tarjeta de mascota
     */
    renderPetCard(pet) {
        const age = this.calculateAge(pet.birthDate);
        const statusClass = pet.status === 'Activo' ? 'active' : 'inactive';
        const nextVaccineStatus = this.getVaccineStatus(pet.nextVaccine);

        return `
            <div class="pet-card ${pet.species.toLowerCase()}" data-pet-id="${pet.id}">
                <div class="pet-header">
                    <div class="pet-avatar">${pet.avatar}</div>
                    <div class="pet-status ${statusClass}">${pet.status}</div>
                </div>
                <div class="pet-content">
                    <h3 class="pet-name">${pet.name}</h3>
                    <p class="pet-breed">${pet.breed} • ${age}</p>
                    
                    <div class="pet-details">
                        <div class="detail-item">
                            <span class="detail-label">Peso:</span>
                            <span class="detail-value">${pet.weight} kg</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Color:</span>
                            <span class="detail-value">${pet.color}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Género:</span>
                            <span class="detail-value">${pet.gender}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Microchip:</span>
                            <span class="detail-value">${pet.microchip}</span>
                        </div>
                    </div>

                    <div class="pet-health-info">
                        <div class="health-item">
                            <span class="health-label">Última visita:</span>
                            <span class="health-value">${this.formatDate(pet.lastVisit)}</span>
                        </div>
                        <div class="health-item">
                            <span class="health-label">Próxima vacuna:</span>
                            <span class="health-value ${nextVaccineStatus.class}">${nextVaccineStatus.text}</span>
                        </div>
                    </div>

                    ${pet.medicalNotes ? `
                        <div class="pet-notes">
                            <p>${pet.medicalNotes}</p>
                        </div>
                    ` : ''}

                    <div class="pet-actions">
                        <button class="action-btn primary view-pet-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            Ver Detalles
                        </button>
                        <button class="action-btn secondary edit-pet-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            Editar
                        </button>
                        <button class="action-btn outline schedule-appointment-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            Agendar Cita
                        </button>
                        <button class="action-btn danger delete-pet-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza el estado vacío
     */
    renderEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🐾</div>
                <h3>No tienes mascotas registradas</h3>
                <p>Agrega tu primera mascota para comenzar a gestionar su información veterinaria</p>
                <button class="btn-primary" onclick="window.PetManagementComponent.showAddPetModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Agregar Primera Mascota
                </button>
            </div>
        `;
    }

    /**
     * Muestra el modal para agregar mascota
     */
    showAddPetModal() {
        this.editMode = false;
        this.currentPet = null;
        this.resetForm();
        this.updateModalTitle('Agregar Nueva Mascota');
        this.showModal();
    }

    /**
     * Edita una mascota
     */
    editPet(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return;

        this.editMode = true;
        this.currentPet = pet;
        this.populateForm(pet);
        this.updateModalTitle(`Editar ${pet.name}`);
        this.showModal();
    }

    /**
     * Elimina una mascota
     */
    deletePet(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return;

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: `¿Eliminar a ${pet.name}?`,
                text: 'Esta acción no se puede deshacer. Se eliminará toda la información médica asociada.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#6B7280',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.pets = this.pets.filter(p => p.id !== petId);
                    this.savePets();
                    this.renderPets();
                    
                    Swal.fire({
                        title: 'Eliminado',
                        text: `${pet.name} ha sido eliminado exitosamente.`,
                        icon: 'success',
                        confirmButtonColor: '#2E7D5E'
                    });
                }
            });
        } else {
            if (confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
                this.pets = this.pets.filter(p => p.id !== petId);
                this.savePets();
                this.renderPets();
                alert(`${pet.name} ha sido eliminado exitosamente.`);
            }
        }
    }

    /**
     * Ver detalles de una mascota
     */
    viewPetDetails(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return;

        const age = this.calculateAge(pet.birthDate);
        const detailsHTML = `
            <div class="pet-details-modal">
                <div class="pet-header-details">
                    <div class="pet-avatar-large">${pet.avatar}</div>
                    <div class="pet-info-details">
                        <h2>${pet.name}</h2>
                        <p>${pet.breed} • ${age}</p>
                        <span class="pet-status ${pet.status.toLowerCase()}">${pet.status}</span>
                    </div>
                </div>
                
                <div class="details-grid">
                    <div class="detail-section">
                        <h3>Información General</h3>
                        <div class="detail-list">
                            <div class="detail-row">
                                <span>Especie:</span>
                                <span>${pet.species}</span>
                            </div>
                            <div class="detail-row">
                                <span>Raza:</span>
                                <span>${pet.breed}</span>
                            </div>
                            <div class="detail-row">
                                <span>Género:</span>
                                <span>${pet.gender}</span>
                            </div>
                            <div class="detail-row">
                                <span>Fecha de nacimiento:</span>
                                <span>${this.formatDate(pet.birthDate)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Peso:</span>
                                <span>${pet.weight} kg</span>
                            </div>
                            <div class="detail-row">
                                <span>Color:</span>
                                <span>${pet.color}</span>
                            </div>
                            <div class="detail-row">
                                <span>Microchip:</span>
                                <span>${pet.microchip}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Información Médica</h3>
                        <div class="detail-list">
                            <div class="detail-row">
                                <span>Última visita:</span>
                                <span>${this.formatDate(pet.lastVisit)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Próxima vacuna:</span>
                                <span>${this.formatDate(pet.nextVaccine)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Estado:</span>
                                <span class="status-badge healthy">Saludable</span>
                            </div>
                        </div>
                        
                        ${pet.medicalNotes ? `
                            <div class="medical-notes">
                                <h4>Notas médicas:</h4>
                                <p>${pet.medicalNotes}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-primary" onclick="window.PetManagementComponent.scheduleAppointment('${pet.id}')">
                        Agendar Cita
                    </button>
                    <button class="btn-secondary" onclick="window.PetManagementComponent.editPet('${pet.id}')">
                        Editar Información
                    </button>
                    <button class="btn-outline" onclick="window.PetManagementComponent.closeModal()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '',
                html: detailsHTML,
                showConfirmButton: false,
                width: 700,
                customClass: {
                    container: 'pet-details-swal'
                }
            });
        }
    }

    /**
     * Agendar cita para una mascota
     */
    scheduleAppointment(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return;

        if (window.VetUniNav) {
            window.VetUniNav.navigateTo('shared.appointmentBooking', { petId: pet.id });
        } else {
            window.location.href = `/shared/appointment-booking.html?petId=${pet.id}`;
        }
    }

    /**
     * Maneja el envío del formulario
     */
    handlePetSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(event.target);
        const petData = this.extractPetData(formData);

        if (this.editMode && this.currentPet) {
            this.updatePet(petData);
        } else {
            this.addPet(petData);
        }
    }

    /**
     * Extrae los datos de la mascota del formulario
     */
    extractPetData(formData) {
        return {
            id: this.editMode ? this.currentPet.id : this.generatePetId(),
            name: formData.get('name'),
            species: formData.get('species'),
            breed: formData.get('breed'),
            gender: formData.get('gender'),
            birthDate: formData.get('birthDate'),
            weight: parseFloat(formData.get('weight')),
            color: formData.get('color'),
            microchip: formData.get('microchip'),
            avatar: this.getAvatarForSpecies(formData.get('species')),
            status: 'Activo',
            medicalNotes: formData.get('medicalNotes') || '',
            owner: 'Carlos Rodríguez', // Esto vendría de la sesión del usuario
            lastVisit: this.editMode ? this.currentPet.lastVisit : null,
            nextVaccine: this.calculateNextVaccineDate(formData.get('birthDate')),
            createdAt: this.editMode ? this.currentPet.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * Agrega una nueva mascota
     */
    addPet(petData) {
        this.pets.push(petData);
        this.savePets();
        this.renderPets();
        this.closeModal();
        this.showSuccessMessage(`${petData.name} ha sido agregado exitosamente.`);
    }

    /**
     * Actualiza una mascota existente
     */
    updatePet(petData) {
        const index = this.pets.findIndex(p => p.id === this.currentPet.id);
        if (index !== -1) {
            this.pets[index] = petData;
            this.savePets();
            this.renderPets();
            this.closeModal();
            this.showSuccessMessage(`${petData.name} ha sido actualizado exitosamente.`);
        }
    }

    /**
     * Valida el formulario
     */
    validateForm() {
        const form = document.getElementById('petForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Valida un campo específico
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Limpiar errores anteriores
        this.clearFieldError(field);

        // Validaciones según el tipo de campo
        switch (field.name) {
            case 'name':
                if (!value) {
                    errorMessage = 'El nombre es obligatorio';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;

            case 'weight':
                if (!value) {
                    errorMessage = 'El peso es obligatorio';
                    isValid = false;
                } else if (parseFloat(value) <= 0) {
                    errorMessage = 'El peso debe ser mayor a 0';
                    isValid = false;
                } else if (parseFloat(value) > 200) {
                    errorMessage = 'El peso parece demasiado alto';
                    isValid = false;
                }
                break;

            case 'birthDate':
                if (!value) {
                    errorMessage = 'La fecha de nacimiento es obligatoria';
                    isValid = false;
                } else {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const maxAge = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
                    
                    if (birthDate > today) {
                        errorMessage = 'La fecha de nacimiento no puede ser futura';
                        isValid = false;
                    } else if (birthDate < maxAge) {
                        errorMessage = 'La fecha parece demasiado antigua';
                        isValid = false;
                    }
                }
                break;

            case 'microchip':
                if (value && value.length < 8) {
                    errorMessage = 'El microchip debe tener al menos 8 caracteres';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    /**
     * Muestra error en un campo
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Limpia el error de un campo
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Genera un ID único para la mascota
     */
    generatePetId() {
        return 'pet-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Obtiene el avatar según la especie
     */
    getAvatarForSpecies(species) {
        const avatars = {
            'Perro': '🐕',
            'Gato': '🐱',
            'Conejo': '🐰',
            'Hámster': '🐹',
            'Ave': '🐦'
        };
        
        return avatars[species] || '🐾';
    }

    /**
     * Calcula la próxima fecha de vacuna
     */
    calculateNextVaccineDate(birthDate) {
        const birth = new Date(birthDate);
        const nextVaccine = new Date(birth);
        nextVaccine.setFullYear(nextVaccine.getFullYear() + 1);
        
        return nextVaccine.toISOString().split('T')[0];
    }

    /**
     * Calcula la edad de la mascota
     */
    calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        if (age === 0) {
            const monthsDiff = (today.getFullYear() - birth.getFullYear()) * 12 + monthDiff;
            return monthsDiff === 1 ? '1 mes' : `${monthsDiff} meses`;
        }
        
        return age === 1 ? '1 año' : `${age} años`;
    }

    /**
     * Obtiene el estado de la vacuna
     */
    getVaccineStatus(nextVaccineDate) {
        const today = new Date();
        const vaccineDate = new Date(nextVaccineDate);
        const daysDiff = Math.ceil((vaccineDate - today) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) {
            return { text: 'Vencida', class: 'overdue' };
        } else if (daysDiff <= 30) {
            return { text: `${daysDiff} días`, class: 'due-soon' };
        } else {
            return { text: this.formatDate(nextVaccineDate), class: 'up-to-date' };
        }
    }

    /**
     * Formatea una fecha
     */
    formatDate(dateString) {
        if (!dateString) return 'No registrada';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Actualiza las estadísticas
     */
    updateStatistics() {
        const totalPetsElement = document.getElementById('totalPets');
        const activePetsElement = document.getElementById('activePets');
        const upcomingVaccinesElement = document.getElementById('upcomingVaccines');

        if (totalPetsElement) {
            totalPetsElement.textContent = this.pets.length;
        }

        if (activePetsElement) {
            const activePets = this.pets.filter(pet => pet.status === 'Activo').length;
            activePetsElement.textContent = activePets;
        }

        if (upcomingVaccinesElement) {
            const upcomingVaccines = this.pets.filter(pet => {
                const vaccineStatus = this.getVaccineStatus(pet.nextVaccine);
                return vaccineStatus.class === 'due-soon' || vaccineStatus.class === 'overdue';
            }).length;
            upcomingVaccinesElement.textContent = upcomingVaccines;
        }
    }

    /**
     * Previsualiza la foto subida
     */
    previewPhoto(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('photoPreview');
        
        if (file && preview) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Resetea el formulario
     */
    resetForm() {
        const form = document.getElementById('petForm');
        if (form) {
            form.reset();
            
            // Limpiar errores
            const errorElements = form.querySelectorAll('.field-error');
            errorElements.forEach(el => el.remove());
            
            const errorFields = form.querySelectorAll('.error');
            errorFields.forEach(field => field.classList.remove('error'));
            
            // Ocultar previsualización de foto
            const preview = document.getElementById('photoPreview');
            if (preview) {
                preview.style.display = 'none';
                preview.src = '';
            }
        }
    }

    /**
     * Popula el formulario con datos de una mascota
     */
    populateForm(pet) {
        const form = document.getElementById('petForm');
        if (!form) return;

        // Llenar campos del formulario
        Object.keys(pet).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = pet[key];
            }
        });
    }

    /**
     * Actualiza el título del modal
     */
    updateModalTitle(title) {
        const titleElement = document.getElementById('modalTitle');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Muestra el modal
     */
    showModal() {
        const modal = document.getElementById('petModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Cierra el modal
     */
    closeModal() {
        const modal = document.getElementById('petModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        this.resetForm();
        this.editMode = false;
        this.currentPet = null;
    }

    /**
     * Muestra mensaje de éxito
     */
    showSuccessMessage(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: message,
                confirmButtonColor: '#2E7D5E'
            });
        } else {
            alert(message);
        }
    }

    /**
     * Exporta datos de mascotas
     */
    exportPets() {
        const dataStr = JSON.stringify(this.pets, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mascotas-vetuni-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    /**
     * Busca mascotas
     */
    searchPets(query) {
        const filteredPets = this.pets.filter(pet => 
            pet.name.toLowerCase().includes(query.toLowerCase()) ||
            pet.breed.toLowerCase().includes(query.toLowerCase()) ||
            pet.species.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderFilteredPets(filteredPets);
    }

    /**
     * Renderiza mascotas filtradas
     */
    renderFilteredPets(pets) {
        const container = document.getElementById('petsContainer');
        if (!container) return;

        if (pets.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron mascotas que coincidan con tu búsqueda.</p>
                </div>
            `;
            return;
        }

        const petsHTML = pets.map(pet => this.renderPetCard(pet)).join('');
        container.innerHTML = petsHTML;
    }
}

// Inicializar el componente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.pets-management-container')) {
        window.PetManagementComponent = new PetManagement();
        console.log('Pet Management Component inicializado');
    }
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PetManagement;
}