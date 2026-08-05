describe('Login Authentication Flow', () => {

    const validCredentials = {
        username: 'demo',
        password: 'demo123',
    }

    const invalidCredentials = {
        username: 'invalidUser',
        password: 'invalidPass',
    }

    beforeEach(() => {
        cy.visit('/login');
    });

    it('should login successfully with valid credentials and redirect to dashboard', () => {

        cy.get('[data-testid="username-input"]').type(validCredentials.username);
        cy.get('[data-testid="password-input"]').type(validCredentials.password);

        cy.get('[data-testid="login-button"]').click();

        cy.url().should('include', '/dashboard');
    });

    it('should display an error message with invalid credential', ()=>{
        cy.get('[data-testid="username-input"]').type(invalidCredentials.username);
        cy.get('[data-testid="password-input"]').type(invalidCredentials.password);

        cy.get('[data-testid="login-button"]').click();

        cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain', 'Invalid username or password');

        cy.url().should('include', '/login');
    });

})