import { UserInput } from '../support/custom/user-input';
import { setResultObject, dataToXlsx } from '../support/custom/generate-xlsx';
import path from 'path';

describe('User submission', () => {
  // const prefix = 'https://mpc.sail.codes';
  const prefix = 'http://127.0.0.1:5173';
  let _numTest = 100;

  let numTest = _numTest > 10 ? _numTest % 10 : _numTest;
  let loop = _numTest > 10 ? _numTest / 10 : 1;

  it('user input and submit', () => {
    cy.visit(prefix + '/create');

    // Click the session create button
    const create = '[id="creare-submission"]';
    cy.get(create).click();
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzcyZWQ5LTg3ZDAtNDUzYS05NGU4LTY1MGI2NTFiNDIwYyIsInByb2plY3RJZCI6IjA2NDcwMDU3LTExYTMtNGI5NS1iNGI1LWZmNDcxMTFmODBmMiIsInJvbGUiOjEsImlhdCI6MTY4MDY0MDQyMSwiaXNzIjoiaHR0cHM6Ly9zYWlsLmJ1LmVkdSIsImV4cCI6MzM4MDY0MDQyMX0.JNIEwLs5sMOz7iUCREaT_fkrqf7WQRiA99TDs-WJ1WGcYwvkKQ7iNBvmNHbT2NqQLt2CakruF8lTL7iDwnuTmMzDPFhEoL3BYkK1MF6mQqjvMmAu7lfnNRdutWYHYvdy9rp5rUnKQds55oFAsR_4LJxmOZD_yZLRVvwHDvP2M3M_JU7W-vh-bLe7nYZ60fv7YuZOnyrbuy910QK6W0Rc1BliSMl1XooqQYivWBqBqIDegcEGVT7eIreW0qKQ-G1DHfjZcvt1TM1b1wf8oyIbXmZZ7VD5K3ZCVhZSgZph_TLysWyJ80dhr2_iDenp1H38JFKv4wDrGMvmKDhQ71UMHg';
    window.localStorage.setItem('token', token);

    const downloadKey = '[id="downloadKey"]';
    cy.get(downloadKey).click();

    const consent = '[type="checkbox"]';
    cy.get(consent).click();

    const manage = '[id="manage-session"]';
    cy.get(manage).click(); // This takes us to /manage page
    let result = setResultObject();
    UserInput(result, numTest);
    numTest--;
    // Loop needs to be this way because more than 10 xlsx files may not be generated
    while (loop > 0) {
      while (numTest > 0) {
        cy.visit(prefix + '/manage', { timeout: 40000 });
        UserInput(result, numTest);
        numTest--;
      }
      loop--;
      numTest = 10;
    }

    console.log('result', result);
    const filename = 'aggregatedData.xlsx';
    dataToXlsx(result, filename);

    // Decrypt the result
    cy.visit(prefix + '/manage', { timeout: 40000 });
    const stop = '[id="stop"]';
    cy.get(stop).click();
    const reveal = '[id="reveal"]';
    cy.get(reveal).click({ timeout: 40000 }); // This takes us to /decrypt page

    // Drop public key into the dnd box
    cy.window().then((win) => {
      const sessionId = win.localStorage.getItem('sessionId');
      const selector = 'input[type=file]';
      const privateKeyFile = 'privateKey-' + sessionId + '.pem';
      const downloadsDir = 'cypress/downloads/';
      cy.get(selector).selectFile(path.join(downloadsDir, privateKeyFile), {
        action: 'drag-drop',
        force: true,
        timeout: 40000
      });
    });
  });
});
