import { toyresultDataA } from './toy-result-dataA';
import { toyresultDataB } from './toy-result-dataB';
import { toyresultDataC } from './toy-result-dataC';
import { toyresultDataD } from './toy-result-dataD';
import { DataFormat } from '@utils/data-format';

interface ToyResult {
  [key: string]: DataFormat;
}

export const ToyResult: ToyResult = {
  '0': toyresultDataA,
  '1': toyresultDataB,
  '2': toyresultDataC,
  '3': toyresultDataD
};
