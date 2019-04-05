// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const auth0 = require("auth0-js");

Cypress.Commands.add("login", ({
  username: "alanna.scott+cypress_test@gmail.com",
  password: "cypress",
}) => {

  Cypress.log({
    name: "loginViaAuth0"
  });

  const webAuth = new auth0.WebAuth({
    // Get this from https://manage.auth0.com/#/applications and your application
    domain: "participedia.auth0.com",
    // Get this from https://manage.auth0.com/#/applications and your application
    clientID: "lORPmEONgX2K71SX7fk35X5PNZOCaSfU",
    responseType: "token id_token"
  });

  webAuth.client.login(
    {
      realm: "Username-Password-Authentication",
      username,
      password,
      // Get this from https://manage.auth0.com/#/apis and your api, use the identifier property
      audience: "https://participedia.auth0.com/api/v2/",
      scope: "openid email profile"
    },
    function(err, authResult) {
      // Auth tokens in the result or an error
      if (authResult && authResult.accessToken && authResult.idToken) {
        const token = {
          accessToken: authResult.accessToken,
          idToken: authResult.idToken,
          // Set the time that the access token will expire at
          expiresAt: authResult.expiresIn * 1000 + new Date().getTime()
        };

        window.sessionStorage.setItem(
          "my-super-duper-app:storage_token",
          JSON.stringify(token)
        );
      } else {
        console.error("Problem logging into Auth0", err);
        throw err;
      }
    }
  );
});

Cypress.Commands.add("loginAsAdmin", (overrides = {}) => {
  // todo: create test admin account
  // cy.login({
  //   email: "",
  //   password: "",
  // });
});
