import { dataObjectToXlsx } from '../support/custom/generate-xlsx';
import { Industries } from '../../src/constants/industries';
import { Sizes } from '../../src/constants/sizes';

describe('User submission', () => {
  it('user input and submit', () => {
    cy.visit('http://127.0.0.1:5173/create');
    // cy.visit('https://mpc.sail.codes/create');
    
    // // Click the session create button
    const create = '[id="creare-submission"]';
    cy.get(create).click();
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzcyZWQ5LTg3ZDAtNDUzYS05NGU4LTY1MGI2NTFiNDIwYyIsInByb2plY3RJZCI6IjA2NDcwMDU3LTExYTMtNGI5NS1iNGI1LWZmNDcxMTFmODBmMiIsInJvbGUiOjEsImlhdCI6MTY4MDY0MDQyMSwiaXNzIjoiaHR0cHM6Ly9zYWlsLmJ1LmVkdSJ9.BHjdsvGFKKqmDF2gw7i_6gZtwaZmFmI6Vu0YLgypyPuDCEWQV2p5U8pNiYqWf1I7AgdWe3bbZNnr9lfnNR2rcIPpTVfyvSCame0ks6MI0XoPVa4dLOQos66HUWwPZn1CeayoX68Vxdn5B-BTN3aMcgapyVk-MCuHbCIxL9jsrKKydFpbyaMxsGAnGMfYmKnWMQFf3FmG0vD2cvrpX5O9lTlfcvbDRYWSQGWDVwWaVBnU-2qpgWUxs44dTwbHXJNS7c9eNqpJs2EYwwi1PGFNyAe8XhAtgzPp2LL5ghAVipZ_ShLKo4qkwqt7lwSxaaGYkuqsPAbGyWY3-47FnWyNrg'
    window.localStorage.setItem('token', token)

    const downloadKey = '[id="downloadKey"]';
    cy.get(downloadKey).click();

    const consent = '[type="checkbox"]';
    cy.get(consent).click();

    const manage = '[id="manage-session"]';
    cy.get(manage).click();
    
    // // Submitter's input (ID, PW, industry and compny-size)
    // const selector_ID = '[data-cy="submissionID"]';
    // const ID = 'bffaa2ed-6bbd-448d-8853-78f6bcde23db';
    // cy.get(selector_ID).type(ID);

    // const selector_code = '[data-cy="sessionCode"]';
    // const code = '2dd6df1c-f8f7-41b2-9c16-68f7227cc6b9';
    // cy.get(selector_code).type(code);

    // const selector_industry = '[data-cy="industry"]';
    // let idx = Math.floor(Math.random() * Industries.length);
    // const selected_industry = Industries[idx].label;
    // cy.get(selector_industry).type(selected_industry);
    // cy.contains(selected_industry).click();

    // const selector_size = '[data-cy="size"]';
    // idx = Math.floor(Math.random() * Sizes.length);
    // const selected_size = Sizes[idx].label;
    // cy.get(selector_size).type(selected_size);
    // cy.contains(selected_size).click();

    // WIP: drag and drop a randomly generated xlsx workbook
    const filename = 'testData.xlsx';
    const xlsxData = dataObjectToXlsx(filename);
    // const selector = '[data-cy="dropzone"]';
    const selector = 'input[type=file]'

    cy.get(selector).selectFile("cypress/downloads/"+filename, {
      action: 'drag-drop',
      force: true
    })
    // Check the radio box
    const verify_data = '[data-cy="data-verify"]';
    cy.get(verify_data).click();

    // // Click the submit button
    // const submit = '[data-cy="submit"]';
    // cy.get(submit).click();

    // // Check if submission was successful
    // const alert_msg = '[data-cy="alert"]';
    // cy.get(alert_msg).contains('Your submission was successful');
  });
});
