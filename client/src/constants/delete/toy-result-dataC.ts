import { DataFormat, TotalEmployees, TableData } from '@utils/data-format';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';

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
  M: 160,
  F: 160,
  NB: 160,
  all: 480
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

export const toyresultDataC = (() => {
  const industriesData: StringDataFormatMap = {};
  for (const { value } of Industries) {
    industriesData[value] = table; // use the value as a key and add data as the value of the new object
  }
  for (const { value } of Sizes) {
    industriesData[value] = table; // use the value as a key and add data as the value of the new object
  }
  return industriesData;
})();
