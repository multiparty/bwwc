import { DataFormat, TotalEmployees, TableData } from '@utils/data-format';

const genderData = {
  M: 2,
  F: 2,
  NB: 2
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
  M: 160,
  F: 160,
  NB: 160,
  all: 480
};

export const toyresultDataC: DataFormat = {
  numberOfEmployees: Data,
  wages: Data,
  performance: Data,
  lengthOfService: Data,
  totalEmployees: totalEmpData
};
