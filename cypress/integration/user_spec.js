describe("user controller", () => {
  it(`visits user page and user edit page `, () => {
    cy.visit(`/user/1`);

    // click edit button
    cy.get("[data-cy=edit-profile]").click();

    // it has a submit button
    cy.get("[data-cy=submit]").should("be.visible");

    // it edits the name field
    const newName = "Jane Smith";
    cy.get('input[name="name"]').clear().type(newName);

    /*
    TODO: test submit and save works

    // it submits the form
    cy.get("[data-cy=submit]").click();
    cy.url().should("include", "/user/1/edit");

    // the name field is updated with new name
    cy.get('input[name="name"]').should("have.value", newName);

    */
  });
});
