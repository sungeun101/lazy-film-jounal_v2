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
import { useWodStore } from 'src/zustand/useWodStore';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export type FormValuesProps = {
  // createDate: Date | null;
  // type: string;
  // oneRound: number | null;
  // title: string;
  // content: string;
  amrapRound?: number | null;
  amrapRep?: number | null;
  forTimeMinute?: number | null;
  forTimeSecond?: number | null;
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
  const { wod: currentWod } = useWodStore();
  console.log('currentWod', currentWod);

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
    type: currentWod?.type || 'As Many Rounds As Possible',
    amrapRound: null,
    amrapRep: null,
    forTimeMinute: null,
    forTimeSecond: null,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewRecordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  console.log('error', errors);

  const { mutate } = useSWRConfig();
  const [uploadRecord, { data: wodResult }] = useMutation(
    `/api/wods/${currentWod?.createDate}/record`
  );

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
    console.log('submit data', data);
    try {
      uploadRecord(data);
    } catch (error) {
      console.error(error);
    }
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
        <Typography variant="h6" sx={{ color: 'text.disabled' }}>
          {currentWod?.type === 'As Many Rounds As Possible' ? 'Score:' : 'Finish At:'}
        </Typography>

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          sx={{ p: 2, bgcolor: 'background.neutral' }}
        >
          {currentWod?.type === 'As Many Rounds As Possible' ? (
            <>
              <RHFTextField name="amrapRound" label="Rounds" type="number" />
              <Typography sx={{ color: 'text.disabled' }}>and</Typography>
              <RHFTextField name="amrapRep" label="Repetitions" type="number" />
            </>
          ) : (
            <>
              <RHFTextField name="forTimeMinute" label="Minitue" type="number" />
              <Typography sx={{ color: 'text.disabled' }}>:</Typography>
              <RHFTextField name="forTimeSecond" label="Second" type="number" />
            </>
          )}
        </Stack>
      </Stack>
    </FormProvider>
  );
}
