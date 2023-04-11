import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { convertToRows, ResultFormat, TableRow } from '@utils/data-format';

XLSX.set_fs(fs);

interface DataFormat {
  numberOfEmployees: number;
  wages: number;
  performance: number;
  lengthOfService: number;
}

const dataTypes: Array<keyof DataFormat> = ['numberOfEmployees', 'wages', 'performance', 'lengthOfService'];
const dataLabels: Array<string> = ['Number of Employees', 'Total Annual Compensation (Dollars)', 'Total Annual Cash Performance Pay (Dollars)', 'Total Length of Service (Months)'];

type ObjectArray = Array<{ [key: string]: any }>;

export const createCSV = (result: ResultFormat): void => {
  // Make a new workbook
  const wb = XLSX.utils.book_new();
  dataTypes.forEach((dataType, index) => {
    const dataLabel = dataLabels[index];
    const rows = convertToRows(result[0][dataType]);
    const jsonData = gridDataToJSON(rows);
    const ws = XLSX.utils.json_to_sheet(jsonData);

    ws.A1 = { t: 's', v: dataLabel };
    XLSX.utils.book_append_sheet(wb, ws, `All_${dataType}`);
  });

  const second = result[1];
  for (const [key, value] of Object.entries(second)) {
    const name = key;

    dataTypes.forEach((dataType, index) => {
      const dataLabel = dataLabels[index];
      const rows = convertToRows(value[dataType]);
      const jsonData = gridDataToJSON(rows);
      const ws = XLSX.utils.json_to_sheet(jsonData);

      ws.A1 = { t: 's', v: dataLabel };
      XLSX.utils.book_append_sheet(wb, ws, name + `_${dataType}`);
    });
  }

  // Write the workbook to a file
  XLSX.writeFile(wb, 'grid_output.xlsx');
};

function gridDataToJSON(rows: TableRow[]) {
  var res: ObjectArray = [];
  Object.values(rows).map((row) => {
    res.push(row);
  });
  return res;
}
