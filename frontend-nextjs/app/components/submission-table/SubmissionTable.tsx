import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns';
import { type Submission } from '../../api/validatorApi';


function SubmissionTable({ submissions }: { submissions: Submission[] }) {
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
            <TableCell align="center" sx={{ width: 400 }}>Result Execution</TableCell>
            <TableCell align="center" sx={{ width: 200 }}>Created At</TableCell>
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
              <TableCell align="left" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.result_execution}
              </TableCell>
              <TableCell align="center">
                {format(new Date(row.created_at), 'dd-MM-yyyy HH:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SubmissionTable;