import BigNumber from 'bignumber.js';
import { Point } from '@utils/data-format';
import { shamirReconstruct } from '../utils/shamirs';

describe('shamirReconstruct', () => {
  it('should reconstruct the secret correctly', () => {
    const shares: Point[] = [
      ['1', '13827399'],
      ['2', '10784347'],
      ['3', '1672473'],
      ['4', '11302464'],
      ['5', '1073618'],
      ['6', '8346647'],
      ['7', '7070874'],
      ['8', '699435'],
      ['9', '6703412'],
      ['10', '10114232']
    ];

    const expectedSecret = new BigNumber(8888);
    const prime = new BigNumber(15485867);
    const reconstructedSecret = shamirReconstruct(
      shares.map(([x, y]) => [new BigNumber(x), new BigNumber(y)]),
      prime,
      new BigNumber(0)
    );

    expect(reconstructedSecret).toEqual(expectedSecret);
  });

  it('should reconstruct the secret correctly', () => {
    const shares: Point[] = [
      ['1', '618311'],
      ['2', '12729322'],
      ['3', '2467414'],
      ['4', '5825123'],
      ['5', '4766504'],
      ['6', '4656466'],
      ['7', '3289038'],
      ['8', '6373236'],
      ['9', '12047196'],
      ['10', '10878174']
    ];

    const expectedSecret = new BigNumber(300);
    const prime = new BigNumber(15485867);
    const reconstructedSecret = shamirReconstruct(
      shares.map(([x, y]) => [new BigNumber(x), new BigNumber(y)]),
      prime,
      new BigNumber(0)
    );

    expect(reconstructedSecret).toEqual(expectedSecret);
  });
});
