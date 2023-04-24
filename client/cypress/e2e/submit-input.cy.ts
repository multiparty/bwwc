import { dataObjectToXlsx } from '../support/custom/generate-input';
import { Industries } from '../../src/constants/industries';
import { Sizes } from '../../src/constants/sizes';

describe('User submission', () => {

  it('user input and submit', () => {
    cy.visit('http://127.0.0.1:5173/');
    const selector_ID = '[data-cy="submissionID"]';
    const ID = 'xxxx';
    cy.get(selector_ID).type(ID);

    const selector_code = '[data-cy="sessionCode"]';
    const code = 'xxxx';
    cy.get(selector_code).type(code);

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
  //   const filename = 'testData.xlsx';
  //   const xlsxData = dataObjectToXlsx(filename);

  //   const selector = '[data-cy="dropzone"]';
  //   cy.fixture(filename, 'base64').then((content) => {
  //     cy.get(selector).upload(content, filename);
  //   });
  //   // cy.uploadFile(selector, filename);
  //   cy.get(selector, { timeout: 10000 })
  //     .attachFile({
  //       fileContent: new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  //       fileName: filename,
  //       mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       encoding: 'utf8',
  //       lastModified: new Date().getTime()
  //     })
  //     .trigger('change');

    const verify_data = '[data-cy="data-verify"]';
    cy.get(verify_data).click();

    const submit = '[data-cy="submit"]';
    cy.get(submit).click();

    // Check if successful
  })
});