import { useEffect } from 'react';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, DialogActions, DialogTitle } from '@mui/material';
// components
import { FormProvider, RHFEditor, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useMutation from 'src/libs/client/useMutation';
import dayjs from 'dayjs';
import { useSWRConfig } from 'swr';

// ----------------------------------------------------------------------

export type FormValuesProps = {
  // createDate: Date | null;
  // type: string;
  // oneRound: number | null;
  // title: string;
  // content: string;
};

interface Props {
  onCancel: VoidFunction;
}

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function WodNewRecordForm({ onCancel }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewRecordSchema = Yup.object().shape({
    // title: Yup.string().required('Title is required'),
    // content: Yup.string().min(1).required('Content is required'),
    // oneRound: Yup.number()
    //   .transform((value) => (isNaN(value) ? undefined : value))
    //   .nullable()
    //   .when('type', {
    //     is: 'As Many Rounds As Possible',
    //     then: Yup.number().required('Reps of one round is required to measure records'),
    //   }),
  });

  const defaultValues = {
    // createDate: searchDate,
    // type: currentWod?.type || 'As Many Rounds As Possible',
    // oneRound: currentWod?.oneRound || null,
    // title: currentWod?.title || '',
    // content: currentWod?.content || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewRecordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { mutate } = useSWRConfig();
  const [uploadWod, { data: wodResult }] = useMutation('/api/wods');

  useEffect(() => {
    if (wodResult?.ok) {
      console.log('wodResult', wodResult);
      // mutate(`/api/wods/${dayjs(searchDate).format('YYYY-MM-DD')}`);
      enqueueSnackbar('Saved!');
      onCancel();
      reset();
    }
  }, [wodResult]);

  const onSubmit = async (data: FormValuesProps) => {
    // console.log('submit data', data);
    // const { createDate } = data;
    // const stringDate = dayjs(createDate).format('YYYY-MM-DD');
    // try {
    //   uploadWod({ ...data, createDate: stringDate });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} direction="row" justifyContent="space-between">
        <DialogTitle>Add your record</DialogTitle>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
        </DialogActions>
      </Stack>

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="round" label="Rounds" />
          <RHFTextField name="rep" label="Repetitions" />

          <RHFTextField name="finishAt" label="Finish At" />
        </Stack>
      </Stack>
    </FormProvider>
  );
}
