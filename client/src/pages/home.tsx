import { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';

export const HomePage: FC = () => {
  const [file, setFile] = useState<CustomFile | null>(null);
  return (
    <Stack>
      <CompanyInputForm onFileUpload={setFile} />
    </Stack>
  );
};
