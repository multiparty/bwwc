import { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat, AppState } from '@utils/data-format';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';
import { Layout } from '@layouts/layout';
import { getPrime, getPublicKey, submitData } from '@services/api';
import { importPemPublicKey } from '@utils/keypair';
import { tableToSecretShares } from '@utils/shamirs';
import { useSelector } from 'react-redux';
import { defaultData } from '@constants/default-data';
import { useAuth } from '@context/auth.context';
import BigNumber from 'bignumber.js';

export const HomePage: FC = () => {
  const { token } = useAuth();
  const [check, setCheck] = useState<boolean>(false);
  const [file, setFile] = useState<CustomFile | null>(null);
  const [data, setData] = useState<DataFormat>(defaultData);
  const [submitResp, setSubmitResp] = useState<AxiosResponse | undefined>();
  const [numShares, setNumShares] = useState<number>(3);
  const [threshold, setTheshold] = useState<number>(1); // Must have at least 1 share to reconstruct
  const [numEncryptWithKey, setNumEncryptWithKey] = useState<number>(threshold + 1); // Encrypt amount "theshold + 1" shares with key
  const [table, setTable] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataIsEncrypted, setDataIsEncrypted] = useState<boolean>(false);
  const { companySize, industry, participantCode, sessionId, privateKey } = useSelector((state: AppState) => state.session);

  useEffect(() => {
    const loadData = async () => {
      if (file) {
        console.log('Starting MPC Encryption');
        const csvData = await readCsv(file);
        console.log('Loading File Data');
        setData(csvData);
        const scale = (num: number) => num * 100;
        const prime = await getPrime(sessionId);
        console.log('Loading Prime Number');
        const publicKeyString = await getPublicKey(sessionId);
        console.log('Loading Public Key');
        const publicCryptoKey = await importPemPublicKey(publicKeyString);
        console.log('Imported Public Key');
        const secretTable = await tableToSecretShares(csvData, numShares, threshold, numEncryptWithKey, publicCryptoKey, new BigNumber(prime), true, scale);
        console.log('Encrypted Data');
        setTable(secretTable);
        setDataIsEncrypted(Object.keys(data).length !== 0);
        console.log('MPC Encryption Complete');
      }
    };
    loadData();
  }, [file]);

  const submitDataHandler = async () => {
    if (sessionId === undefined) {
      throw new Error('Session ID is undefined');
    }

    if (participantCode === undefined) {
      throw new Error('Participant code is undefined');
    }

    try {
      setLoading(true);
      const data = {
        table: table,
        participantCode: participantCode,
        industry: industry,
        companySize: companySize
      };
      if (Object.keys(data).length === 0) {
        const resp = await submitData(data, sessionId, participantCode);
        setSubmitResp(resp);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Boston Women's Workforce Council" subtitle="100% Talent Data Submission">
      <Stack spacing={5}>
        <CompanyInputForm onFileUpload={setFile} />
        <ViewData data={data} setCheck={setCheck} />
        <VerifyData loading={loading} dataIsEncrypted={dataIsEncrypted} data={data} submitResp={submitResp} submitDataHandler={submitDataHandler} check={check} />
      </Stack>
    </Layout>
  );
};
