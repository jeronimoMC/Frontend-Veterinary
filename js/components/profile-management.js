/**
 * VetUni Profile Management Component
 * Maneja toda la funcionalidad relacionada con la gestión del perfil de usuario
 */

class ProfileManagement {
    constructor() {
        this.currentUser = null;
        this.editMode = false;
        this.originalUserData = null;
        this.avatarOptions = ['CR', 'AR', 'JM', 'ML', 'SP', 'DG', 'KL', 'FB'];
        this.init();
    }

    /**
     * Inicializa el componente
     */
    init() {
        this.loadUserProfile();
        this.setupEventListeners();
        this.renderProfile();
        this.loadStatistics();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Botón de editar perfil
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.toggleEditMode());
        }

        // Botón de guardar cambios
        const saveChangesBtn = document.getElementById('saveChangesBtn');
        if (saveChangesBtn) {
            saveChangesBtn.addEventListener('click', () => this.saveProfileChanges());
        }

        // Botón de cancelar edición
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.cancelEdit());
        }

        // Formulario de perfil
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }

        // Cambio de avatar
        const avatarSelector = document.getElementById('avatarSelector');
        if (avatarSelector) {
            avatarSelector.addEventListener('change', (e) => this.changeAvatar(e));
        }

        // Configuraciones de privacidad
        const privacySettings = document.querySelectorAll('.privacy-setting');
        privacySettings.forEach(setting => {
            setting.addEventListener('change', (e) => this.updatePrivacySetting(e));
        });

        // Configuraciones de notificaciones
        const notificationSettings = document.querySelectorAll('.notification-setting');
        notificationSettings.forEach(setting => {
            setting.addEventListener('change', (e) => this.updateNotificationSetting(e));
        });

        // Cambio de contraseña
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.showChangePasswordModal());
        }

        // Configuración 2FA
        const setup2FABtn = document.getElementById('setup2FABtn');
        if (setup2FABtn) {
            setup2FABtn.addEventListener('click', () => this.setup2FA());
        }

        // Exportar datos
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportUserData());
        }

        // Eliminar cuenta
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.showDeleteAccountModal());
        }

        // Validación en tiempo real
        const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Foto de perfil
        const photoInput = document.getElementById('profilePhoto');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }
    }

    /**
     * Carga el perfil del usuario desde localStorage
     */
    loadUserProfile() {
        const userData = localStorage.getItem('vetuni_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        } else {
            // Datos de ejemplo si no hay usuario
            this.currentUser = {
                id: 'user-001',
                name: 'Carlos Rodríguez',
                email: 'carlos.rodriguez@email.com',
                phone: '+57 300 123 4567',
                address: 'Calle 123 #45-67, Armenia, Quindío',
                avatar: 'CR',
                memberSince: '2023-01-15',
                birthDate: '1990-05-15',
                emergencyContact: {
                    name: 'María Rodríguez',
                    phone: '+57 300 987 6543',
                    relationship: 'Hermana'
                },
                preferences: {
                    notifications: {
                        email: true,
                        sms: true,
                        push: true,
                        reminders: true,
                        marketing: false
                    },
                    privacy: {
                        profileVisible: true,
                        showEmail: false,
                        showPhone: false,
                        dataSharing: false
                    },
                    language: 'es',
                    timezone: 'America/Bogota'
                },
                security: {
                    twoFactorEnabled: false,
                    lastPasswordChange: '2024-03-15',
                    activeSessions: 1
                },
                subscription: {
                    plan: 'basic',
                    status: 'active',
                    nextBilling: '2024-07-15'
                }
            };
            this.saveUserProfile();
        }
    }

    /**
     * Guarda el perfil del usuario en localStorage
     */
    saveUserProfile() {
        localStorage.setItem('vetuni_user', JSON.stringify(this.currentUser));
        
        // También actualizar en el estado de navegación
        if (window.VetUniNav) {
            window.VetUniNav.saveUserSession(this.currentUser);
        }
    }

    /**
     * Renderiza el perfil en el DOM
     */
    renderProfile() {
        this.updateProfileDisplay();
        this.updateAvatarDisplay();
        this.updatePersonalInfo();
        this.updateContactInfo();
        this.updatePreferences();
        this.updateSecurityInfo();
    }

    /**
     * Actualiza la visualización principal del perfil
     */
    updateProfileDisplay() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profilePhone = document.getElementById('profilePhone');
        const profileAddress = document.getElementById('profileAddress');
        const memberSince = document.getElementById('memberSince');

        if (profileName) profileName.textContent = this.currentUser.name;
        if (profileEmail) profileEmail.textContent = this.currentUser.email;
        if (profilePhone) profilePhone.textContent = this.currentUser.phone;
        if (profileAddress) profileAddress.textContent = this.currentUser.address;
        if (memberSince) {
            const memberDate = new Date(this.currentUser.memberSince);
            memberSince.textContent = `Miembro desde ${memberDate.toLocaleDateString('es-ES', { 
                month: 'long', 
                year: 'numeric' 
            })}`;
        }
    }

    /**
     * Actualiza la visualización del avatar
     */
    updateAvatarDisplay() {
        const avatarElements = document.querySelectorAll('.profile-avatar, .user-avatar');
        avatarElements.forEach(element => {
            element.textContent = this.currentUser.avatar;
        });
    }

    /**
     * Actualiza la información personal en el formulario
     */
    updatePersonalInfo() {
        const nameInput = document.getElementById('userName');
        const emailInput = document.getElementById('userEmail');
        const phoneInput = document.getElementById('userPhone');
        const addressInput = document.getElementById('userAddress');
        const birthDateInput = document.getElementById('userBirthDate');

        if (nameInput) nameInput.value = this.currentUser.name;
        if (emailInput) emailInput.value = this.currentUser.email;
        if (phoneInput) phoneInput.value = this.currentUser.phone;
        if (addressInput) addressInput.value = this.currentUser.address;
        if (birthDateInput) birthDateInput.value = this.currentUser.birthDate || '';
    }

    /**
     * Actualiza la información de contacto de emergencia
     */
    updateContactInfo() {
        if (!this.currentUser.emergencyContact) return;

        const emergencyName = document.getElementById('emergencyContactName');
        const emergencyPhone = document.getElementById('emergencyContactPhone');
        const emergencyRelationship = document.getElementById('emergencyContactRelationship');

        if (emergencyName) emergencyName.value = this.currentUser.emergencyContact.name;
        if (emergencyPhone) emergencyPhone.value = this.currentUser.emergencyContact.phone;
        if (emergencyRelationship) emergencyRelationship.value = this.currentUser.emergencyContact.relationship;
    }

    /**
     * Actualiza las preferencias del usuario
     */
    updatePreferences() {
        if (!this.currentUser.preferences) return;

        // Preferencias de notificación
        Object.keys(this.currentUser.preferences.notifications).forEach(key => {
            const checkbox = document.getElementById(`notification_${key}`);
            if (checkbox) {
                checkbox.checked = this.currentUser.preferences.notifications[key];
            }
        });

        // Preferencias de privacidad
        Object.keys(this.currentUser.preferences.privacy).forEach(key => {
            const checkbox = document.getElementById(`privacy_${key}`);
            if (checkbox) {
                checkbox.checked = this.currentUser.preferences.privacy[key];
            }
        });

        // Idioma
        const languageSelect = document.getElementById('userLanguage');
        if (languageSelect) {
            languageSelect.value = this.currentUser.preferences.language;
        }

        // Zona horaria
        const timezoneSelect = document.getElementById('userTimezone');
        if (timezoneSelect) {
            timezoneSelect.value = this.currentUser.preferences.timezone;
        }
    }

    /**
     * Actualiza la información de seguridad
     */
    updateSecurityInfo() {
        if (!this.currentUser.security) return;

        const twoFactorStatus = document.getElementById('twoFactorStatus');
        const lastPasswordChange = document.getElementById('lastPasswordChange');
        const activeSessions = document.getElementById('activeSessions');

        if (twoFactorStatus) {
            twoFactorStatus.textContent = this.currentUser.security.twoFactorEnabled ? 'Activado' : 'Desactivado';
            twoFactorStatus.className = `status ${this.currentUser.security.twoFactorEnabled ? 'enabled' : 'disabled'}`;
        }

        if (lastPasswordChange) {
            const changeDate = new Date(this.currentUser.security.lastPasswordChange);
            lastPasswordChange.textContent = changeDate.toLocaleDateString('es-ES');
        }

        if (activeSessions) {
            activeSessions.textContent = this.currentUser.security.activeSessions;
        }
    }

    /**
     * Carga las estadísticas del usuario
     */
    loadStatistics() {
        // Obtener datos de mascotas y citas
        const pets = JSON.parse(localStorage.getItem('vetuni_pets')) || [];
        const appointments = JSON.parse(localStorage.getItem('vetuni_appointments')) || [];

        // Actualizar elementos de estadísticas
        const totalPets = document.getElementById('totalPets');
        const totalAppointments = document.getElementById('totalAppointments');
        const upcomingAppointments = document.getElementById('upcomingAppointments');
        const lastVisitDays = document.getElementById('lastVisitDays');

        if (totalPets) totalPets.textContent = pets.length;
        if (totalAppointments) totalAppointments.textContent = appointments.length;
        
        // Calcular citas próximas
        const upcoming = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate > new Date();
        });
        if (upcomingAppointments) upcomingAppointments.textContent = upcoming.length;

        // Simular días desde última visita
        if (lastVisitDays) lastVisitDays.textContent = '18';
    }

    /**
     * Alterna el modo de edición
     */
    toggleEditMode() {
        this.editMode = !this.editMode;
        this.originalUserData = JSON.parse(JSON.stringify(this.currentUser));
        
        const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea, #profileForm select');
        const editButton = document.getElementById('editProfileBtn');
        const saveButton = document.getElementById('saveChangesBtn');
        const cancelButton = document.getElementById('cancelEditBtn');

        formInputs.forEach(input => {
            input.disabled = !this.editMode;
        });

        if (editButton) editButton.style.display = this.editMode ? 'none' : 'block';
        if (saveButton) saveButton.style.display = this.editMode ? 'block' : 'none';
        if (cancelButton) cancelButton.style.display = this.editMode ? 'block' : 'none';

        if (this.editMode) {
            this.showSuccessMessage('Modo de edición activado. Puedes modificar tu información.');
        }
    }

    /**
     * Maneja el envío del formulario de perfil
     */
    handleProfileSubmit(event) {
        event.preventDefault();
        this.saveProfileChanges();
    }

    /**
     * Guarda los cambios del perfil
     */
    saveProfileChanges() {
        if (!this.validateProfileForm()) {
            return;
        }

        const formData = new FormData(document.getElementById('profileForm'));
        
        // Actualizar datos del usuario
        this.currentUser.name = formData.get('userName');
        this.currentUser.email = formData.get('userEmail');
        this.currentUser.phone = formData.get('userPhone');
        this.currentUser.address = formData.get('userAddress');
        this.currentUser.birthDate = formData.get('userBirthDate');

        // Actualizar contacto de emergencia
        if (!this.currentUser.emergencyContact) {
            this.currentUser.emergencyContact = {};
        }
        this.currentUser.emergencyContact.name = formData.get('emergencyContactName');
        this.currentUser.emergencyContact.phone = formData.get('emergencyContactPhone');
        this.currentUser.emergencyContact.relationship = formData.get('emergencyContactRelationship');

        // Actualizar preferencias
        if (!this.currentUser.preferences) {
            this.currentUser.preferences = { notifications: {}, privacy: {} };
        }
        this.currentUser.preferences.language = formData.get('userLanguage');
        this.currentUser.preferences.timezone = formData.get('userTimezone');

        // Guardar cambios
        this.saveUserProfile();
        this.renderProfile();
        this.toggleEditMode();
        
        this.showSuccessMessage('Tu perfil ha sido actualizado exitosamente.');
    }

    /**
     * Cancela la edición
     */
    cancelEdit() {
        if (this.originalUserData) {
            this.currentUser = JSON.parse(JSON.stringify(this.originalUserData));
            this.renderProfile();
        }
        this.toggleEditMode();
        this.showInfoMessage('Los cambios han sido descartados.');
    }

    /**
     * Valida el formulario de perfil
     */
    validateProfileForm() {
        const form = document.getElementById('profileForm');
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

        this.clearFieldError(field);

        switch (field.name) {
            case 'userName':
                if (!value) {
                    errorMessage = 'El nombre es obligatorio';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;

            case 'userEmail':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'El email es obligatorio';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'El email no tiene un formato válido';
                    isValid = false;
                }
                break;

            case 'userPhone':
                const phoneRegex = /^\+?[1-9]\d{1,14}$/;
                if (!value) {
                    errorMessage = 'El teléfono es obligatorio';
                    isValid = false;
                } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    errorMessage = 'El teléfono no tiene un formato válido';
                    isValid = false;
                }
                break;

            case 'userBirthDate':
                if (value) {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (birthDate > today) {
                        errorMessage = 'La fecha de nacimiento no puede ser futura';
                        isValid = false;
                    } else if (age < 13) {
                        errorMessage = 'Debes ser mayor de 13 años';
                        isValid = false;
                    } else if (age > 120) {
                        errorMessage = 'La fecha parece incorrecta';
                        isValid = false;
                    }
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
     * Cambia el avatar del usuario
     */
    changeAvatar(event) {
        const newAvatar = event.target.value;
        this.currentUser.avatar = newAvatar;
        this.saveUserProfile();
        this.updateAvatarDisplay();
        this.showSuccessMessage('Avatar actualizado exitosamente.');
    }

    /**
     * Actualiza configuración de privacidad
     */
    updatePrivacySetting(event) {
        const setting = event.target.name.replace('privacy_', '');
        const value = event.target.checked;

        if (!this.currentUser.preferences) {
            this.currentUser.preferences = { privacy: {} };
        }
        if (!this.currentUser.preferences.privacy) {
            this.currentUser.preferences.privacy = {};
        }

        this.currentUser.preferences.privacy[setting] = value;
        this.saveUserProfile();
        
        this.showInfoMessage(`Configuración de privacidad actualizada: ${setting}`);
    }

    /**
     * Actualiza configuración de notificaciones
     */
    updateNotificationSetting(event) {
        const setting = event.target.name.replace('notification_', '');
        const value = event.target.checked;

        if (!this.currentUser.preferences) {
            this.currentUser.preferences = { notifications: {} };
        }
        if (!this.currentUser.preferences.notifications) {
            this.currentUser.preferences.notifications = {};
        }

        this.currentUser.preferences.notifications[setting] = value;
        this.saveUserProfile();
        
        this.showInfoMessage(`Configuración de notificaciones actualizada: ${setting}`);
    }

    /**
     * Muestra modal para cambiar contraseña
     */
    showChangePasswordModal() {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Cambiar Contraseña',
                html: `
                    <div style="text-align: left;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Contraseña Actual:</label>
                            <input type="password" id="currentPassword" class="swal2-input" placeholder="Contraseña actual">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Nueva Contraseña:</label>
                            <input type="password" id="newPassword" class="swal2-input" placeholder="Nueva contraseña">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Confirmar Contraseña:</label>
                            <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar nueva contraseña">
                        </div>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números.
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Cambiar Contraseña',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#2E7D5E',
                preConfirm: () => {
                    const current = document.getElementById('currentPassword').value;
                    const newPass = document.getElementById('newPassword').value;
                    const confirm = document.getElementById('confirmPassword').value;

                    if (!current || !newPass || !confirm) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }

                    if (newPass !== confirm) {
                        Swal.showValidationMessage('Las contraseñas no coinciden');
                        return false;
                    }

                    if (newPass.length < 8) {
                        Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres');
                        return false;
                    }

                    return { current, newPass };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.changePassword(result.value);
                }
            });
        }
    }

    /**
     * Cambia la contraseña del usuario
     */
    changePassword(passwordData) {
        // Simular cambio de contraseña
        this.showLoader('Cambiando contraseña...');

        setTimeout(() => {
            this.hideLoader();
            
            // Actualizar fecha de último cambio
            if (!this.currentUser.security) {
                this.currentUser.security = {};
            }
            this.currentUser.security.lastPasswordChange = new Date().toISOString();
            this.saveUserProfile();
            this.updateSecurityInfo();

            this.showSuccessMessage('Tu contraseña ha sido cambiada exitosamente.');
        }, 2000);
    }

    /**
     * Configura la autenticación de dos factores
     */
    setup2FA() {
        if (typeof Swal !== 'undefined') {
            if (this.currentUser.security && this.currentUser.security.twoFactorEnabled) {
                // Desactivar 2FA
                Swal.fire({
                    title: '¿Desactivar autenticación de dos factores?',
                    text: 'Esto reducirá la seguridad de tu cuenta.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, desactivar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#EF4444'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.disable2FA();
                    }
                });
            } else {
                // Activar 2FA
                Swal.fire({
                    title: 'Configurar Autenticación de Dos Factores',
                    html: `
                        <div style="text-align: center;">
                            <p style="margin-bottom: 20px;">Escanea este código QR con tu aplicación de autenticación:</p>
                            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <div style="font-size: 60px;">📱</div>
                                <p style="font-family: monospace; margin-top: 10px;">ABCD-EFGH-IJKL-MNOP</p>
                            </div>
                            <p style="font-size: 0.9rem; color: #666;">
                                Ingresa el código de 6 dígitos de tu aplicación:
                            </p>
                            <input type="text" id="verificationCode" class="swal2-input" placeholder="000000" maxlength="6">
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Verificar y Activar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#2E7D5E',
                    preConfirm: () => {
                        const code = document.getElementById('verificationCode').value;
                        if (!code || code.length !== 6) {
                            Swal.showValidationMessage('Ingresa un código de 6 dígitos');
                            return false;
                        }
                        return code;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.enable2FA();
                    }
                });
            }
        }
    }

    /**
     * Habilita la autenticación de dos factores
     */
    enable2FA() {
        if (!this.currentUser.security) {
            this.currentUser.security = {};
        }
        this.currentUser.security.twoFactorEnabled = true;
        this.saveUserProfile();
        this.updateSecurityInfo();
        
        this.showSuccessMessage('Autenticación de dos factores activada exitosamente.');
    }

    /**
     * Deshabilita la autenticación de dos factores
     */
    disable2FA() {
        if (!this.currentUser.security) {
            this.currentUser.security = {};
        }
        this.currentUser.security.twoFactorEnabled = false;
        this.saveUserProfile();
        this.updateSecurityInfo();
        
        this.showInfoMessage('Autenticación de dos factores desactivada.');
    }

    /**
     * Maneja la subida de foto de perfil
     */
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            this.showErrorMessage('Por favor selecciona una imagen válida.');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showErrorMessage('La imagen no puede ser mayor a 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // Aquí se subiría la imagen al servidor
            // Por ahora solo mostramos la previsualización
            const preview = document.getElementById('photoPreview');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }

            this.showSuccessMessage('Foto de perfil actualizada.');
        };

        reader.readAsDataURL(file);
    }

    /**
     * Exporta los datos del usuario
     */
    exportUserData() {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Exportar Datos',
                text: '¿Qué datos deseas exportar?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Solo Perfil',
                denyButtonText: 'Todos los Datos',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#2E7D5E',
                denyButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.downloadUserData('profile');
                } else if (result.isDenied) {
                    this.downloadUserData('all');
                }
            });
        }
    }

    /**
     * Descarga los datos del usuario
     */
    downloadUserData(type) {
        let dataToExport = {};

        if (type === 'profile') {
            dataToExport = {
                profile: this.currentUser,
                exportDate: new Date().toISOString(),
                type: 'profile'
            };
        } else {
            dataToExport = {
                profile: this.currentUser,
                pets: JSON.parse(localStorage.getItem('vetuni_pets')) || [],
                appointments: JSON.parse(localStorage.getItem('vetuni_appointments')) || [],
                exportDate: new Date().toISOString(),
                type: 'complete'
            };
        }

        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vetuni-datos-${type}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showSuccessMessage('Datos exportados exitosamente.');
    }

    /**
     * Muestra modal para eliminar cuenta
     */
    showDeleteAccountModal() {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '⚠️ Eliminar Cuenta Permanentemente',
                html: `
                    <div style="text-align: left;">
                        <p style="margin-bottom: 15px; color: #dc2626;">
                            Esta acción <strong>NO se puede deshacer</strong>. Se eliminará permanentemente:
                        </p>
                        <ul style="margin-bottom: 20px; color: #dc2626;">
                            <li>Tu perfil y toda tu información personal</li>
                            <li>El historial médico de todas tus mascotas</li>
                            <li>Todas las citas programadas y completadas</li>
                            <li>Cualquier dato asociado a tu cuenta</li>
                        </ul>
                        <p style="margin-bottom: 15px;">
                            Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
                        </p>
                        <input type="text" id="deleteConfirmation" class="swal2-input" placeholder="Escribe ELIMINAR">
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar Cuenta',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#DC2626',
                cancelButtonColor: '#6B7280',
                preConfirm: () => {
                    const confirmation = document.getElementById('deleteConfirmation').value;
                    if (confirmation !== 'ELIMINAR') {
                        Swal.showValidationMessage('Debes escribir ELIMINAR para confirmar');
                        return false;
                    }
                    return true;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteAccount();
                }
            });
        }
    }

    /**
     * Elimina la cuenta del usuario
     */
    deleteAccount() {
        this.showLoader('Eliminando cuenta...');

        setTimeout(() => {
            // Limpiar todos los datos
            localStorage.removeItem('vetuni_user');
            localStorage.removeItem('vetuni_pets');
            localStorage.removeItem('vetuni_appointments');
            
            this.hideLoader();
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Cuenta Eliminada',
                    text: 'Tu cuenta ha sido eliminada permanentemente.',
                    icon: 'success',
                    confirmButtonColor: '#2E7D5E',
                    allowOutsideClick: false
                }).then(() => {
                    // Redirigir al login
                    if (window.VetUniNav) {
                        window.VetUniNav.logout();
                    } else {
                        window.location.href = '/login.html';
                    }
                });
            } else {
                alert('Cuenta eliminada exitosamente.');
                window.location.href = '/login.html';
            }
        }, 3000);
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccessMessage(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: message,
                timer: 3000,
                confirmButtonColor: '#2E7D5E'
            });
        } else {
            alert(message);
        }
    }

    /**
     * Muestra un mensaje de información
     */
    showInfoMessage(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Información',
                text: message,
                timer: 2000,
                confirmButtonColor: '#2E7D5E'
            });
        } else {
            alert(message);
        }
    }

    /**
     * Muestra un mensaje de error
     */
    showErrorMessage(message) {
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
     * Muestra el loader
     */
    showLoader(message = 'Cargando...') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: message,
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
    }

    /**
     * Oculta el loader
     */
    hideLoader() {
        if (typeof Swal !== 'undefined') {
            Swal.close();
        }
    }

    /**
     * Obtiene las actividades recientes del usuario
     */
    getRecentActivity() {
        // Simular actividades recientes
        return [
            {
                type: 'appointment',
                title: 'Cita confirmada para Max',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                icon: '📅'
            },
            {
                type: 'profile',
                title: 'Perfil actualizado',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                icon: '👤'
            },
            {
                type: 'pet',
                title: 'Nueva mascota agregada: Luna',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                icon: '🐾'
            }
        ];
    }

    /**
     * Renderiza las actividades recientes
     */
    renderRecentActivity() {
        const container = document.getElementById('recentActivityContainer');
        if (!container) return;

        const activities = this.getRecentActivity();
        const activitiesHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <p class="activity-title">${activity.title}</p>
                    <span class="activity-date">${this.formatRelativeDate(activity.date)}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = activitiesHTML;
    }

    /**
     * Formatea una fecha relativa
     */
    formatRelativeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoy';
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
        
        return date.toLocaleDateString('es-ES');
    }
}

// Inicializar el componente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.profile-management-container') || 
        document.querySelector('#profileForm') || 
        window.location.pathname.includes('profile.html')) {
        window.ProfileManagementComponent = new ProfileManagement();
        console.log('Profile Management Component inicializado');
    }
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileManagement;
}