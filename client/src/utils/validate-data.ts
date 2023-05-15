import { DataFormat, TableRow } from '@utils/data-format';
import { PositionDisplayNames, Positions } from '@utils/positions';
import { Ethnicity } from '@utils/ethnicity';
import { Gender } from '@utils/gender';

export const validateData = (data: DataFormat): boolean => {
  for (const table in data) {
    // @ts-ignore
    for (const position in data[table]) {
      // @ts-ignore
      for (const ethnicity in data[table][position]) {
        // @ts-ignore
        for (const gender in data[table][position][ethnicity]) {
          // @ts-ignore
          const value = data[table][position][ethnicity][gender];
          if (value === null || value === undefined) {
            return false;
          }
          if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
            return false;
          }
          if (value % 1 !== 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
};
