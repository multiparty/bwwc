import { FC, useRef, useEffect } from 'react';
import { Autocomplete, FormControl, TextField, TextFieldProps } from '@mui/material';
import { useFormikContext } from 'formik';

export interface AutoCompleteOption {
  label: string;
  value: string;
}

export interface AutoCompleteInputProps {
  name: string;
  options: AutoCompleteOption[];
}

interface AutoCompleteInputPropsExt extends AutoCompleteInputProps {
  tabSelection: number;
}

export const CompanyAutoCompleteInput: FC<AutoCompleteInputProps & TextFieldProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } = useFormikContext<any>();
  const selectedOption = props.options.find(opt => opt.value === values[props.name]);
  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth}>
      <Autocomplete
        options={props.options}
        renderInput={(params: any) => (
          <TextField {...props} {...params} error={!!errors[props.name]} helperText={(touched[props.name] && errors[props.name]) as string} InputLabelProps={{ shrink: true }} />
        )}
        onChange={(event, option) => 
          handleChange({
            target: {
              name: props.name,
              value: option ? option.value : ''
            }
          })
        } 
        value={selectedOption}
        getOptionLabel={(option) => option ? option.label : ''}
        onBlur={handleBlur}
        disabled={props.disabled || isSubmitting}
      />
    </FormControl>
  );
};

export const TableAutoCompleteInput: FC<AutoCompleteInputPropsExt & TextFieldProps> = (props) => {
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