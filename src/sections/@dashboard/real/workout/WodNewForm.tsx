import { useCallback, useEffect } from 'react';
// form
import * as Yup from 'yup';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, DialogActions, MenuItem, TextField } from '@mui/material';
// components
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFUploadSingleFile,
} from 'src/components/hook-form';
import { DatePicker, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useMutation from 'src/libs/client/useMutation';
import dayjs, { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

type FormValuesProps = {
  createDate: Dayjs;
  type: string;
  title: string;
  content: string;
  //   description: string;
  //   cover: File | any;
  //   tags: string[];
  //   publish: boolean;
  //   comments: boolean;
  //   metaTitle: string;
  //   metaDescription: string;
  //   metaKeywords: string[];
};

type Props = {
  onCancel: VoidFunction;
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const WOD_TYPE_OPTIONS = ['for time', 'as many rounds as possible'];

const now = dayjs();
// ----------------------------------------------------------------------

export default function WodNewForm({ onCancel }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewWodSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    // description: Yup.string().required('Description is required'),
    // cover: Yup.mixed().required('Cover is required'),
    // content: Yup.string().min(1000).required('Content is required'),
  });

  const defaultValues = {
    createDate: now,
    type: 'for time',
    title: '',
    content: '',
    // description: '',
    // cover: null,
    // tags: ['Logan'],
    // publish: true,
    // comments: true,
    // metaTitle: '',
    // metaDescription: '',
    // metaKeywords: ['Logan'],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewWodSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  //   const { control } = useFormContext();

  const values = watch();

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
    // console.log('submit data', data);
    try {
      uploadWod(data);
    } catch (error) {
      console.error(error);
    }
  };

  //   const handleDrop = useCallback(
  //     (acceptedFiles) => {
  //       const file = acceptedFiles[0];

  //       if (file) {
  //         setValue(
  //           'cover',
  //           Object.assign(file, {
  //             preview: URL.createObjectURL(file),
  //           })
  //         );
  //       }
  //     },
  //     [setValue]
  //   );

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
