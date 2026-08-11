describe('Submission Details Page', () => {

    const testDataValid = {
        studentName: 'John Doe',
        filename: 'sum_two_numbers.py',
    };

    beforeEach(() => {
        cy.login()
        cy.add_submission(testDataValid.studentName, testDataValid.filename)
    });

    it('should display the submission details when clicking in details of a submission', () => {
        cy.get('[data-testid="submission-row"]')
            .first()
            .find('[data-testid="details-button"]')
            .click();

        cy.url().should('include', '/submissions/');
        cy.get('h1').should('contain', 'Submission Details');
        cy.get('[data-testid="detail-file-name"]').should('contain', testDataValid.filename);
    });


});