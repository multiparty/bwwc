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
import { LinearWithValueLabel } from '@components/session-decrypt/progress-bar';
import { importPemPrivateKey } from '@utils/keypair';
import { secretSharesToTable } from '@utils/shamirs';

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
  const { token } = useAuth();
  const [privateKey, setPrivateKey] = useState<string>('');
  const { sessionId } = useSelector((state: AppState) => state.session);
  const [progress, setProgress] = useState<number>(0);
  const [encTable, setEncTable] = useState<Record<string, any>>({}); // Todo: Use the setter to store fetched pre-decryption table

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      props.setPrivateKey(values.privateKey);
      setPrivateKey(values.privateKey);
    }, [values]);
    return null;
  };

  useEffect(() => {
    const setDecTable = async () => {
      const privateCryptoKey = await importPemPrivateKey(privateKey);
      const decTable = await secretSharesToTable(encTable, privateCryptoKey, setProgress);
      // Todo: Set decTable to show in the result page
    };
    setDecTable();
  }, [privateKey]);

  const submitPrivateKeyHandler = async (files: CustomFile[]) => {
    const file = files[0];
    props.onFileUpload(file);

    if (token !== undefined && sessionId !== undefined) {
      const data = await getSubmissions(sessionId, token);
    }
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
          <LinearWithValueLabel progress={progress} />
        </Stack>
      </CardContent>
    </Card>
  );
};
