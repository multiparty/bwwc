import * as XLSX from 'xlsx';
import { convertToRows, TableData, DataFormat, TableRow } from '../../../src/utils/data-format';
import { Ethnicity } from '../../../src/utils/ethnicity';
import { Positions } from '../../../src/utils/positions';

enum Gender {
  Female = 'F',
  Male = 'M',
  NonBinary = 'NB'
}

interface GenderMap {
  [key: string]: number;
}

interface EthnicityMap {
  [key: string]: GenderMap;
}

interface PositionMap {
  [key: string]: EthnicityMap;
}

type KeyedObject = {
  [key: string]: any;
};

type ObjectArray = Array<{ [key: string]: any }>;

const dataTypes = ['numberOfEmployees', 'wages', 'performance', 'lengthOfService', 'totalEmployees'];

const sheet_name_Mapping: { [key in keyof DataFormat]: string } = {
  numberOfEmployees: '1.Number of Employees',
  wages: '2.Compensation',
  performance: '3.Performance Pay',
  lengthOfService: '4.Tenure',
  totalEmployees: 'Totals Check'
};

function genRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Convert a grid table data into a xlsx format
function gridDataToJSON(rows: TableRow[]) {
  var res: ObjectArray = [];
  Object.values(rows).map((row) => {
    res.push(row);
  });
  return res;
}

export type ExtendedDataFormat = DataFormat & { [key: string]: PositionMap };

export function setResultObject() {
  let counter = { F: 0, M: 0, NB: 0, all: 0 };

  return dataTypes.reduce((acc: ExtendedDataFormat, value: string) => {
    const pos: PositionMap = Object.keys(Positions).reduce((acc, p) => {
      const position = Positions[p as keyof typeof Positions];

      const ethnicity: EthnicityMap = Object.keys(Ethnicity).reduce((acc, e) => {
        const ethn = Ethnicity[e as keyof typeof Ethnicity];
        const gender: GenderMap = Object.keys(Gender).reduce((acc, g) => {
          const gen = Gender[g as keyof typeof Gender];
          const randVal = 0;
          acc[gen] = randVal;
          if (value == 'numberOfEmployees') {
            counter[gen] += randVal;
            counter['all'] += randVal;
          }
          return acc;
        }, {} as GenderMap);

        acc[ethn] = gender;
        return acc;
      }, {} as EthnicityMap);

      acc[position] = ethnicity;
      return acc;
    }, {} as PositionMap);
    if (value == 'totalEmployees') {
      acc['totalEmployees'] = counter;
    } else {
      acc[value] = pos;
    }
    return acc;
  }, {} as ExtendedDataFormat);
}

export function dataGenerator(result: ExtendedDataFormat) {
  let counter = { F: 0, M: 0, NB: 0, all: 0 };

  return dataTypes.reduce((acc: ExtendedDataFormat, value: string) => {
    const pos: PositionMap = Object.keys(Positions).reduce((acc, p) => {
      const position = Positions[p as keyof typeof Positions];

      const ethnicity: EthnicityMap = Object.keys(Ethnicity).reduce((acc, e) => {
        const ethn = Ethnicity[e as keyof typeof Ethnicity];
        const gender: GenderMap = Object.keys(Gender).reduce((acc, g) => {
          const gen = Gender[g as keyof typeof Gender];
          const randVal = genRandomInt(10000);
          acc[gen] = randVal;
          if (value == 'numberOfEmployees') {
            counter[gen] += randVal;
            counter['all'] += randVal;
            result['totalEmployees'][gen] += randVal;
            result['totalEmployees']['all'] += randVal;
          }
          if (value !== 'totalEmployees') {
            result[value][position][ethn][gen] += randVal;
          }
          return acc;
        }, {} as GenderMap);

        acc[ethn] = gender;
        return acc;
      }, {} as EthnicityMap);

      acc[position] = ethnicity;
      return acc;
    }, {} as PositionMap);
    if (value == 'totalEmployees') {
      acc['totalEmployees'] = counter;
    } else {
      acc[value] = pos;
    }
    return acc;
  }, {} as ExtendedDataFormat);
}

export function createInputXlsx(filename: string, result: ExtendedDataFormat): ArrayBuffer {
  const dataObjects = dataGenerator(result);
  return dataToXlsx(dataObjects, filename);
}

export function dataToXlsx(dataObjects: ExtendedDataFormat, filename: string): ArrayBuffer {
  const wb = XLSX.utils.book_new();

  // Adding an empty, first sheet
  const empty_sheet: any[] = [];
  let ws = XLSX.utils.aoa_to_sheet(empty_sheet);
  const first_sheet = 'Enter Data →';
  XLSX.utils.book_append_sheet(wb, ws, first_sheet);

  // Adding sheets for respective statistics
  Object.keys(dataObjects).forEach((dataObj, index) => {
    if (dataObj !== 'totalEmployees') {
      const curr_data = dataObjects[dataObj as keyof DataFormat];
      const sheet_name = sheet_name_Mapping[dataObj as keyof DataFormat];
      const opt = { origin: { r: 5, c: 0 } };
      const rows = convertToRows(curr_data as TableData);
      const jsonData = gridDataToJSON(rows);
      ws = XLSX.utils.json_to_sheet(jsonData, opt);
      XLSX.utils.book_append_sheet(wb, ws, sheet_name);
    }
  });

  // Adding an empty sheet
  ws = XLSX.utils.aoa_to_sheet(empty_sheet);
  const check_sheet = 'Check Data →';
  XLSX.utils.book_append_sheet(wb, ws, check_sheet);

  // Adding a total check sheet
  const totalEmployees = dataObjects['totalEmployees'];
  const totalEmployeesArray = [
    Object.entries(totalEmployees).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as KeyedObject)
  ];
  const origin = { r: 4, c: 1 };
  XLSX.utils.sheet_add_json(ws, totalEmployeesArray, { origin });
  const last_sheet = 'Totals Check';
  XLSX.utils.book_append_sheet(wb, ws, last_sheet);
  const xlsxData = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
  const buf = new ArrayBuffer(xlsxData.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < xlsxData.length; i++) {
    view[i] = xlsxData.charCodeAt(i) & 0xff;
  }
  return XLSX.writeFile(wb, `${filename}`);
}
