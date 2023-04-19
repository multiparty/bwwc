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

export interface DataObject {
  numberOfEmployees?: PositionMap;
  wages?: PositionMap;
  performance?: PositionMap;
  lengthOfService?: PositionMap;
  [key: string]: PositionMap | undefined;
}

const dataTypes = ['numberOfEmployees', 'wages', 'performance', 'lengthOfService'];

function genRandomInt(max:number){
  return Math.floor(Math.random() * max);
}


export function dataGenerator() {
  return dataTypes.map((value) => {
    const obj: DataObject = {};

    const pos: PositionMap = Object.keys(Positions).reduce((acc, p) => {
      const position = Positions[p as keyof typeof Positions];

      const ethnicity: EthnicityMap = Object.keys(Ethnicity).reduce((acc, e) => {
        const ethn = Ethnicity[e as keyof typeof Ethnicity];

        const gender: GenderMap = Object.keys(Gender).reduce((acc, g) => {
          const gen = Gender[g as keyof typeof Gender];
          acc[gen] =genRandomInt(10000);
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

export function dataObjectToCSV(dataObj: DataObject[]): string {
  const header = ['Data Type', 'Position', 'Ethnicity', 'Gender', 'Value'];
  const rows: string[] = [header.join(',')];

  dataObj.forEach((data, dataIndex) => {
    const dataType = dataTypes[dataIndex];
    Object.entries(data[dataType as keyof DataObject]!).forEach(([position, ethnicities]: [string, EthnicityMap]) => {
      Object.entries(ethnicities).forEach(([ethnicity, genders]: [string, GenderMap]) => {
        Object.entries(genders).forEach(([gender, value]: [string, number]) => {
          rows.push([`"${dataType}"`, `"${position}"`, `"${ethnicity}"`, `"${gender}"`, value.toString()].join(','));
        });
      });
    });
  });

  return rows.join('\n');
}
