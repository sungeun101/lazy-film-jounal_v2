import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useMutation from 'src/libs/client/useMutation';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const [enter, { loading, data }] = useMutation('/api/users/enter');

  const { register } = useAuth();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log('data', data);
    enter(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Get one-time password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
