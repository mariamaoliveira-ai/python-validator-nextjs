Cypress.Commands.add('login', (username = 'demo', password = 'demo123') => {
  cy.visit('/login'); // or your login path
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('button[type="submit"]').click();
  // Ensure login completes before moving on
  cy.url().should('not.include', '/login');
});


Cypress.Commands.add('add_submission', (studentName = 'test', filename: 'sum_two_numbers.py') => {
  cy.get('#student-input').type(studentName);
  cy.get('#file-upload').selectFile(`cypress/fixtures/${filename}`, { force: true });
  cy.get('[name="submit"]').click();
});