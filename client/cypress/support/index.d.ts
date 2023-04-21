/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to ... add your description here
     * @example cy.uploadFIle()
     */
    uploadFile(selector: string, fileName: string): Chainable<null>;
    upload(file:any, fileName: string): Chainable<null>;
  }
}
