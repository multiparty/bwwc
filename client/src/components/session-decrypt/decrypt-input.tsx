import { useState, useEffect } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { LockTwoTone } from '@mui/icons-material';
import { PasswordInput } from '@components/forms/password-input';
import { CustomFile, FileUpload } from '@components/file-upload/file-upload';
import { getSubmissions } from '@services/api';
import { useAuth } from '@context/auth.context';
import { useSelector } from 'react-redux';
import { AppState } from '@utils/data-format';
import { LinearWithValueLabel } from '@components/session-decrypt/progress-bar';
import { secretSharesToTable } from '@utils/shamirs';
import { importPemPrivateKey } from '@utils/keypair';
import { Point } from '@utils/data-format';
import BigNumber from 'bignumber.js';
import { setDecodedTable, setMetadata, setSessionId, setPrime } from '../../redux/session';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  privateKey: Yup.string().required('Please input your Private Key.')
});

interface valueProps {
  privateKey: string;
}

export const DecryptInputForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [privateKey, setPrivateKey] = useState<string>('');
  const { prime, sessionId } = useSelector((state: AppState) => state.session);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const sessionIdfromStorage = localStorage.getItem('sessionId');
    dispatch(setSessionId(sessionIdfromStorage));
    if (prime === null || typeof prime !== 'string' || prime === '') {
      navigate('/manage');
    }
  }, []);

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      setPrivateKey(values.privateKey);
    }, [values]);
    return null;
  };

  const submitPrivateKeyHandler = async (files: CustomFile[]) => {
    const file = files[0];

    const reader = new FileReader();
    // Complete the MPC by summing all the shares together
    // Can replace this function with any custom functionality to apply
    // over unencrypted shares.
    type InputElement = string | BigNumber;
    type InputList = Array<Array<InputElement>>;
    const bigPrime = new BigNumber(prime);

    const reduce = async (input: Array<Point>) => {
      const resultMap: Map<string | BigNumber, Array<InputElement>> = new Map();

      for (const [type, value] of input) {
        if (!resultMap.has(type)) {
          resultMap.set(type, [type, new BigNumber(0)]);
        }

        const currentValue: Array<InputElement> | undefined = resultMap.get(type);
        if (currentValue) {
          currentValue[1] = new BigNumber(currentValue[1] as BigNumber).plus(new BigNumber(value)).mod(bigPrime);
        }
      }

      // Convert BigNumber back to string in the result
      const result: InputList = Array.from(resultMap.values()).map(([type, value]) => [type, (value as BigNumber).toString()]);

      return result;
    };

    reader.onload = async (event) => {
      if (token !== undefined && sessionId !== undefined) {
        const fileContent = event.target?.result as string;
        const privateCryptoKey = await importPemPrivateKey(fileContent);
        const { data, total_cells, metadata } = await getSubmissions(sessionId, token);

        const recordProgress = (progress: number) => {
          const numTable = Object.keys(metadata.companySize).length + Object.keys(metadata.industry).length + 1;
          setProgress((progress / (total_cells * numTable - 1)) * 100);
        };

        const scale = (num: number) => num / 100;
        const decodedTable = await secretSharesToTable(data, privateCryptoKey, bigPrime, reduce, recordProgress, scale);
        dispatch(setDecodedTable(decodedTable));
        dispatch(setMetadata(metadata));
      }
    };

    reader.readAsText(file);
  };

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            Decrypt Data
          </Typography>
          <Typography>
            Please make sure your BWWC 2023 Submission ID and session key match the ones you configured when you started the session. Drag and drop your session key file.
          </Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Formik validationSchema={validationSchema} initialValues={{ privateKey: '' }} onSubmit={() => {}}>
                <Form>
                  <FormObserver />
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LockTwoTone />
                      <Typography variant="h5">Private Key</Typography>
                    </Stack>
                    <PasswordInput fullWidth name="privatekey" label="Private Key" />
                  </Stack>
                </Form>
              </Formik>
            </Grid>
            <Grid item xs={12} md={6}>
              <FileUpload multiple={false} onChange={(files) => submitPrivateKeyHandler(files)} title="Drag and drop your key file here" />
            </Grid>
          </Grid>
          <LinearWithValueLabel progress={progress} />
        </Stack>
      </CardContent>
    </Card>
  );
};
