import { DataFormat, TotalEmployees, TableData } from '@utils/data-format';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';

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
  middleEasternNorthAfrican: genderData,
  nativeAmerican: genderData,
  twoOrMore: genderData,
  unreported: genderData
};

const Data = {
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

const table: DataFormat = {
  numberOfEmployees: Data,
  wages: Data,
  performance: Data,
  lengthOfService: Data,
  totalEmployees: totalEmpData
};

interface StringDataFormatMap {
  [key: string]: DataFormat;
}

export const toyresultDataB = (() => {
  const industriesData: StringDataFormatMap = {};
  for (const { value } of Industries) {
    industriesData[value] = table; // use the value as a key and add data as the value of the new object
  }
  for (const { value } of Sizes) {
    industriesData[value] = table; // use the value as a key and add data as the value of the new object
  }
  return industriesData;
})();
