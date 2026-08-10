
'use client';

import { format } from 'date-fns';
import { getSubmissions, Submission } from '../../lib/validatorApi';
import { useQuery } from '@tanstack/react-query';
import { Button, Table, TableBody, TableContainer, TableHead, TableCell, Paper, TableRow } from '@mui/material';
import {useRouter} from 'next/navigation';

function orderSubmissionsByDate(submissions: Submission[]): Submission[] {
  return submissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

function SubmissionTable() {
  const userRouter = useRouter();

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    select: orderSubmissionsByDate,
  });


  if (submissions.length === 0) {
    return <p>No submissions found</p>;
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: 1200, tableLayout: 'fixed' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell align="center">File Name</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center" sx={{ width: 200 }}>Created At</TableCell>
            <TableCell align="center">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((row) => (
            <TableRow
              key={`${row.student_name}-${row.created_at}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.student_name}
              </TableCell>
              <TableCell align="left">
                {row.file_name}
              </TableCell>
              <TableCell align="center">
                <span className={
                  `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'SUCCESS'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`
                }>
                  {row.status}
                </span>
              </TableCell>
              <TableCell align="center">
                {format(new Date(row.created_at), 'dd-MM-yyyy HH:mm:ss')}
              </TableCell>
              <TableCell align="center">
                <Button variant="outlined" size="small" onClick={()=> userRouter.push(`/submissions/${row.id}`)}>Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SubmissionTable;