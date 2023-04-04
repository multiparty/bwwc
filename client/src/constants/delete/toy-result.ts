import { toyresultDataA } from './toy-result-dataA';
import { toyresultDataB } from './toy-result-dataB';
import { toyresultDataC } from './toy-result-dataC';
import { StringDataFormatMap } from '@utils/data-format';

interface ToyResult {
  [key: string]: StringDataFormatMap;
}

export const ToyResult: ToyResult = {
  '1': toyresultDataB,
  '2': toyresultDataC
};
