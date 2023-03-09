import { FC } from 'react';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { useFormikContext } from 'formik';

export const SubmitButton: FC<LoadingButtonProps> = (props) => {
  const { isSubmitting } = useFormikContext<any>();
  return <LoadingButton {...props} loading={isSubmitting} disabled={props.disabled || isSubmitting} type="submit" />;
};
