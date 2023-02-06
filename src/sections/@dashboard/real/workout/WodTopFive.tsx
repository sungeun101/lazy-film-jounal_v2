// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
  Divider,
  Button,
  Stack,
} from '@mui/material';
// _mock_
import { _ecommerceBestSalesman } from 'src/_mock';
// components
import Label from 'src/components/Label';
import Scrollbar from 'src/components/Scrollbar';
import Iconify from 'src/components/Iconify';
import { useEffect, useState } from 'react';
import { DialogAnimate } from 'src/components/animate';
import WodNewRecordForm from './WodNewRecordForm';
import { useWodStore } from 'src/zustand/useStore';
import { IRecord } from './WodNewForm';

// ----------------------------------------------------------------------

export default function WodTopFive() {
  const theme = useTheme();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [sortedRecords, setSortedRecords] = useState<IRecord[]>([]);

  const { wod } = useWodStore();
  console.log('wod', wod);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    if (wod && wod.records) {
      let sorted;
      if (wod.type === 'For Time') {
        sorted = wod.records.sort((a: IRecord, b: IRecord) =>
          a.forTimeMinute === b.forTimeMinute ? a.forTimeSecond! - b.forTimeSecond! : 0
        );
      } else {
        sorted = wod.records.sort((a: IRecord, b: IRecord) =>
          a.amrapRound === b.amrapRound ? b.amrapRep! - a.amrapRep! : 0
        );
      }
      setSortedRecords(sorted);
    }
  }, [wod]);

  return (
    <Card>
      <CardHeader
        title="Today's Top 5"
        sx={{ mb: 3 }}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon={'eva:plus-fill'} />}
            onClick={handleOpenModal}
          >
            New Score
          </Button>
        }
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720, minHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Athelete</TableCell>
                <TableCell>Score</TableCell>
                <TableCell align="right">Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRecords && sortedRecords.length > 0 ? (
                sortedRecords.map((row: IRecord, index: number) => (
                  <TableRow key={row.user.name}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.user.name} src={row.user.avatar ?? ''} />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle2"> {row.user.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {row.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {wod?.type === 'As Many Rounds As Possible'
                        ? `${row.amrapRound} round${
                            row.amrapRound && row.amrapRound > 1 ? 's' : ''
                          }${row.amrapRep !== 0 ? ` + ${row.amrapRep}` : ``}`
                        : `${row.forTimeMinute} : ${
                            row.forTimeSecond! < 10 ? `0${row.forTimeSecond}` : row.forTimeSecond
                          }`}
                    </TableCell>

                    <TableCell align="right">
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                          (index === 0 && 'primary') ||
                          (index === 1 && 'info') ||
                          (index === 2 && 'success') ||
                          (index === 3 && 'warning') ||
                          'error'
                        }
                      >
                        Top {index + 1}
                      </Label>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <Typography>No record has been uploaded yet!</Typography>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      {wod?.records && wod?.records.length > 0 ? (
        <>
          <Divider />

          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button
              size="small"
              color="inherit"
              endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
            >
              View All
            </Button>
          </Box>
        </>
      ) : null}

      {/* new record modal */}
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
        <WodNewRecordForm onCancel={handleCloseModal} />
      </DialogAnimate>
    </Card>
  );
}
