import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat, AppState } from '@utils/data-format';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';
import { Layout } from '@layouts/layout';
import { getPublicKey, submitData } from '@services/api';
import { importPemPublicKey, importPemPrivateKey } from '@utils/keypair';
import { tableToSecretShares, secretSharesToTable } from '@utils/shamirs';
import { useSelector } from 'react-redux';

export const HomePage: FC = () => {
  const [file, setFile] = useState<CustomFile | null>(null);
  const [data, setData] = useState<DataFormat>({} as DataFormat);
  const [numShares, setNumShares] = useState<number>(10);
  const [threshold, setTheshold] = useState<number>(5); // Must have at least 5 shares to reconstruct
  const [numEncryptWithKey, setNumEncryptWithKey] = useState<number>(threshold+1); // Encrypt amount "theshold + 1" shares with key
  const [table, setTable] = useState<Record<string, any>>({});
  const { authToken, participantCode, privateKey, sessionId } = useSelector((state: AppState) => state.session);

  useEffect(() => {
    const loadData = async () => {
      if (file) {
        const csvData = await readCsv(file);
        setData(csvData);
              
        const publicKeyString = await getPublicKey(sessionId, authToken);
        const publicCryptoKey = await importPemPublicKey(publicKeyString);
        const secretTable = await tableToSecretShares(csvData, numShares, threshold, numEncryptWithKey, publicCryptoKey, true);
        setTable(secretTable);

        if (participantCode == 'analyst') {
          const privateCryptoKey = await importPemPrivateKey(privateKey);
          const decTable = await secretSharesToTable(secretTable, privateCryptoKey);
          setTable(decTable);
        }
      }
    };
    loadData();
  }, [file]);

  const submitDataHandler = () => {
    if (sessionId === undefined) {
      throw new Error('Session ID is undefined');
    }

    if (participantCode === undefined) {
      throw new Error('Participant code is undefined');
    }

    const sessionIds = '8fab1938-407a-4e26-bcde-cf69ab59904a';


    submitData(table, sessionId, participantCode);
  }

  return (
    
      <Layout title="Boston Women's Workforce Council" subtitle="100% Talent Data Submission">
        <Stack spacing={5}>
          <CompanyInputForm onFileUpload={setFile} />
          <ViewData open={false} data={data} />
          <VerifyData data={data} submitDataHandler={submitDataHandler} />
        </Stack>
      </Layout>
  );
};
