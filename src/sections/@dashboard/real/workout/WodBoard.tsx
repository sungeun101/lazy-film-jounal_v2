import { useRef, useState } from 'react';
import Slider from 'react-slick';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Chip,
  Stack,
  Avatar,
  Rating,
  Button,
  CardHeader,
  Typography,
  Grid,
  DialogTitle,
} from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// _mock_
import { _bookingReview } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from 'src/components/animate';
import WodNewForm from './WodNewForm';

//----------------------------------------------------------------------

export default function WodBoard() {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    adaptiveHeight: true,
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
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
        subheader={'오늘 날짜'}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon={'eva:plus-fill'} />}
            onClick={handleOpenModal}
          >
            New Workout
          </Button>
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {_bookingReview.map((item) => (
          <WodItem key={item.id} item={item} />
        ))}
      </Slider>

      {/* <CarouselArrows
        customIcon={'ic:round-keyboard-arrow-right'}
        onNext={handleNext}
        onPrevious={handlePrevious}
        sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
    /> */}

      {/* new wod modal */}
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal} fullScreen>
        <DialogTitle>New Workout</DialogTitle>

        <WodNewForm onCancel={handleCloseModal} />
      </DialogAnimate>
    </Card>
  );
}

// ----------------------------------------------------------------------

type WodItemProps = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  rating: number;
  postedAt: Date | string | number;
  tags: string[];
};

function WodItem({ item }: { item: WodItemProps }) {
  const { avatar, name, description, rating, postedAt, tags } = item;

  return (
    <Grid container spacing={3} sx={{ minHeight: 402, position: 'relative', p: 3 }}>
      <Grid item xs={12} md={6} lg={4}>
        video
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={avatar} />
          <div>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
            >
              Posted {fDateTime(postedAt)}
            </Typography>
          </div>
        </Stack>

        <Rating value={rating} size="small" readOnly precision={0.5} />
        <Typography variant="body2">{description}</Typography>

        <Stack direction="row" flexWrap="wrap">
          {tags.map((tag) => (
            <Chip
              size="small"
              key={tag}
              label={tag}
              sx={{ mr: 1, mb: 1, color: 'text.secondary' }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexGrow: 1 }}>
          <Button
            fullWidth
            variant="contained"
            endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
          >
            Accept
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            endIcon={<Iconify icon={'eva:close-circle-fill'} />}
          >
            Reject
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
