import { FC, useEffect, useState } from 'react';
import { Card, Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat } from '@utils/data-format';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';

export const HomePage: FC = () => {
  const [file, setFile] = useState<CustomFile | null>(null);
  const [data, setData] = useState<DataFormat>({} as DataFormat);

  useEffect(() => {
    const loadData = async () => {
      if (file) {
        setData(await readCsv(file));
      }
    };
    loadData();
  }, [file]);

  console.log(data);

  return (
    <Stack spacing={5}>
      <CompanyInputForm onFileUpload={setFile} />
      <ViewData open={false} data={data} />
      <VerifyData data={data} />
    </Stack>
  );
};
