import { FC, useState, useEffect } from 'react';
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
import { secretSharesToTable } from '@utils/shamirs';
import { importPemPrivateKey } from '@utils/keypair';
import { Point } from '@utils/data-format';
import BigNumber from 'bignumber.js';
import { setDecodedTable } from '../../redux/session';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
  privateKey: Yup.string().required('Please input your Private Key.')
});

export interface CompanyInputFormProps {
  onFileUpload: (file: CustomFile) => void;
  setPrivateKey: (privateKey: string) => void;
}

interface valueProps {
  privateKey: string;
}

export const DecryptInputForm: FC<CompanyInputFormProps> = (props) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const [privateKey, setPrivateKey] = useState<string>('');
  const { prime, sessionId } = useSelector((state: AppState) => state.session);

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      props.setPrivateKey(values.privateKey);
      setPrivateKey(values.privateKey);
    }, [values]);
    return null;
  };

  const submitPrivateKeyHandler = async (files: CustomFile[]) => {
    const file = files[0];
    props.onFileUpload(file);

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
        const data = await getSubmissions(sessionId, token);
        const decodedTable = await secretSharesToTable(data, privateCryptoKey, bigPrime, reduce);
        dispatch(setDecodedTable(decodedTable));
        console.log(`decodedTable:`)
        console.log(decodedTable)
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
              <Formik validationSchema={validationSchema} initialValues={{ privateKey: '' }} onSubmit={console.log}>
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
        </Stack>
      </CardContent>
    </Card>
  );
};
