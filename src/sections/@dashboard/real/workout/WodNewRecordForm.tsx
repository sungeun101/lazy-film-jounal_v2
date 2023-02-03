import { useEffect } from 'react';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui

import { Typography, Stack, Button, DialogActions, DialogTitle } from '@mui/material';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useMutation from 'src/libs/client/useMutation';
import { useSWRConfig } from 'swr';
import { useWodStore } from 'src/zustand/useWodStore';

// ----------------------------------------------------------------------

export type RecordFormValuesProps = {
  amrapRound?: number | null;
  amrapRep?: number | null;
  forTimeMinute?: number | null;
  forTimeSecond?: number | null;
};

interface Props {
  onCancel: VoidFunction;
}

// ----------------------------------------------------------------------

export default function WodNewRecordForm({ onCancel }: Props) {
  const { wod: currentWod } = useWodStore();

  const { enqueueSnackbar } = useSnackbar();

  const NewRecordSchema = Yup.object().shape({});

  const defaultValues = {
    type: currentWod?.type || 'As Many Rounds As Possible',
    amrapRound: null,
    amrapRep: null,
    forTimeMinute: null,
    forTimeSecond: null,
  };

  const methods = useForm<RecordFormValuesProps>({
    resolver: yupResolver(NewRecordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate } = useSWRConfig();
  const [uploadRecord, { data: recordResult }] = useMutation(
    `/api/wods/${currentWod?.createDate}/record`
  );

  useEffect(() => {
    if (recordResult?.ok) {
      console.log('recordResult', recordResult);
      mutate(`/api/wods/${currentWod?.createDate}`);
      enqueueSnackbar('Saved!');
      onCancel();
      reset();
    }
  }, [recordResult]);

  const onSubmit = async (data: RecordFormValuesProps) => {
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
