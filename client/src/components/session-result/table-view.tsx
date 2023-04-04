import { FC, useState, useEffect } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import * as Yup from 'yup';
import { AutoCompleteInput } from '@components/forms/auto-complete-input';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';
import { ResultTable } from './result-table';
import { Form, Formik, useFormikContext } from 'formik';
import { StringDataFormatMap } from '@utils/data-format';

export interface ViewResultProps {
  tabSelection: number;
  data?: StringDataFormatMap;
}

interface valueProps {
  size: string;
  industry: string;
}

const validationSchema = Yup.object().shape({
  ddSelection: Yup.string().required('Required')
});

export const TableView: FC<ViewResultProps> = ({ tabSelection, data }) => {
  const [initialValue, setInitialValue] = useState({ input: tabSelection==1?'small':'it' });
  const [ddSelection, setDDSelection] = useState<String>(tabSelection==1?'small':'it' );

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      if (tabSelection == 1) {
        setDDSelection(values.size);
      }
      if (tabSelection == 2) {
        setDDSelection(values.industry);
      }
    }, [values]);
    return null;
  };

  return (
    <Box>
      <Stack spacing={2} sx={{ textAlign: 'center' }}>
        <Grid item xs={12} md={6} sx={{ width: '50%' }}>
          {tabSelection != 0 ? (
            <Formik validationSchema={validationSchema} initialValues={initialValue} onSubmit={console.log}>
              <Form>
                <FormObserver />
                {tabSelection == 1 ? (
                  <AutoCompleteInput fullWidth name="size" options={Sizes} label="Company Size selection" defaultValue={ddSelection} />
                ) : (
                  <AutoCompleteInput fullWidth name="industry" options={Industries} label="Industry selection" defaultValue={ddSelection} />
                )}
              </Form>
            </Formik>
          ) : (
            ''
          )}
        </Grid>
        {data!=undefined?<ResultTable data={data[ddSelection?.toString()]} />:''}
      </Stack>
    </Box>
  );
};
