describe('Tests de Registro', () => {
  let usuarioData;

  beforeEach(() => {
    cy.fixture('registroTemplate').then((data) => {
      usuarioData = { ...data };

      // Generación de datos dinámicos para evitar TC-27: 'Usuario ya registrado'
      const randomId = Math.floor(Math.random() * 1000000);
      usuarioData.dni = `${10000000 + randomId}`;
      usuarioData.email = `auto.test.${randomId}@ticketazo.com`;
      usuarioData.emailConfirm = `auto.test.${randomId}@ticketazo.com`;
    });

    cy.visit('https://ticketazo.com.ar/auth/registerUser');
  });

  context('Validaciones de Campos Individuales (on blur)', () => {

    it('TC-03: Campos obligatorios vacíos (al hacer submit)', () => {
      cy.get('[data-cy="btn-registrarse"]').click();
      // Esperamos que existan al menos 4 mensajes de error de campo
      cy.get('[data-slot="error-message"]').should('have.length.at.least', 4);
    });

    it('TC-04: Nombre/Apellido no aceptan caracteres especiales/números', () => {
      // Nombre
      cy.get('[data-cy="input-nombres"]').type('Juan123').blur();
      cy.get('[data-slot="error-message"]').should('exist');

      // Apellido
      cy.get('[data-cy="input-apellido"]').type('Perez!').blur();
      cy.get('[data-slot="error-message"]').should('exist');
    });

    it('Teléfono y DNI (Longitud)', () => {
      // Teléfono (Longitud)
      cy.get('[data-cy="input-telefono"]').clear().type('12345').blur(); // <10 (TC-07)
      cy.get('[data-slot="error-message"]').should('exist');

      // DNI (Longitud > 8)
      cy.get('[data-cy="input-dni"]').clear().type('123456789').blur(); // >8 (TC-12)
      cy.get('[data-slot="error-message"]').should('exist');

      // DNI (Longitud 7 Válida - TC-13)
      cy.get('[data-cy="input-dni"]').clear().type('1234567').blur();
      cy.get('[data-slot="error-message"]').should('not.exist');
    });

    it('TC-17, TC-18: Fechas de nacimiento inválidas', () => {
      // Futura (2090)
      cy.get('[data-type="day"]').clear().type('15');
      cy.get('[data-type="month"]').clear().type('02');
      cy.get('[data-type="year"]').clear().type('2090').blur();
      cy.get('[data-slot="error-message"]').should('exist');
    });

    it('TC-19, TC-20, TC-21: Email inválido (Formato)', () => {
      // Sin arroba
      cy.get('[data-cy="input-email"]').type('correo.com').blur();
      cy.get('[data-slot="error-message"]').should('exist');

      // Con espacios
      cy.get('[data-cy="input-email"]').clear().type('con espacios@mail.com').blur();
      cy.get('[data-slot="error-message"]').should('exist');
    });

   it('TC-22, TC-23: Emails no coinciden (Error Global)', () => {
        cy.llenarFormularioRegistro(usuarioData);

        // emails no coinciden
        cy.get('[data-cy="input-email"]').clear().type('a@a.com');
        cy.get('[data-cy="input-confirmar-email"]').clear().type('b@b.com');

        cy.get('[data-cy="btn-registrarse"]').click();

        cy.get('[data-cy="error-message"]')
            .should('be.visible')
            .and('contain', 'Los correos electrónicos no coinciden');

        // TC-23: Test Positivo (No debe haber error si coinciden)
        cy.get('[data-cy="input-confirmar-email"]').clear().type('a@a.com');
        cy.get('[data-cy="btn-registrarse"]').click();
        cy.get('[data-cy="error-message"]').should('not.exist');
    });
  });

  context('Validaciones de Password y Flujo de Negocio (on submit)', () => {

    it('TC-24, TC-25: Contraseñas no coinciden', () => {
        cy.llenarFormularioRegistro(usuarioData);

        // las contraseñas no coinciden
        cy.get('[data-cy="input-password"]').clear().type('Pass123!');
        cy.get('[data-cy="input-repetir-password"]').clear().type('NoCoincide456!');

        cy.get('[data-cy="btn-registrarse"]').click();

        cy.get('[data-cy="error-message"]')
            .should('be.visible')
            .and('contain', 'Las contraseñas no coinciden');

        // TC-25: Test Positivo (No debe haber error si coinciden)
        cy.get('[data-cy="input-repetir-password"]').clear().type('Pass123!');
        cy.get('[data-cy="btn-registrarse"]').click();
        cy.get('[data-cy="error-message"]').should('not.exist');
    });

    it('TC-29: Contraseña con requisitos de seguridad (Global Error)', () => {
      const datosDebiles = { ...usuarioData, password: 'abc', passwordConfirm: 'abc' };

      cy.llenarFormularioRegistro(datosDebiles);
      cy.get('[data-cy="btn-registrarse"]').click();

      cy.get('[data-cy="error-message"]')
        .should('be.visible')
    });

    it('TC-28: Registro Exitoso (Happy Path)', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.llenarFormularioRegistro(usuarioData);
      cy.get('[data-cy="btn-registrarse"]').click();

      cy.wrap(alertStub).should('have.been.calledWithMatch', /Usuario registrado con éxito/i);
    });

    it('TC-27: Intentar registrar un usuario existente (DNI vs Email)', () => {

        const DNI_EXISTENTE = '12345678';
        const EMAIL_EXISTENTE = 'test@test.com';

        cy.log('*** TC-27A: DNI Existente ***');

        const casoDNIExistente = {
            ...usuarioData,
            email: EMAIL_EXISTENTE,
            emailConfirm: EMAIL_EXISTENTE,
            dni: DNI_EXISTENTE
        };

        cy.llenarFormularioRegistro(casoDNIExistente);
        cy.get('[data-cy="btn-registrarse"]').click();

        cy.get('[data-cy="error-message"]')
        .should('be.visible')
        .and('contain', 'Ya existe un usuario registrado con ese DNI');

        cy.log('*** TC-27B: Email Existente (con DNI Nuevo) ***');

        cy.visit('https://ticketazo.com.ar/auth/registerUser');

        const DNI_NUEVO = usuarioData.dni;

        const casoEmailExistente = {
            ...usuarioData,
            email: EMAIL_EXISTENTE,
            emailConfirm: EMAIL_EXISTENTE,
            dni: DNI_NUEVO
        };

        cy.llenarFormularioRegistro(casoEmailExistente);
        cy.get('[data-cy="btn-registrarse"]').click();

        cy.get('[data-cy="error-message"]')
        .should('be.visible')
        .and('contain', 'Ya existe un usuario registrado con ese correo electrónico');
    });
  });
});