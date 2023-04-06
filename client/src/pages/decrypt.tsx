import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DecryptInputForm } from '@components/session-decrypt/decrypt-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { Layout } from '@layouts/layout';

export const DecryptPage: FC = () => {
  const [file, setFile] = useState<CustomFile | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadKey = async () => {
      // Todo: Add proper authentication 
      if (file && privateKey) {
        navigate('/result')
      }
    };
    loadKey();
  }, [file]);

  return (
    <Layout title="Boston Women's Workforce Council" subtitle="100% Talent Data Submission">
      <Stack spacing={5}>
        <DecryptInputForm onFileUpload={setFile} setPrivateKey={setPrivateKey}/>
      </Stack>
    </Layout>
  );
};
