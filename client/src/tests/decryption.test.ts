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

  it('should reconstruct the secret correctly', () => {
    // const shares: Point[] = [
    //   ['1', '146413973669424'],
    //   ['10', '110084453254179'],
    //   ['2', '123567532674971'],
    //   ['3', '14545563728033'],
    //   ['4', '66634963467545'],
    //   ['5', '59725817098308'],
    //   ['6', '123019753823954'],
    //   ['7', '145344897293169'],
    //   ['8', '86181473362754'],
    //   ['9', '123185593034346']
    // ];
    const shares: Point[] = [
      ['1', '41178289209322'],
      ['10', '16744455821960'],
      ['2', '115933734640636'],
      ['3', '11352868788503'],
      ['4', '38499799412527'],
      ['5', '133727917490095'],
      ['6', '168211073485507'],
      ['7', '62372363408999'],
      ['8', '16321875561365'],
      ['9', '36715373645848']
    ];

    const expectedSecret = new BigNumber(200);
    const prime = new BigNumber(15485867);
    const reconstructedSecret = shamirReconstruct(
      shares.map(([x, y]) => [new BigNumber(x), new BigNumber(y)]),
      prime,
      new BigNumber(0)
    );

    // expect(reconstructedSecret).toEqual(expectedSecret);
  });
});
