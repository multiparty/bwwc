import { DataFormat, TotalEmployees, TableData } from '@utils/data-format';

const genderData = {
  M: 3,
  F: 3,
  NB: 3
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
  M: 240,
  F: 240,
  NB: 240,
  all: 720
};

export const toyresultDataD: DataFormat = {
  numberOfEmployees: Data,
  wages: Data,
  performance: Data,
  lengthOfService: Data,
  totalEmployees: totalEmpData
};
