import { FC } from 'react';
import { FormControl, TextField, TextFieldProps } from '@mui/material';
import { useFormikContext } from 'formik';
export type TextInputProps = TextFieldProps & {
  name: string;
};

export const TextInput: FC<TextInputProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } = useFormikContext<any>();

  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth}>
      <TextField
        {...props}
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[props.name]}
        disabled={props.disabled || isSubmitting}
        error={!!errors[props.name]}
        helperText={(touched[props.name] && errors[props.name]) as string}
      />
    </FormControl>
  );
};
