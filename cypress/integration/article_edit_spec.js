const CYPRESS_TEST_EMAIL = "alanna.scott+cypress_test@gmail.com";
const CYPRESS_TEST_PASSWORD = "cypress";

const articleTypes = ['case'];
//todo: add method and organization once they are working ['case', 'method', 'organization'];

//cy.clearLocalStorage() and cy.clearCookies()

articleTypes.forEach(type => editFormTest(type));

function editFormTest(type) {
  describe(`${type} edit form`, () => {
    it(`visits /${type}/{id}/edit`, () => {
      cy.login();
      cy.visit(`/${type}/2/edit`);

      // it has a submit button
      cy.get("[data-cy=submit]").should("be.visible");

      //it has a floating publish button
      cy.get("[data-cy=floating-action-button]").should("be.visible");

      // it has a link to full version
      cy.get("[data-cy=full-version-link]").should("be.visible");
      cy.get("[data-cy=full-version-link]").click();
      cy.url().should('include', '?full=1')

      // it does not have a link to full version if it's currently full version
      cy.get("[data-cy=full-version-link]").should("not.be.visible");

      // it submits the form without errors
      cy.get("[data-cy=submit]").click();
      // todo: verify that form was submittied successfully
    });
  });
}
