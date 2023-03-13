import * as React from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface HistoryItem {
  Id: string;
  time: string;
}

interface Submission {
  name: string;
  hist: HistoryItem[];
}

interface RowData {
  name: string;
  history: HistoryItem[];
}

const rows: RowData[] = [];

function createData(submission: Submission): RowData {
  return {
    name: submission.name,
    history: submission.hist
  };
}

function addSubmission(submission: Submission) {
  const existingRow = rows.find((row) => row.name === submission.name);
  if (existingRow) {
    // If a row with the same name already exists, update its history
    existingRow.history.push(...submission.hist);
  } else {
    // Otherwise, create a new row with the given submission
    const newRow = createData(submission);
    rows.push(newRow);
  }
}

// Example usage
const newSubmission: Submission = {
  name: 'Administrative Services',
  hist: [
    {
      Id: '1234567890',
      time: '2022-03-12 12:34'
    }
  ]
};
addSubmission(newSubmission);

const newSubmission2: Submission = {
  name: 'Administrative Services',
  hist: [
    {
      Id: '1234567830',
      time: '2022-03-12 12:34'
    }
  ]
};
addSubmission(newSubmission2);

const newSubmission3: Submission = {
  name: 'Biotech/Pharmaceuticals',
  hist: [
    {
      Id: '1234567833',
      time: '2022-03-12 12:34'
    }
  ]
};
addSubmission(newSubmission3);

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.Id}>
                      <TableCell>{historyRow.Id}</TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Industry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
