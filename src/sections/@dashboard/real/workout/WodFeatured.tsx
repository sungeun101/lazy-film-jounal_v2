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
} from '@mui/material';
import Label from 'src/components/Label';
import Scrollbar from 'src/components/Scrollbar';
import useSWR from 'swr';
import { IRecord } from './WodNewForm';

// ----------------------------------------------------------------------

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  dailyScoreSubmit: number;
  rank: number;
}

export default function WodFeatured() {
  const { data } = useSWR(`/api/users/featured`);
  console.log('featured users data', data);

  return (
    <Card>
      <CardHeader title="Featured" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 420, minHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Athelete</TableCell>
                <TableCell align="center">Ranking Points</TableCell>
                <TableCell align="center">Score Submit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.topFiveUsers && data?.topFiveUsers.length > 0 ? (
                data.topFiveUsers.map((row: IUser, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.name} src={row.avatar ?? ''} />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle2"> {row.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align="center">{Math.abs(row.rank)}</TableCell>

                    <TableCell align="center">{Math.abs(row.dailyScoreSubmit)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>No record has been uploaded yet!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
