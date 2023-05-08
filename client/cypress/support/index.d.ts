/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to ... add your description here
     * @example cy.uploadFIle()
     */
    getClipboardText(): Chainable<string>;
    readFileAsText(file: File): Chainable<string>;
  }
}
