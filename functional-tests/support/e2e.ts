export {};
import './commands';
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in
       * @example cy.login('myUser', 'myPassword')
       */
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}