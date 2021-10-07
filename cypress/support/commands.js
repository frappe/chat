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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('hide_modal_messages', () => {
  cy.wait(500);
  cy.get('button.close').click();
});

Cypress.Commands.add('send_message', (message, room) => {
  cy.window()
    .its('frappe')
    .then((frappe) => {
      frappe.call({
        method: 'chat.api.message.send',
        args: {
          content: message,
          user: 'Administrator',
          room: room,
          email: 'Administrator',
        },
      });
    });
});
