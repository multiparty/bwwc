import { UserInput } from '../support/custom/user-input';

describe('User submission', () => {
  const prefix = 'https://mpc.sail.codes'

  it('user input and submit', () => {
    cy.visit(prefix + '/create');

    // // Click the session create button
    const create = '[id="creare-submission"]';
    cy.get(create).click();
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzcyZWQ5LTg3ZDAtNDUzYS05NGU4LTY1MGI2NTFiNDIwYyIsInByb2plY3RJZCI6IjA2NDcwMDU3LTExYTMtNGI5NS1iNGI1LWZmNDcxMTFmODBmMiIsInJvbGUiOjEsImlhdCI6MTY4MDY0MDQyMSwiaXNzIjoiaHR0cHM6Ly9zYWlsLmJ1LmVkdSJ9.BHjdsvGFKKqmDF2gw7i_6gZtwaZmFmI6Vu0YLgypyPuDCEWQV2p5U8pNiYqWf1I7AgdWe3bbZNnr9lfnNR2rcIPpTVfyvSCame0ks6MI0XoPVa4dLOQos66HUWwPZn1CeayoX68Vxdn5B-BTN3aMcgapyVk-MCuHbCIxL9jsrKKydFpbyaMxsGAnGMfYmKnWMQFf3FmG0vD2cvrpX5O9lTlfcvbDRYWSQGWDVwWaVBnU-2qpgWUxs44dTwbHXJNS7c9eNqpJs2EYwwi1PGFNyAe8XhAtgzPp2LL5ghAVipZ_ShLKo4qkwqt7lwSxaaGYkuqsPAbGyWY3-47FnWyNrg';
    window.localStorage.setItem('token', token);

    const downloadKey = '[id="downloadKey"]';
    cy.get(downloadKey).click();

    const consent = '[type="checkbox"]';
    cy.get(consent).click();

    const manage = '[id="manage-session"]';
    cy.get(manage).click(); // This takes us to /manage page

    UserInput();
    // WIP: Next submission
    cy.visit(prefix + '/manage');
  });
});
