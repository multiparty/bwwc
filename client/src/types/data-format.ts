import {Positions} from './positions';
import {Ethnicity} from './ethnicity';
import {Gender} from './gender';

export type TableCell = {
    [key in Positions]: {
        [key in Ethnicity]: {
            [key in Gender]: number
        }
    }
}

export interface DataFormat {
    numberOfEmployees: TableCell[],
    wages: TableCell[],
    performance: TableCell[],
    lengthOfService: TableCell[]
}