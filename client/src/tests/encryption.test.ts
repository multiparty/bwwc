import { deepEqual } from '../utils/shamirs';

describe('deepEqual', () => {
  it('should return true for deeply equal objects', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22,
      },
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22,
      },
    };

    expect(deepEqual(obj1, obj2)).toBeTruthy();
  });

  it('should return false for objects with different keys', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22,
      },
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key23: 22,
      },
    };

    expect(deepEqual(obj1, obj2)).toBeFalsy();
  });

  it('should return false for objects with different values', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22,
      },
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 23,
      },
    };

    expect(deepEqual(obj1, obj2)).toBeFalsy();
  });

  it('should return false for objects with different nested structures', () => {
    const obj1 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: 22,
      },
    };

    const obj2 = {
      key1: 'value1',
      key2: {
        key21: ['a', 'b', 'c'],
        key22: {
          key221: 22,
        },
      },
    };

    expect(deepEqual(obj1, obj2)).toBeFalsy();
  });
});
