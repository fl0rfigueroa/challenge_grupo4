Cypress.Commands.add("login", (email, password) => {
  cy.get('[data-cy="input-email"]').clear().type(email);
  cy.get('[data-cy="input-password"]').clear();
  if (password) {
    cy.get('[data-cy="input-password"]').type(password);
  }
});

Cypress.Commands.add("clickLoginButton", () => {
  cy.get('[data-cy="btn-login"]').click();
});

Cypress.Commands.add("sesionGoogle", () => {
  cy.get('[data-cy="btn-google-login"]').click();
  cy.url().should("include", "accounts.google.com");
});

Cypress.Commands.add("mensajeErrorCredenciales", (mensaje) => {
  cy.get("p")
    .should("be.visible")
    .and("contain", "Correo o contraseña incorrectos");
});

Cypress.Commands.add("mensajeCompletarCampo", (mensaje) => {
  cy.get("div").should("be.visible").and("contain", "Completa este campo");
});

Cypress.Commands.add("mensajeFormatoEmail", (email) => {
  cy.get("div")
    .should("be.visible")
    .and(
      "contain",
      `Incluye un signo "@" en la dirección de correo electrónico. La dirección "${email}" no incluye el signo "@".`
    );
});

Cypress.Commands.add("mensajeEmailNoConfirmado", (mensaje) => {
  cy.get("p")
    .contains("Usuario no confirmado. Te reenviamos el link por correo.")
    .should("be.visible");
});

Cypress.Commands.add("linkForgotPassword", () => {
  cy.get('[data-cy="btn-forgot-password"]').click();
});

Cypress.Commands.add("urlForgotPassword", () => {
  cy.url().should("include", "/auth/forgotPassword");
});

Cypress.Commands.add("linkRegisterUser", () => {
  cy.get('[data-cy="btn-register-user"]').click();
});

Cypress.Commands.add("urlRegisterUser", () => {
  cy.url().should("include", "/auth/registerUser");
  cy.get("h1").should("have.text", "Registrar Cuenta");
});

Cypress.Commands.add("linkRegisterClient", () => {
  cy.get('[data-cy="btn-register-client"]').click();
});

Cypress.Commands.add("urlRegisterClient", () => {
  cy.url().should("include", "/auth/registerClient");
  cy.get("h1").should("have.text", "Registrar Cliente");
});

Cypress.Commands.add("logout", () => {
  cy.get("button").contains("Logout").click();
});
