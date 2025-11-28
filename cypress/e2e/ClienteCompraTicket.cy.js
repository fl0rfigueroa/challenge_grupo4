describe("Flujo Completo de Compra", () => {
  let datosEventos;
  let datosUsuarios;

  before(() => {
    cy.fixture("eventos").then((data) => {
      datosEventos = data;
    });
    cy.fixture("usuarios").then((data) => {
      datosUsuarios = data;
    });
  });

  
  context(" Vista Pública (Home)", () => {
    
    beforeEach(() => {
      cy.viewport(1280, 720);
      cy.visit("https://ticketazo.com.ar");
    });

    it("Visualización: Las tarjetas muestran título, ubicación y hora", () => {
      const evento = datosEventos.eventos[0];
      cy.comandoEventos(evento.titulo).within(() => {
          cy.contains(evento.ubicacion).should("be.visible");
          cy.contains(evento.hora).should("be.visible");
          cy.contains("button", "Ver evento").should("be.visible");
      });
    });

    it("Imágenes: Se cargan correctamente", () => {
      datosEventos.eventos.forEach((evento) => {
        cy.comandoEventos(evento.titulo)
          .scrollIntoView()
          .find("img")
          .should("be.visible")
          .and("have.attr", "src").should("not.be.empty");
      });
    });
  });

  
  context("Flujo de Compra (Usuario Logueado)", () => {
    
    beforeEach(() => {
      cy.visit("https://ticketazo.com.ar/auth/login");
      cy.get('input[type="email"]').type(datosUsuarios.comprador.email);
      cy.get('input[type="password"]').type(datosUsuarios.comprador.password);
      cy.get('[data-cy="btn-login"]').click();
      
      cy.url({ timeout: 15000 }).should("not.include", "/auth/login");
      cy.visit("https://ticketazo.com.ar/compra/Evento%20Multiple%20Free?horario=36");
      
      cy.contains("Mapa de Sectores", { timeout: 20000 }).should("be.visible");
    });

    it("Seleccionar Sector 'Campo' y agregar 1 entrada", () => {
      cy.contains("Campo").should("be.visible");
      cy.contains("Campo").click({ force: true });

      cy.contains("Selecciona la cantidad de entradas").should("be.visible");
      cy.contains("span", "0").should("be.visible");
      
      cy.contains("span", "0").next("button").click({ force: true });
      
      cy.contains("button", "Comprar 1 Entradas").should("be.visible");

      cy.contains("button", "Comprar 1 Entradas").should("not.be.disabled").click();

    });
  });

});