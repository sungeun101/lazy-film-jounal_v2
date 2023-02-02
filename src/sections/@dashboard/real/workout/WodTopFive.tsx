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
} from '@mui/material';
// _mock_
import { _ecommerceBestSalesman } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Scrollbar from '../../../../components/Scrollbar';
import Iconify from 'src/components/Iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useState } from 'react';
import { DialogAnimate } from 'src/components/animate';
import WodNewRecordForm from './WodNewRecordForm';
import WodNewForm from './WodNewForm';

// ----------------------------------------------------------------------

export default function WodTopFive() {
  const theme = useTheme();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => {
    console.log('hi');
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

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
            New Record
          </Button>
        }
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Athelete</TableCell>
                <TableCell>Score</TableCell>
                <TableCell align="right">Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_ecommerceBestSalesman.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={row.name} src={row.avatar} />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2"> {row.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {row.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="right">
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (row.rank === 'Top 1' && 'primary') ||
                        (row.rank === 'Top 2' && 'info') ||
                        (row.rank === 'Top 3' && 'success') ||
                        (row.rank === 'Top 4' && 'warning') ||
                        'error'
                      }
                    >
                      {row.rank}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

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

      {/* new record modal */}
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal} fullScreen>
        <WodNewRecordForm onCancel={handleCloseModal} />
      </DialogAnimate>
    </Card>
  );
}
