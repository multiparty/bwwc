import { PositionDisplayNames, Positions } from './positions';
import { Ethnicity } from './ethnicity';
import { Gender } from './gender';
import BigNumber from 'bignumber.js';

export type TableData = {
  [key in Positions]: {
    [key in Ethnicity]: {
      [key in Gender]: number;
    };
  };
};

export type Point = [string | BigNumber | string, BigNumber];
export type PointWithEncryptedState = [string, BigNumber, string];

export type SecretTableData = {
  [key in Positions]: {
    [key in Ethnicity]: {
      [key in Gender]: Point[];
    };
  };
};

export type AllEmployees = {
  all: number;
};

export type TotalEmployees = {
  [key in Gender]: number;
} & AllEmployees;

export type SecretTotalEmployees = {
  [key in Gender]: Point[];
} & AllEmployees;

export interface DataFormat {
  numberOfEmployees: TableData;
  wages: TableData;
  performance: TableData;
  lengthOfService: TableData;
  totalEmployees: TotalEmployees;
}

export interface SecretDataFormat {
  numberOfEmployees: SecretTableData;
  wages: SecretTableData;
  performance: SecretTableData;
  lengthOfService: SecretTableData;
  totalEmployees: SecretTotalEmployees;
}

export interface TableRow {
  position: string;
  hispanicM: number;
  hispanicF: number;
  hispanicNB: number;
  whiteM: number;
  whiteF: number;
  whiteNB: number;
  blackM: number;
  blackF: number;
  blackNB: number;
  hawaiianM: number;
  hawaiianF: number;
  hawaiianNB: number;
  asianM: number;
  asianF: number;
  asianNB: number;
  nativeAmericanM: number;
  nativeAmericanF: number;
  nativeAmericanNB: number;
  twoOrMoreM: number;
  twoOrMoreF: number;
  twoOrMoreNB: number;
  unreportedM: number;
  unreportedF: number;
  unreportedNB: number;
}

export function convertToRows(data?: TableData): TableRow[] {
  const rows: TableRow[] = [];
  for (const position in data) {
    const row: TableRow = {
      position: PositionDisplayNames[position as Positions]
    } as TableRow;
    for (const ethnicity in data[position as Positions]) {
      for (const gender in data[position as Positions][ethnicity as Ethnicity]) {
        // @ts-ignore
        row[ethnicity + gender] = data[position as Positions][ethnicity as Ethnicity][gender as Gender];
      }
    }
    rows.push(row);
  }
  return rows;
}
