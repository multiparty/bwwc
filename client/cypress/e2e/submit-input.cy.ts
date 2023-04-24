import { dataObjectToXlsx } from '../support/custom/generate-input';

describe('data generation', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/');
  });

  it('create and encrypt user input', () => {
    const filename = 'testData.xlsx';
    const xlsxData = dataObjectToXlsx(filename);

    const selector = '[data-cy="dropzone"]';
    cy.fixture(filename, 'base64').then((content) => {
      cy.get(selector).upload(content, filename);
    });
    // cy.uploadFile(selector, filename);
    cy.get(selector, { timeout: 10000 })
      .attachFile({
        fileContent: new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        fileName: filename,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        encoding: 'utf8',
        lastModified: new Date().getTime()
      })
      .trigger('change');

    // input id, code, industry, size
    // click box
    // click submit
  });
});
