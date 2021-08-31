context('Chat', () => {
  let room;
  before(() => {
    cy.visit('/about');
  });

  it('Open chat widget', () => {
    cy.get('#chat-bubble').click();
    cy.get('.chat-welcome').should('be.visible');
  });

  it('Open guest form', () => {
    cy.get('#start-conversation').click();
    cy.get('.chat-form').should('be.visible');
  });

  it('Fill and submit form', () => {
    cy.get('#submit-form').click();
    cy.get('.msgprint').should('contain.text', 'Invalid email address');
    cy.get('.msgprint > hr').should('have.length', 2);
    cy.hide_messages();

    cy.get('#chat-fullname').type('Dohn Joe').should('have.value', 'Dohn Joe');

    cy.get('#chat-email')
      .type('dohnjoe@gmail.com')
      .should('have.value', 'dohnjoe@gmail.com');

    cy.get('#chat-message-area')
      .type('Hellooo ?')
      .should('have.value', 'Hellooo ?');

    cy.intercept({
      method: 'POST',
      url: '/',
      headers: {
        'X-Frappe-CMD': 'chat.api.user.validate_guest',
      },
    }).as('submit');

    cy.get('#submit-form').click();

    cy.wait('@submit').then((interception) => {
      room = interception.response.body.message.room;
      cy.wrap(interception.response.body.message.room).as('room');
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.get('.chat-space').should('be.visible');
  });

  it('Start chatting', () => {
    const typed_message = 'Yes sir';
    cy.get('.chat-space')
      .find('.message-bubble')
      .first()
      .should('contain.text', 'Hellooo ?');

    cy.get('.type-message')
      .type(typed_message)
      .should('have.value', typed_message);
    cy.get('.message-send-button').click();

    cy.get('.chat-space')
      .find('.message-bubble')
      .last()
      .should('contain.text', typed_message);

    cy.send_message('Just testing!', room);
    cy.wait(700);
    cy.get('.chat-space')
      .find('.message-bubble')
      .last()
      .should('contain.text', 'Just testing!');
  });

  it('Attach different files', () => {
    cy.get('[id="chat-file-uploader"]').attachFile('example.json');
    cy.get('.msgprint').should(
      'contain.text',
      'You can only upload JPG, PNG, PDF, or Microsoft documents.'
    );
    cy.hide_messages();

    cy.get('[id="chat-file-uploader"]').attachFile('sample_pdf.pdf');
    cy.wait(500);
    cy.get('.chat-space')
      .find('.message-bubble')
      .last()
      .find('a')
      .should('have.attr', 'href', '/files/sample_pdf.pdf');

    cy.get('[id="chat-file-uploader"]').attachFile('sample_image.jpeg');
    cy.wait(700);
    cy.get('.chat-space')
      .find('.message-bubble')
      .last()
      .find('img')
      .should('have.attr', 'src', '/files/sample_image.jpeg');
  });

  it('Open chat list admin view', () => {
    cy.visit('/login');
    cy.login();
    cy.visit('/app/website');
    cy.get('#chat-bubble').click();
    cy.get('.chat-list').should('be.visible');
  });

  it('Interact with the first chat room', () => {
    cy.get('.chat-list').find('.chat-room').first().click({ force: true });
    cy.wait(500);
    cy.get('.chat-space').should('be.visible');
    cy.get('.chat-back-button').click({ force: true });
    cy.get('.chat-list').should('be.visible');
  });

  it('Search for an user', () => {
    cy.get('.chat-search-box')
      .type('Dohn Joe', { force: true })
      .should('have.value', 'Dohn Joe');

    cy.get('.chat-list')
      .find('.chat-name')
      .first()
      .should('contain.text', 'Dohn Joe');
  });
});
