import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat, Point } from '@utils/data-format';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';
import { Layout } from '@layouts/layout';
import { getPublicKey, submitData } from '@services/api';
import { importPemPublicKey, keyPairToDictionary } from '@utils/keypair';
import { useSession } from '@context/session.context';
import { generateKeyPair } from '@utils/keypair'; // TODO: remove later
import { tableToSecretShares } from '@utils/shamirs';


export const HomePage: FC = () => {
  const { sessionId, participantCode } = useSession();
  const [file, setFile] = useState<CustomFile | null>(null);
  const [data, setData] = useState<DataFormat>({} as DataFormat);
  const [numShares, setNumShares] = useState<number>(10);
  const [threshold, setTheshold] = useState<number>(5); // Must have at least 5 shares to reconstruct
  const [numEncryptWithKey, setNumEncryptWithKey] = useState<number>(threshold+1); // Encrypt amount "theshold + 1" shares with key
  const [table, setTable] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadData = async () => {
      if (file) {
        const csvData = await readCsv(file);
        setData(csvData);

        // Compute secret shares
        const sessionId = 'd09c948a-a2fe-4d3b-8853-21'; // TODO
        const authToken = 'auth_token'; // TODO
        
        const keypair = await generateKeyPair();
        const { publicKey, privateKey } = await keyPairToDictionary(keypair);
        const publicKeyPem = publicKey.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');
        const publicCryptoKey = await importPemPublicKey(publicKeyPem);

        const secretTable = await tableToSecretShares(csvData, numShares, threshold, numEncryptWithKey, publicCryptoKey, true);
        console.log(secretTable);
        setTable(secretTable);
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

    console.log(table)

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
