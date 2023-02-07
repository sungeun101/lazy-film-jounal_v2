import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Stack, Button, CardHeader, Typography, TextField } from '@mui/material';
// components
import Iconify from 'src/components/Iconify';
import { DialogAnimate } from 'src/components/animate';
import WodNewForm, { WodFormValuesProps } from './WodNewForm';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { CarouselArrows } from 'src/components/carousel';
import { DatePicker } from '@mui/lab';
import { useMessageStore, useWodStore } from 'src/zustand/useStore';

export interface WodData {
  ok: boolean;
  wod: WodFormValuesProps | null;
}

//----------------------------------------------------------------------

export default function WodBoard() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchDate, setSearchDate] = useState<Date | null>(new Date());

  const { data: wodData } = useSWR<WodData>(
    searchDate ? `/api/wods/${dayjs(searchDate).format('YYYY-MM-DD')}` : null
  );

  const { setWod } = useWodStore();
  const { addMessage } = useMessageStore();

  useEffect(() => {
    addMessage({
      body: "Hi! How would you like me to generate today's workout for you?",
      buttons: ['Create a random workout', 'Help me create one'],
      senderId: 'chatGPT',
    });
  }, []);

  useEffect(() => {
    if (wodData?.wod) {
      setWod(wodData.wod);
    } else {
      setWod(null);
    }
  }, [wodData]);

  const handlePrevious = () => {
    const prevDay = dayjs(searchDate).subtract(1, 'day').toDate();
    setSearchDate(prevDay);
  };

  const handleNext = () => {
    const nextDay = dayjs(searchDate).add(1, 'day').toDate();
    setSearchDate(nextDay);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Card>
      <CardHeader
        title="Workout of the day"
        subheader={
          <DatePicker
            value={searchDate}
            onChange={(newValue) => {
              setSearchDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} size="small" helperText={null} />}
          />
        }
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon={'eva:plus-fill'} />}
            onClick={handleOpenModal}
          >
            {wodData?.wod ? 'Edit' : 'New'} Workout
          </Button>
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <Stack p={4}>
        {wodData?.wod ? (
          <>
            <Typography
              variant="h6"
              gutterBottom
              dangerouslySetInnerHTML={{ __html: wodData?.wod?.title }}
            />
            <Typography dangerouslySetInnerHTML={{ __html: wodData?.wod?.type + ':' }} />
            <Typography dangerouslySetInnerHTML={{ __html: wodData?.wod?.content }} />
          </>
        ) : (
          <Typography>No workout has been registered yet!</Typography>
        )}
      </Stack>

      <Stack direction="row" justifyContent="center" pb={2}>
        <CarouselArrows
          customIcon={'ic:round-keyboard-arrow-right'}
          onNext={handleNext}
          onPrevious={handlePrevious}
          sx={{ '& .arrow': { width: 36, height: 36, p: 0 } }}
        />
      </Stack>

      {/* new wod modal */}
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal} fullScreen>
        <WodNewForm onCancel={handleCloseModal} searchDate={searchDate} />
      </DialogAnimate>
    </Card>
  );
}
