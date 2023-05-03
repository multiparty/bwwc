import { dataObjectToXlsx } from '../custom/generate-xlsx';
import { Industries } from '../../../src/constants/industries';
import { Sizes } from '../../../src/constants/sizes';

export function UserInput() {
  const generateID = '[id="generateID"]';
  cy.get(generateID).click();

  cy.window().then((win) => {
    // Override the clipboard API with a custom implementation
    cy.stub(win.navigator.clipboard, 'writeText').callsFake((text) => {
      win.navigator.clipboard.__data = text;
      return Promise.resolve();
    });
    cy.stub(win.navigator.clipboard, 'readText').callsFake(() => {
      return Promise.resolve(win.navigator.clipboard.__data);
    });
  });

  const copyLink = '[id="copyLink"]';
  cy.get(copyLink).should('be.visible').should('be.enabled').click();

  // Use the custom clipboard API implementation for your test
  cy.window().then((win) => {
    // Read text from the custom clipboard API
    win.navigator.clipboard.readText().then((clipboardText) => {
      cy.visit(clipboardText);
    });
  });

  // Submitter's input (ID, PW, industry and compny-size)
  const selector_industry = '[data-cy="industry"]';
  let idx = Math.floor(Math.random() * Industries.length);
  const selected_industry = Industries[idx].label;
  cy.get(selector_industry).type(selected_industry);
  cy.contains(selected_industry).click();

  const selector_size = '[data-cy="size"]';
  idx = Math.floor(Math.random() * Sizes.length);
  const selected_size = Sizes[idx].label;
  cy.get(selector_size).type(selected_size);
  cy.contains(selected_size).click();

  // Drag and drop a randomly generated xlsx workbook
  const filename = 'testData.xlsx';
  dataObjectToXlsx(filename);
  const selector = 'input[type=file]';
  cy.get(selector).selectFile('cypress/downloads/' + filename, {
    action: 'drag-drop',
    force: true
  });

  // Check the radio box
  const verify_data = '[data-cy="data-verify"]';
  cy.get(verify_data).click();

  // // Click the submit button
  const submit = '[data-cy="submit"]';
  cy.get(submit).click();

  // Check if submission was successful
  const alert_msg = '[data-cy="alert"]';
  cy.get(alert_msg).contains('Your submission was successful');
}