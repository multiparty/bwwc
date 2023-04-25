import { Ethnicity } from '../../../src/utils/ethnicity';
import { Positions } from '../../../src/utils/positions';
import { Gender } from '../../../src/utils/gender';

interface GenderMap {
  [key: string]: number;
}

interface EthnicityMap {
  [key: string]: GenderMap;
}

interface PositionMap {
  [key: string]: EthnicityMap;
}

interface DataObject {
  numberOfEmployees?: PositionMap;
  wages?: PositionMap;
  performance?: PositionMap;
  lengthOfService?: PositionMap;
  [key: string]: PositionMap | undefined;
}

const dataTypes = ['numberOfEmployees', 'wages', 'performance', 'lengthOfService'];

export function dataGenerator() {
  return dataTypes.map((value) => {
    const obj: DataObject = {};

    const pos: PositionMap = Object.keys(Positions).reduce((acc, p) => {
      const position = Positions[p as keyof typeof Positions];

      const ethnicity: EthnicityMap = Object.keys(Ethnicity).reduce((acc, e) => {
        const ethn = Ethnicity[e as keyof typeof Ethnicity];

        const gender: GenderMap = Object.keys(Gender).reduce((acc, g) => {
          const gen = Gender[g as keyof typeof Gender];
          acc[gen] = Math.random();
          return acc;
        }, {} as GenderMap);

        acc[ethn] = gender;
        return acc;
      }, {} as EthnicityMap);

      acc[position] = ethnicity;
      return acc;
    }, {} as PositionMap);

    obj[value as keyof DataObject] = pos;
    return obj;
  });
}
