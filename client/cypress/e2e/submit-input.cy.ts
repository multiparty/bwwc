import { dataGenerator, dataObjectToXlsx } from '../support/custom/generate-input';
import 'cypress-file-upload';

describe('data generation', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/');
  });

  it('create and encrypt user input', () => {
    const dataObj = dataGenerator();
    const fileName = 'testData.xlsx';
    const xlsxData = dataObjectToXlsx(dataObj, fileName);
    cy.get('[data-cy="dropzone"]', { timeout: 10000 })
      .attachFile({
        fileContent: new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        fileName: fileName,
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
