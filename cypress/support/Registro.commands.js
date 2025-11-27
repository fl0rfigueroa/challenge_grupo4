// Comando para llenar el formulario
Cypress.Commands.add('llenarFormularioRegistro', (user) => {
    // Llenamos campos solo si el dato existe en el objeto user
    if (user.nombre) cy.get('[data-cy="input-nombres"]').type(user.nombre).blur();
    if (user.apellido) cy.get('[data-cy="input-apellido"]').type(user.apellido).blur();
    if (user.telefono) cy.get('[data-cy="input-telefono"]').type(user.telefono).blur();
    if (user.dni) cy.get('[data-cy="input-dni"]').type(user.dni).blur();

    if (user.provincia) cy.get('[data-cy="select-provincia"]').click().type(`${user.provincia}{enter}`);
    if (user.localidad) cy.get('[data-cy="select-localidad"]').click().type(`${user.localidad}{enter}`);

    if (user.fechaNacimiento) {
        cy.get('[data-type="day"]').type(user.fechaNacimiento.split('/')[0]);
        cy.get('[data-type="month"]').type(user.fechaNacimiento.split('/')[1]);
        cy.get('[data-type="year"]').type(user.fechaNacimiento.split('/')[2]);
    }

    if (user.email) cy.get('[data-cy="input-email"]').type(user.email).blur();
    if (user.emailConfirm) cy.get('[data-cy="input-confirmar-email"]').type(user.emailConfirm).blur();

    if (user.password) cy.get('[data-cy="input-password"]').type(user.password);
    if (user.passwordConfirm) cy.get('[data-cy="input-repetir-password"]').type(user.passwordConfirm);
});