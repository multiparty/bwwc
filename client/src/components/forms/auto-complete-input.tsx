import { FC } from 'react';
import { Autocomplete, FormControl, TextField, TextFieldProps } from '@mui/material';
import { useFormikContext } from 'formik';

export interface AutoCompleteOption {
  label: string;
  value: string;
}

export interface AutoCompleteInputProps {
  name: string;
  options: AutoCompleteOption[];
  onChangeAction?: (value: string) => void;
}

export const AutoCompleteInput: FC<AutoCompleteInputProps & TextFieldProps> = ({ onChangeAction, ...props }) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } = useFormikContext<any>();
  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth}>
      <Autocomplete
        options={props.options}
        renderInput={(params: any) => (
          <TextField {...props} {...params} error={!!errors[props.name]} helperText={(touched[props.name] && errors[props.name]) as string} InputLabelProps={{ shrink: true }} />
        )}
        onChange={(event, value) => {
          handleChange({ target: { name: props.name, value: value?.value } });
          onChangeAction && onChangeAction(value);
        }}
        onBlur={handleBlur}
        value={values[props.name]}
        getOptionLabel={(option) => option.label}
        disabled={props.disabled || isSubmitting}
      />
    </FormControl>
  );
};
