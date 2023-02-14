import { useEffect } from 'react';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, DialogActions, MenuItem, DialogTitle } from '@mui/material';
// components
import { FormProvider, RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useMutation from 'src/libs/client/useMutation';
import dayjs from 'dayjs';
import { useSWRConfig } from 'swr';
import { useWodStore } from 'src/zustand/useStore';
import { RecordFormValuesProps } from './WodNewRecordForm';

// ----------------------------------------------------------------------

export type WodFormValuesProps = {
  createDate: Date | null;
  type: 'As Many Rounds As Possible' | 'For Time';
  content: string;
  records: IRecord[];
};

export interface IRecord extends RecordFormValuesProps {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

interface Props {
  onCancel: VoidFunction;
  searchDate: Date | null;
}

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const WOD_TYPE_OPTIONS = ['As Many Rounds As Possible', 'For Time'];

// ----------------------------------------------------------------------

export default function WodNewForm({ onCancel, searchDate }: Props) {
  const { wod: currentWod } = useWodStore();

  const { enqueueSnackbar } = useSnackbar();

  const NewWodSchema = Yup.object().shape({
    content: Yup.string().min(1).required('Content is required'),
  });

  const defaultValues = {
    createDate: searchDate,
    type: currentWod?.type || 'As Many Rounds As Possible',
    content: currentWod?.content || '',
  };

  const methods = useForm<WodFormValuesProps>({
    resolver: yupResolver(NewWodSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate } = useSWRConfig();
  const [uploadWod, { data: wodResult }] = useMutation('/api/wods');

  useEffect(() => {
    if (wodResult?.ok) {
      console.log('wodResult', wodResult);
      mutate(`/api/wods/${dayjs(searchDate).format('YYYY-MM-DD')}`);
      enqueueSnackbar('Saved!');
      onCancel();
      reset();
    }
  }, [wodResult]);

  const onSubmit = async (data: WodFormValuesProps) => {
    console.log('submit data', data);
    const { createDate } = data;
    const stringDate = dayjs(createDate).format('YYYY-MM-DD');
    try {
      uploadWod({ ...data, createDate: stringDate });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} direction="row" justifyContent="space-between">
        <DialogTitle>{dayjs(searchDate).format('YYYY-MM-DD')}</DialogTitle>

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
          <RHFSelect
            fullWidth
            name="type"
            label="Workout Type"
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
          >
            {WOD_TYPE_OPTIONS.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {option}
              </MenuItem>
            ))}
          </RHFSelect>

          <div>
            <LabelStyle>Content</LabelStyle>
            <RHFEditor name="content" />
          </div>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
