import { FC, useEffect, useState } from 'react';
import { Card, Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat, TableData, TotalEmployees, SecretTableData, SecretDataFormat, SecretTotalEmployees, AllEmployees } from '@utils/data-format';
import { Ethnicity } from '@utils/ethnicity';
import { Gender } from '@utils/gender';
import { Positions } from '@utils/positions';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';
import { Layout } from '@layouts/layout';
import { shamirShare } from '@utils/shamirs';


function iterateTableData(data: DataFormat, numShares: number, threshold: number): SecretDataFormat {
  const result: SecretDataFormat = {
    numberOfEmployees: {} as SecretTableData,
    wages: {} as SecretTableData,
    performance: {} as SecretTableData,
    lengthOfService: {} as SecretTableData,
    totalEmployees: {} as SecretTotalEmployees,
  };

  for (const table of Object.keys(data) as (keyof DataFormat)[]) {
    const currentData = data[table];

    if (isTableData(currentData)) {
      const positions = Object.keys(currentData) as Positions[];

      for (const position of positions) {
        const ethnicities = Object.keys(currentData[position]) as Ethnicity[];

        for (const ethnicity of ethnicities) {
          const genders = Object.keys(currentData[position][ethnicity]) as Gender[];

          for (const gender of genders) {
            const cellValue = currentData[position][ethnicity][gender];
            (result[table] as SecretTableData)[position][ethnicity][gender] = shamirShare(cellValue, numShares, threshold);
          }
        }
      }
    } else {
      const secretTotalEmployees = currentData as TotalEmployees;
      const ethnicities = Object.keys(secretTotalEmployees) as (Ethnicity | keyof AllEmployees)[];

      for (const ethnicity of ethnicities) {
        if (ethnicity !== "all") {
          const genders = Object.keys(secretTotalEmployees[ethnicity as Ethnicity]) as Gender[];

          for (const gender of genders) {
            const cellValue = secretTotalEmployees[ethnicity as Ethnicity][gender];
            (result[table] as SecretTotalEmployees)[ethnicity as Ethnicity][gender] = shamirShare(cellValue, numShares, threshold);
          }
        }
      }
    }
  }

  return result;
}

function isTableData(data: TableData | TotalEmployees): data is TableData {
  return Object.prototype.hasOwnProperty.call(data, Positions.Executive);
}

export const HomePage: FC = () => {
  const [file, setFile] = useState<CustomFile | null>(null);
  const [data, setData] = useState<DataFormat>({} as DataFormat);

  useEffect(() => {
    const loadData = async () => {
      if (file) {
        const csvData = await readCsv(file);
        setData(csvData);

        // Compute secret shares
        const numShares = 4
        const threshold = 2
        console.log(csvData)
        console.log('start shamirShare')
        // const shares = shamirShare(csvData.lengthOfService.Administrative.asian.M, numShares, threshold)
        // iterateTableData(csvData.)
        // const totalEmployeesGenders = Object.keys(data.totalEmployees) as Gender[];

        // for (const gender of totalEmployeesGenders) {
        //   const cellValue = data.totalEmployees[gender];
        //   shamirShare(cellValue, numShares, threshold);
        // }
        console.log('end shamirShare')
      }
    };
    loadData();
  }, [file]);

  return (
    <Layout title="Boston Women's Workforce Council" subtitle="100% Talent Data Submission">
      <Stack spacing={5}>
        <CompanyInputForm onFileUpload={setFile} />
        <ViewData open={false} data={data} />
        <VerifyData data={data} />
      </Stack>
    </Layout>
  );
};
