import { Dispatch, SetStateAction, useEffect } from 'react';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Typography,
  Stack,
  Button,
  DialogActions,
  DialogTitle,
  FormHelperText,
} from '@mui/material';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useMutation from 'src/libs/client/useMutation';
import useSWR, { useSWRConfig } from 'swr';
import { useWodStore } from 'src/zustand/useStore';
import { IRecord } from './WodNewForm';

// ----------------------------------------------------------------------

export type RecordFormValuesProps = {
  amrapRound?: number | null;
  amrapRep?: number | null;
  forTimeMinute?: number | null;
  forTimeSecond?: number | null;
};

interface Props {
  onCancel: VoidFunction;
  sortedRecords: IRecord[];
  setSortedRecords: Dispatch<SetStateAction<IRecord[]>>;
}

// ----------------------------------------------------------------------

export default function WodNewRecordForm({ onCancel, sortedRecords, setSortedRecords }: Props) {
  const { wod: currentWod } = useWodStore();

  const { enqueueSnackbar } = useSnackbar();

  const NewRecordSchema = Yup.object().shape({
    amrapRound: Yup.number()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
      .when('type', {
        is: 'As Many Rounds As Possible',
        then: Yup.number().required('required'),
      }),
    forTimeMinute: Yup.number()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
      .when('type', {
        is: 'For Time',
        then: Yup.number().required(''),
      }),
    forTimeSecond: Yup.number()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
      .min(0, 'This must be at least 0')
      .max(59, 'This must be less than 60'),
  });

  const defaultValues = {
    type: currentWod?.type || 'As Many Rounds As Possible',
    amrapRound: undefined,
    amrapRep: undefined,
    forTimeMinute: undefined,
    forTimeSecond: undefined,
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
  // post
  const [uploadRecord, { data: recordResult }] = useMutation(
    `/api/wods/${currentWod?.createDate}/record`
  );
  const [updateFeatured, { data: featuredResult }] = useMutation(
    `/api/wods/${currentWod?.createDate}/featured`
  );
  // get
  const { data: topFiveRecordsData } = useSWR(
    recordResult?.ok ? `/api/wods/${currentWod?.createDate}/record` : null
  );

  useEffect(() => {
    if (currentWod) {
      console.log('currentWod', currentWod);
    }
  }, [currentWod]);

  useEffect(() => {
    if (featuredResult) {
      console.log('featuredResult', featuredResult);
    }
  }, [featuredResult]);

  useEffect(() => {
    if (recordResult?.ok) {
      console.log('recordResult', recordResult);
      mutate(`/api/wods/${currentWod?.createDate}`);
      enqueueSnackbar('Saved!');
      onCancel();
      reset();
    }
  }, [recordResult]);

  useEffect(() => {
    if (topFiveRecordsData?.ok) {
      console.log('topFiveRecordsData', topFiveRecordsData);
      sortRecords();
    }
  }, [topFiveRecordsData]);

  const sortRecords = () => {
    if (currentWod) {
      let sorted;
      if (currentWod.type === 'For Time') {
        sorted = topFiveRecordsData.topFiveRecordsFortheDay.sort((a: IRecord, b: IRecord) =>
          a.forTimeMinute === b.forTimeMinute ? a.forTimeSecond! - b.forTimeSecond! : 0
        );
      } else {
        sorted = topFiveRecordsData.topFiveRecordsFortheDay.sort((a: IRecord, b: IRecord) =>
          a.amrapRound === b.amrapRound ? b.amrapRep! - a.amrapRep! : 0
        );
      }
      setSortedRecords(sorted);
      console.log('update Featured!!');
      updateFeatured(sorted);
    }
  };

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
        <DialogTitle>Submit your score</DialogTitle>

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

        {currentWod?.type === 'As Many Rounds As Possible' ? (
          <Stack
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ p: 2, bgcolor: 'background.neutral' }}
          >
            <RHFTextField
              name="amrapRound"
              label="Rounds"
              type="number"
              helperText="The number of complete rounds you were able to perform"
            />
            <Typography sx={{ color: 'text.disabled', pt: 2 }}>and</Typography>
            <RHFTextField
              name="amrapRep"
              label="Repetitions"
              type="number"
              helperText="Any additional reps completed in the final round"
            />
          </Stack>
        ) : (
          <Stack spacing={1} direction="column" sx={{ p: 2, bgcolor: 'background.neutral' }}>
            <Stack
              spacing={2}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              sx={{ bgcolor: 'background.neutral' }}
            >
              <RHFTextField name="forTimeMinute" label="Minitue" type="number" />
              <Typography sx={{ color: 'text.disabled' }}>:</Typography>
              <RHFTextField name="forTimeSecond" label="Second" type="number" />
            </Stack>
            <FormHelperText>
              The amount of time it took you to complete the entire workout
            </FormHelperText>
          </Stack>
        )}
      </Stack>
    </FormProvider>
  );
}
