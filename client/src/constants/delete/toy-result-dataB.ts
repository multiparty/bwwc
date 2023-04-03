import { DataFormat, TotalEmployees, TableData } from '@utils/data-format';

const genderData = {
  M: 1,
  F: 1,
  NB: 1
};

const raceData = {
  hispanic: genderData,
  white: genderData,
  black: genderData,
  hawaiian: genderData,
  asian: genderData,
  nativeAmerican: genderData,
  twoOrMore: genderData,
  unreported: genderData
};

const Data: TableData = {
  Executive: raceData,
  Manager: raceData,
  Professional: raceData,
  Technician: raceData,
  Sales: raceData,
  Administrative: raceData,
  Craft: raceData,
  Operative: raceData,
  Laborer: raceData,
  Service: raceData
};

const totalEmpData: TotalEmployees = {
  M: 80,
  F: 80,
  NB: 80,
  all: 240
};

export const toyresultDataB: DataFormat = {
  numberOfEmployees: Data,
  wages: Data,
  performance: Data,
  lengthOfService: Data,
  totalEmployees: totalEmpData
};
