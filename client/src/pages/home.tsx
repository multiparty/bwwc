import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat } from '@utils/data-format';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';
import { Layout } from '@layouts/layout';
import { shamirShare } from '@utils/shamirs';

function performDFS(obj: Record<string, any>): Record<string, any> {
  const dfs = (
    currentObj: Record<string, any>,
    originalObj: Record<string, any>,
    keyPath: string[] = [],
  ): Record<string, any> => {
    const keys = Object.keys(originalObj);

    for (const key of keys) {
      if (typeof originalObj[key] === 'number') {
        const numShares = 4
        const threshold = 2
        currentObj[key] = shamirShare(originalObj[key], numShares, threshold);
      } else if (typeof originalObj[key] === 'object') {
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        dfs(currentObj[key], originalObj[key], keyPath.concat(key));
      }
    }

    return currentObj;
  };

  return dfs({}, obj);
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
        console.log(performDFS(csvData))
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
