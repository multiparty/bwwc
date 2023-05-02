import { FC, useState, useEffect, useRef } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import * as Yup from 'yup';
import { Autocomplete, FormControl, TextField, TextFieldProps } from '@mui/material';
import { AutoCompleteInputProps } from '@components/forms/auto-complete-input';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';
import { ResultTable } from './result-table';
import { Form, Formik, useFormikContext } from 'formik';
import { ResultFormat, TabSelection } from '@utils/data-format';

export interface ViewResultProps {
  tabSelection: TabSelection;
  data?: ResultFormat;
}

interface valueProps {
  size: string;
  industry: string;
}

const validationSchema = Yup.object().shape({
  ddSelection: Yup.string().required('Required')
});

interface AutoCompleteInputPropsExt extends AutoCompleteInputProps {
  tabSelection: number;
}

export const AutoCompleteInput: FC<AutoCompleteInputPropsExt & TextFieldProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting, setFieldValue } = useFormikContext<any>();
  const { tabSelection } = props;
  const prevTabSelection = useRef(tabSelection);

  useEffect(() => {
    if (prevTabSelection.current !== tabSelection) {
      const newValue = tabSelection === 1 ? 'small' : 'it';
      setFieldValue(props.name, newValue);
      prevTabSelection.current = tabSelection;
    }
  }, [tabSelection]);

  const selectedValue = values[props.name];
  const autoCompleteValue = props.options.find((option) => option.value === selectedValue);

  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth}>
      <Autocomplete
        options={props.options}
        renderInput={(params: any) => (
          <TextField {...props} {...params} error={!!errors[props.name]} helperText={(touched[props.name] && errors[props.name]) as string} InputLabelProps={{ shrink: true }} />
        )}
        onChange={(event, value) => {
          handleChange({ target: { name: props.name, value: value?.value } });
        }}
        onBlur={handleBlur}
        value={autoCompleteValue}
        getOptionLabel={(option) => option.label}
        disabled={props.disabled || isSubmitting}
      />
    </FormControl>
  );
};

export const TableView: FC<ViewResultProps> = ({ tabSelection, data }) => {
  const [initialValue, setInitialValue] = useState({ input: tabSelection == 1 ? 'small' : 'it' });
  const [ddSelection, setDDSelection] = useState<String>(tabSelection == 1 ? 'small' : 'it');

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
            <Formik validationSchema={validationSchema} initialValues={initialValue} onSubmit={() => {}}>
              <Form>
                <FormObserver />
                {tabSelection == 1 ? (
                  <AutoCompleteInput key={tabSelection} fullWidth name="size" options={Sizes} label="Company Size selection" tabSelection={tabSelection} />
                ) : (
                  <AutoCompleteInput key={tabSelection} fullWidth name="industry" options={Industries} label="Industry selection" tabSelection={tabSelection} />
                )}
              </Form>
            </Formik>
          ) : (
            ''
          )}
        </Grid>
        {data != undefined ? tabSelection == 0 ? <ResultTable data={data[tabSelection]} /> : <ResultTable data={data[tabSelection]?.[ddSelection?.toString()]} /> : ''}
      </Stack>
    </Box>
  );
};
