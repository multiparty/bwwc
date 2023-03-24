import { FC, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { useFormikContext } from 'formik';
import { TextInput, TextInputProps } from './text-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const PasswordInput: FC<TextInputProps> = ({ onChangeAction, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { isSubmitting } = useFormikContext<any>();

  return (
    <TextInput
      {...props}
      type={!isSubmitting && showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              disabled={isSubmitting}
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(event) => event.preventDefault()}
              edge="end"
            >
              {!isSubmitting && showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
      onChangeAction={onChangeAction}
    />
  );
};
