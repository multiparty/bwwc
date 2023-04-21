/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('uploadFile', (selector, fileName) => {
  cy.get(selector).then((subject) => {
    cy.readFile(`cypress/fixtures/${fileName}`, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((blob) => {
        const el = subject[0] as HTMLInputElement;
        const testFile = new File([blob], fileName, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        cy.wrap(subject).trigger('change', { force: true });
      });
  });
});


// Custom comand to handle uploading a file using react-dropzone
// Should probably be placed somewhere in /support/

Cypress.Commands.add(
  'upload',
  {
      prevSubject: 'element',
  },
  (subject, file, filename:string) => {
      // we need access window to create a file below
      cy.window().then(window => {
          // line below could maybe be refactored to make use of Cypress.Blob.base64StringToBlob, instead of this custom function.
          // inspired by @andygock, please refer to https://github.com/cypress-io/cypress/issues/170#issuecomment-389837191
          const blob = b64toBlob(file, '', 512)
          // Please note that we need to create a file using window.File,
          // cypress overwrites File and this is not compatible with our change handlers in React Code
          const testFile = new window.File([blob], filename)
          cy.wrap(subject).trigger('drop', {
              dataTransfer: { files: [testFile] },
          })
      })
  }
)

// Code stolen from @nrutman here: https://github.com/cypress-io/cypress/issues/170
function b64toBlob(b64Data:any, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}