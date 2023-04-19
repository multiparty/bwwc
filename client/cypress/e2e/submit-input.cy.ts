import { dataGenerator,dataObjectToXlsx } from '../support/custom/generate-input';
import 'cypress-file-upload';
import { startSession } from '../support/custom/session-create';
import crypto from 'crypto';

describe('data generation', () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5173/");
  });

it('create and encrypt user input', () => {

  const dataObj = dataGenerator()
  const fileName = 'testData.csv';
  const xlsxData = dataObjectToXlsx(dataObj, fileName);

  cy.get('[data-cy="dropzone"]', { timeout: 10000 })
  .attachFile({ fileContent: xlsxData, fileName: fileName, mimeType: 'text/csv', encoding: 'utf8', lastModified: new Date().getTime() }).trigger('change');

  // input id, code, industry, size
  // drop the csv
  // click box
  // click submit
  // encrypt
  });
});

// path
// : 
// "bwwc.xlsx"
// lastModified
// : 
// 1681485378739
// lastModifiedDate
// : 
// Fri Apr 14 2023 11:16:18 GMT-0400 (Eastern Daylight Time) {}
// name
// : 
// "bwwc.xlsx"
// size
// : 
// 308906
// type
// : 
// "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// webkitRelativePath
// : 
// ""

// Data Type,Position,Ethnicity,Gender,Value
// "numberOfEmployees","Executive","hispanic","M",5369
// "numberOfEmployees","Executive","hispanic","F",1894
// "numberOfEmployees","Executive","hispanic","NB",6440
// "numberOfEmployees","Executive","white","M",6264
// "numberOfEmployees","Executive","white","F",8862
// "numberOfEmployees","Executive","white","NB",3377
// "numberOfEmployees","Executive","black","M",5768
// "numberOfEmployees","Executive","black","F",2715
// "numberOfEmployees","Executive","black","NB",6607
// "numberOfEmployees","Executive","hawaiian","M",5372
// "numberOfEmployees","Executive","hawaiian","F",6009
// "numberOfEmployees","Executive","hawaiian","NB",8532
// "numberOfEmployees","Executive","asian","M",2576
// "numberOfEmployees","Executive","asian","F",3442
// "numberOfEmployees","Executive","asian","NB",149
// "numberOfEmployees","Executive","nativeAmerican","M",7819
// "numberOfEmployees","Executive","nativeAmerican","F",3472
// "numberOfEmployees","Executive","nativeAmerican","NB",4832
// "numberOfEmployees","Executive","twoOrMore","M",8861
// "numberOfEmployees","Executive","twoOrMore","F",8161
// "numberOfEmployees","Executive","twoOrMore","NB",9296
// "numberOfEmployees","Executive","unreported","M",1637
// "numberOfEmployees","Executive","unreported","F",2741
// "numberOfEmployees","Executive","unreported","NB",3753
// "numberOfEmployees","Manager","hispanic","M",7164
// "numberOfEmployees","Manager","hispanic","F",1212
// "numberOfEmployees","Manager","hispanic","NB",1174
// "numberOfEmployees","Manager","white","M",4896
// "numberOfEmployees","Manager","white","F",6750