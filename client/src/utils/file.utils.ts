import * as XLSX from 'xlsx';
import { CustomFile } from '@components/file-upload/file-upload';

export class FileUtils {
  static async readCSV(rawFile: CustomFile): Promise<XLSX.WorkBook> {
    const file = await rawFile.arrayBuffer();
    const workbook = await XLSX.read(file, { type: 'array' });
    return this.cleanWorkbook(workbook);
  }

  static cleanWorkbook(workbook: XLSX.WorkBook): XLSX.WorkBook {
    const sheetNames = workbook.SheetNames;
    for (const name of sheetNames) {
      const sheet = workbook.Sheets[name];
      this.cleanSheet(sheet);
    }
    return workbook;
  }

  static cleanSheet(sheet: XLSX.WorkSheet): XLSX.WorkSheet {
    const cells = Object.keys(sheet);
    cells.forEach((cell) => {
      if (sheet[cell] && sheet[cell].t === 's' && sheet[cell].v) {
        sheet[cell].v = this.cleanText(sheet[cell].v);
      }
    });
    return sheet;
  }

  static cleanText(text: string): string {
    return text.trim();
  }

  static readCell(sheet: XLSX.WorkSheet, cell: string): number {
    if (!sheet[cell]) {
      return 'MISSING!' as any;
    }
    return Number(sheet[cell].v);
  }
}
