import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
import * as fs from 'fs';
import { convertToRows, ResultFormat, TableRow } from '@utils/data-format';
import { EthnicityDisplayNames } from '@utils/ethnicity';

XLSX.set_fs(fs);

type ObjectArray = Array<{ [key: string]: any }>;

interface KeyFormat {
  numberOfEmployees: number;
  wages: number;
  performance: number;
  lengthOfService: number;
}

const dataTypes: Array<keyof KeyFormat> = ['numberOfEmployees', 'wages', 'performance', 'lengthOfService'];
const dataLabels: Array<string> = ['Number of Employees', 'Total Annual Compensation (Dollars)', 'Total Annual Cash Performance Pay (Dollars)', 'Total Length of Service (Months)'];

// Add a value to a designated cell
function setValue(ws: WorkSheet, value: string, c: number, r: number) {
  const cellAddress = XLSX.utils.encode_cell({ c: c, r: r });
  ws[cellAddress] = { t: 's', v: value };
}

// Add a parent header value above nested header (merge cells)
function parentHeader(ws: WorkSheet, c: number, r: number) {
  Object.entries(EthnicityDisplayNames).forEach(([key, value], index) => {
    setValue(ws, value, c + index * 3, r);
  });

  const merge = Object.values(EthnicityDisplayNames).map((_, i) => ({
    s: { r: r, c: c + i * 3 },
    e: { r: r, c: c + i * 3 + 2 }
  }));

  ws['!merges'] = merge;
}

// Convert a grid table data into a xlsx format
function gridDataToJSON(rows: TableRow[]) {
  var res: ObjectArray = [];
  Object.values(rows).map((row) => {
    res.push(row);
  });
  return res;
}

// Generate a sheet for each data
function map_xlsx(wb: WorkBook, data: any, prefix: string) {
  const c = 0;
  const r = 4;
  const opt = { origin: { r: r, c: c } };
  dataTypes.forEach((dataType, index) => {
    const dataLabel = dataLabels[index];
    const rows = convertToRows(data[dataType]);
    const jsonData = gridDataToJSON(rows);
    const ws = XLSX.utils.json_to_sheet(jsonData, opt);

    setValue(ws, dataLabel, 0, r); //Add a label at the corner
    parentHeader(ws, c + 1, r - 1); // Add a parent header of the nested header
    XLSX.utils.book_append_sheet(wb, ws, prefix + dataType);
  });
}

// Main method to create a CSV
export const createCSV = (result: ResultFormat): void => {
  // Make a new workbook
  const wb = XLSX.utils.book_new();

  // Generate sheets for All, aggregated numbers
  const data = result[0];
  var prefix = 'All_';
  map_xlsx(wb, data, prefix);

  // Generate sheets for Industries and Sizes
  const second = result[1];
  for (const [key, value] of Object.entries(second)) {
    prefix = key;
    const data = value;
    map_xlsx(wb, data, prefix);
  }

  // Export the workbook to a file to download
  XLSX.writeFile(wb, 'BWWC_Result.xlsx');
};
