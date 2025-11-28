describe("Login", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/auth/login");
  });

  it("Validar el ingreso con credenciales válidas", () => {
    cy.log("**Inicio de sesión con credenciales válidas**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.usuarioValido.email, data.usuarioValido.password);
      cy.clickLoginButton();
      cy.url().should("eq", "https://ticketazo.com.ar/");
      cy.get("a").contains("Mis entradas").should("be.visible");
      cy.get("a").contains("Mi perfil").should("be.visible");
      cy.get("button").contains("Logout").should("be.visible");
    });
  });

  it("Validar que no se permita ingresar con contraseña incorrecta", () => {
    cy.log("**Inicio de sesión con contraseña incorrecta**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.passwordInvalida.email, data.passwordInvalida.password);
      cy.clickLoginButton();
      cy.mensajeErrorCredenciales();
    });
  });

  it("Validar que no se permita ingresar con email incorrecto", () => {
    cy.log("**Inicio de sesión con email incorrecto**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.emailInvalido.email, data.emailInvalido.password);
      cy.clickLoginButton();
      cy.mensajeErrorCredenciales();
    });
  });

  it("Validar que no se permita ingresar sin email", () => {
    cy.log("**Inicio de sesión sin email**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.emailVacio.email, data.emailVacio.password);
      cy.clickLoginButton();
      cy.mensajeCompletarCampo();
      cy.mensajeErrorCredenciales();
    });
  });

  it("Validar que no se permita ingresar sin contraseña", () => {
    cy.log("**Inicio de sesión sin contraseña**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.passwordVacia.email, data.passwordVacia.password);
      cy.clickLoginButton();
      cy.mensajeCompletarCampo();
      cy.mensajeErrorCredenciales();
    });
  });

  it("Validar que no se permita ingresar con ambos campos vacíos", () => {
    cy.log("**Inicio de sesión con campos vacíos**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.camposVacios.email, data.camposVacios.password);
      cy.clickLoginButton();
      cy.mensajeCompletarCampo();
      cy.mensajeErrorCredenciales();
    });
  });

  it("Validar formato válido de email", () => {
    cy.log("**Inicio de sesión con formato inválido de email**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(
        data.emailFormatoInvalido.email,
        data.emailFormatoInvalido.password
      );
      cy.clickLoginButton();
      cy.mensajeFormatoEmail(data.emailFormatoInvalido.email);
    });
  });

  it("Validar mensaje de error por falta de verificación de email", () => {
    cy.log("**Mensaje de error por email sin validación**");
    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.emailSinValidar.email, data.emailSinValidar.password);
      cy.clickLoginButton();
      cy.mensajeEmailNoConfirmado();
    });
  });

  /* Esta prueba se deja afuera de la automatización para evitar problemas con el inicio de sesión de Google ya que tira
  un error 403 
  it("Validar el ingreso mediante Google", () => {
    cy.log("**Inicio de sesión mediante Google**");
    cy.sesionGoogle();
  });
  */

  it("Validar el link ¿Olvidaste tu contraseña?", () => {
    cy.log("**Validar link de '¿Olvidaste tu contraseña?'**");
    cy.linkForgotPassword();
    cy.urlForgotPassword();
  });

  it("Validar el link ¿No tenes cuenta? Registrate!", () => {
    cy.log("**Validar link de '¿No tenes cuenta? Registrate!'**");
    cy.linkRegisterUser();
    cy.urlRegisterUser();
  });

  it("Validar el link ¿Queres crear tus eventos?", () => {
    cy.log("**Validar link ¿Queres crear tus eventos?**");
    cy.linkRegisterClient();
    cy.urlRegisterClient();
  });

  it("Login exitoso muestra botón de logout y luego Login", function () {
    
    cy.intercept("POST", "/api/backend/auth/login").as("loginRequest");

    cy.fixture("usuariosLogin").then((data) => {
      cy.login(data.usuarioValido.email, data.usuarioValido.password);
      cy.clickLoginButton();

      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      cy.contains("button", "Logout", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("button", "Login", { timeout: 10000 }).should("be.visible");
    });
  });
})