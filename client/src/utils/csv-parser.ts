import { CustomFile } from '@components/file-upload/file-upload';
import { FileUtils } from './file.utils';
import { DataFormat, TableData } from './data-format';
import { WorkSheet } from 'xlsx';
import { Positions } from './positions';
import { Ethnicity } from './ethnicity';
import { Gender } from './gender';

export const readCsv = async (file: CustomFile): Promise<DataFormat> => {
  const data: DataFormat = {
    numberOfEmployees: {} as TableData,
    wages: {} as TableData,
    performance: {} as TableData,
    lengthOfService: {} as TableData
  };
  const workbook = await FileUtils.readCSV(file);
  const EmployeeSheetName = workbook.SheetNames[1];
  const WagesSheetName = workbook.SheetNames[2];
  const PerformanceSheetName = workbook.SheetNames[3];
  const LengthSheetName = workbook.SheetNames[4];
  data.numberOfEmployees = extractData(workbook.Sheets[EmployeeSheetName]);
  data.wages = extractData(workbook.Sheets[WagesSheetName]);
  data.performance = extractData(workbook.Sheets[PerformanceSheetName]);
  data.lengthOfService = extractData(workbook.Sheets[LengthSheetName]);
  return data;
};

const positionRowMap: Record<Positions, number> = {
  [Positions.Executive]: 6,
  [Positions.Manager]: 7,
  [Positions.Professional]: 8,
  [Positions.Technician]: 9,
  [Positions.Sales]: 10,
  [Positions.Administrative]: 11,
  [Positions.Craft]: 12,
  [Positions.Operative]: 13,
  [Positions.Laborer]: 14,
  [Positions.Service]: 15
};

const columnRowMap: Record<Ethnicity, Record<Gender, string>> = {
  [Ethnicity.Hispanic]: {
    [Gender.Female]: 'B',
    [Gender.Male]: 'C',
    [Gender.NonBinary]: 'D'
  },
  [Ethnicity.White]: {
    [Gender.Female]: 'E',
    [Gender.Male]: 'F',
    [Gender.NonBinary]: 'G'
  },
  [Ethnicity.Black]: {
    [Gender.Female]: 'H',
    [Gender.Male]: 'I',
    [Gender.NonBinary]: 'J'
  },
  [Ethnicity.Hawaiian]: {
    [Gender.Female]: 'K',
    [Gender.Male]: 'L',
    [Gender.NonBinary]: 'M'
  },
  [Ethnicity.Asian]: {
    [Gender.Female]: 'N',
    [Gender.Male]: 'O',
    [Gender.NonBinary]: 'P'
  },
  [Ethnicity.NativeAmerican]: {
    [Gender.Female]: 'Q',
    [Gender.Male]: 'R',
    [Gender.NonBinary]: 'S'
  },
  [Ethnicity.TwoOrMore]: {
    [Gender.Female]: 'T',
    [Gender.Male]: 'U',
    [Gender.NonBinary]: 'V'
  },
  [Ethnicity.Unreported]: {
    [Gender.Female]: 'W',
    [Gender.Male]: 'X',
    [Gender.NonBinary]: 'Y'
  }
};
const extractData = (sheet: WorkSheet): TableData => {
  const data: TableData = {} as TableData;
  for (const p in Positions) {
    for (const e in Ethnicity) {
      for (const g in Gender) {
        // Not sure why but I need to cast these to enums
        const position = Positions[p as keyof typeof Positions];
        const ethnicity = Ethnicity[e as keyof typeof Ethnicity];
        const gender = Gender[g as keyof typeof Gender];
        // ^^ gross

        const cell = columnRowMap[ethnicity][gender] + positionRowMap[position];

        if (data[position] === undefined) {
          data[position] = {} as any;
        }
        if (data[position][ethnicity] === undefined) {
          data[position][ethnicity] = {} as any;
        }
        data[position][ethnicity][gender] = FileUtils.readCell(sheet, cell);
      }
    }
  }
  return data;
};
