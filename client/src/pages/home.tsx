import { FC, useEffect, useState, createContext } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';
import { CustomFile } from '@components/file-upload/file-upload';
import { DataFormat, Point } from '@utils/data-format';
import { readCsv } from '@utils/csv-parser';
import { ViewData } from '@components/view-data/view-data';
import { VerifyData } from '@components/verify-data';
import { Layout } from '@layouts/layout';
import { shamirShare } from '@utils/shamirs';
import { getPublicKey, submitData } from '@services/api';
import { importPemPublicKey, encryptString } from '@utils/keypair';
import TableContextProvider from '@context/table.context';
import { useSession } from '@context/session.context';

async function encryptShares(points: Point[], numEncryptWithKey: number, publicKey: CryptoKey): Promise<Array<Point>> {
  let numCalls = 0;
  const encryptedPoints = new Array();

  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1].toString();

    if (numCalls < numEncryptWithKey) {
      encryptedPoints.push([x, await encryptString(publicKey, y)]);
    } else {
      encryptedPoints.push([x, y]);
    }
    numCalls++;
  }

  return encryptedPoints;
}

async function tableToSecretShares(obj: Record<string, any>, numShares: number, threshold: number, numEncryptWithKey: number, publicKey: CryptoKey, asString: boolean=false): Promise<Record<string, any>> {
  const dfs = async (
    currentObj: Record<string, any>,
    originalObj: Record<string, any>,
    keyPath: string[] = [],
  ): Promise<Record<string, any>> => {
    const keys = Object.keys(originalObj);
    const encoder = new TextEncoder();

    for (const key of keys) {
      if (typeof originalObj[key] === 'number') {
        const points = shamirShare(originalObj[key], numShares, threshold, asString);
        currentObj[key] = await encryptShares(points, numEncryptWithKey, publicKey);
      } else if (typeof originalObj[key] === 'object') {
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        dfs(currentObj[key], originalObj[key], keyPath.concat(key));
      }
    }

    return currentObj;
  };

  return await dfs({}, obj);
}

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
        const sessionId = '357f8272-3f82-40ac-a4cf-18861352d8cb'; // TODO
        const authToken = 'token'; // TODO
        const asString = true;
        const publicKeyString = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArJTEFwAmb60hsspOyISyo+NAOGa8dtGzJVb+KuHbnhYiROM+aeUXm0FtLiq3Qn3ibjhTlWGxER6GSuIopwY83KP0EIOLDKSMxcEk4yS7yKbJRBqE5sc5VtV35H2yLO2qK8PunobD6ngBF4lDnCat3w7KdxwSw7VoDnnUFYmA7Kfmr05qHvh/KoZQvISa/wYjlHevoFVvGYR9FI83uU86BxhHuDkIwAtD3mDeEXGUAtBGrXKXWwrsNyXvjlX2pr8SxO9p/H+rGhCby243s+SlY9L1IsC5QN7SAp4EL6gqPzc5BNq8Fma4NmFa65nCAFXWG5a2j2eIAzxfnbRAqzHfcwIDAQAB';
        // const publicKeyString = await getPublicKey(sessionId, authToken);
        const publicCryptoKey = await importPemPublicKey(publicKeyString);
        const secretTable = await tableToSecretShares(csvData, numShares, threshold, numEncryptWithKey, publicCryptoKey, asString);
        setTable(secretTable);
      }
    };
    loadData();
  }, [file]);

  const onSubmitHandler = () => {
    if (sessionId === undefined) {
      throw new Error('Session ID is undefined');
    }

    if (participantCode === undefined) {
      throw new Error('Participant code is undefined');
    }

    submitData(table, sessionId, participantCode);
  }

  return (
    
      <Layout title="Boston Women's Workforce Council" subtitle="100% Talent Data Submission">
        <Stack spacing={5}>
          <CompanyInputForm onFileUpload={setFile} />
          <ViewData open={false} data={data} />
          <VerifyData data={data} onClick={() => onSubmitHandler} />
        </Stack>
      </Layout>
  );
};
