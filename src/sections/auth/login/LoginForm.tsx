import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useMutation from 'src/libs/client/useMutation';
import { useRouter } from 'next/router';
import useUser from 'src/libs/client/useUser';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function LoginForm() {
  const [register, { loading: registerLoading, data: registerResult }] =
    useMutation('/api/users/enter');
  const [login, { loading: loginLoading, data: loginResult }] = useMutation('/api/users/confirm');
  console.log('registerResult', registerResult);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log('data', data);
    if (!registerResult) {
      register(data);
    } else {
      login(data);
    }
  };
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log('login user', user);
    console.log('loginResult', loginResult);
    if (loginResult?.ok) {
      router.push('/dashboard/app');
    }
  }, [loginResult, user, router]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        {registerResult && <RHFTextField name="password" label="Password" type="password" />}
      </Stack>

      <LoadingButton
        sx={{ my: 2 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={registerLoading || loginLoading}
      >
        {registerResult ? 'Confirm Password' : 'Get one-time password'}
      </LoadingButton>
    </FormProvider>
  );
}
