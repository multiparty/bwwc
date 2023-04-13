import { dataGenerator } from './generate-input';
import { startSession } from './session-create';

describe('deepEqual', () => {
  it('create and encrypt user input', () => {
    console.log(dataGenerator());
    console.log(startSession());

    // expect(deepEqual(obj1, obj2)).toBeTruthy();
  });
});
