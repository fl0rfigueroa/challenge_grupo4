// cypress/support/commands.js

Cypress.Commands.add('comandoEventos', (titulo) => {
  // Busca el texto del título y sube hasta encontrar la tarjeta contenedora
  return cy.contains(titulo).closest('[data-cy^="evento-card"]');
});