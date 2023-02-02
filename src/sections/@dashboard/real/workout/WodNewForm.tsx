import { useEffect } from 'react';
// form
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, DialogActions, MenuItem, TextField } from '@mui/material';
// components
import { FormProvider, RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { DatePicker, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useMutation from 'src/libs/client/useMutation';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type FormValuesProps = {
  createDate: Date | null;
  type: string;
  title: string;
  content: string;
};

type Props = {
  onCancel: VoidFunction;
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const WOD_TYPE_OPTIONS = ['as many rounds as possible', 'for time'];

// ----------------------------------------------------------------------

export default function WodNewForm({ onCancel }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewWodSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    // content: Yup.string().min(1000).required('Content is required'),
  });

  const defaultValues = {
    createDate: new Date(),
    type: 'as many rounds as possible',
    title: '',
    content: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewWodSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const [uploadWod, { data: wodResult }] = useMutation('/api/wods');

  useEffect(() => {
    if (wodResult) {
      console.log('wodResult', wodResult);
      enqueueSnackbar('Create success!');
      onCancel();
      reset();
    }
  }, [wodResult]);

  const onSubmit = async (data: FormValuesProps) => {
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
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Add
        </LoadingButton>
      </DialogActions>

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ p: 3, bgcolor: 'background.neutral' }}
          >
            <Controller
              name="createDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Date create"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />

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
          </Stack>

          <RHFTextField name="title" label="Title" />

          {/* <RHFTextField name="description" label="Description" multiline rows={3} /> */}

          <div>
            <LabelStyle>Content</LabelStyle>
            <RHFEditor name="content" />
          </div>

          {/* <div>
            <LabelStyle>Cover</LabelStyle>
            <RHFUploadSingleFile
              name="cover"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
            />
          </div> */}
        </Stack>
      </Stack>
    </FormProvider>
  );
}
