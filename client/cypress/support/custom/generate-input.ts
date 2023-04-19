import * as XLSX from 'xlsx';

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
  const res = dataTypes.map((value) => {
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
  console.log(res)
  return res
}

const tabMapping: { [key in keyof DataObject]: string } = {
  numberOfEmployees: '1.Number of Employees',
  wages: '2.Compensation',
  performance: '3.Performance Pay',
  lengthOfService: '4.Tenure',
};

export function dataObjectToXlsx(dataObjects: DataObject[], filename: string): void {
  const wb = XLSX.utils.book_new();

  dataObjects.forEach((dataObject) => {
    Object.keys(dataObject).forEach((dataType) => {
      const wsData = [['Position', 'Ethnicity', 'Gender', tabMapping[dataType as keyof DataObject]]];
      const positionMap = dataObject[dataType as keyof DataObject];

      if (positionMap) {
        Object.keys(positionMap).forEach((position) => {
          const ethnicityMap = positionMap[position];

          Object.keys(ethnicityMap).forEach((ethnicity) => {
            const genderMap = ethnicityMap[ethnicity];

            Object.keys(genderMap).forEach((gender) => {
              const value = genderMap[gender];
              wsData.push([position, ethnicity, gender, value.toString()]);
            });
          });
        });
      }

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const tabName = tabMapping[dataType as keyof DataObject];
      XLSX.utils.book_append_sheet(wb, ws, tabName);
    });
  });

  XLSX.writeFile(wb, filename);
}
