describe('Edición de perfil', () => {
beforeEach(() => {
cy.login();
cy.visit('/perfil/edicion');
});


it('ED-001: Editar nombre correctamente', () => {
cy.get('#nombre').clear().type('Juan Carlos');
cy.get('button[type="submit"]').click();
cy.contains('Perfil actualizado').should('be.visible');
});
});