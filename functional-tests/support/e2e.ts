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

      /**
       * Custom command to add a student submission
       * @example cy.add_submission('john_doe', 'solution.py')
       */
      add_submission(studentName?: string, filename?: string): Chainable<void>;
    }
  }
}