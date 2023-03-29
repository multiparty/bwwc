import { Box, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Example usage
var data: Submission[] = [];

const newSubmission: Submission = {
  industry: 'Information Technology',
  participationID: '12345678912345678912345678',
  size: 'Medium (50-199 employees)',
  hist: '2022-02-12 12:34'
};
data.push(newSubmission);

const newSubmission2: Submission = {
  industry: 'Information Technology',
  participationID: '1234567891ddd5678912345678',
  size: 'Medium (50-199 employees)',
  hist: '2022-03-12 12:34'
};
data.push(newSubmission2);

const newSubmission3: Submission = {
  industry: 'Biotech/Pharmaceuticals',
  participationID: '12345678912345678912345578',
  size: 'Medium (50-199 employees)',
  hist: '2022-03-12 15:34'
};
data.push(newSubmission3);

const COLUMN_WIDTH = 190;
const WIDE_WIDTH = 250;
const HEIGHT = 400;

interface Submission {
  participationID: string;
  industry: string;
  size: string;
  hist: string;
}

const columns: GridColDef[] = [
  {
    field: 'participationID',
    width: WIDE_WIDTH,
    sortable: true,
    headerName: 'ParticipationID',
    cellClassName: 'position-cell'
  },

  {
    field: 'industry',
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: 'Industry',
    cellClassName: 'position-cell'
  },
  {
    field: 'size',
    width: WIDE_WIDTH,
    sortable: true,
    headerName: 'Size',
    cellClassName: 'position-cell'
  },
  {
    field: 'hist',
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: 'Submission',
    cellClassName: 'position-cell'
  }
];

function convertToRows(data: Submission[]): any[] {
  return data.map((submission, index) => {
    return {
      id: index + 1,
      participationID: submission.participationID,
      industry: submission.industry,
      size: submission.size,
      hist: submission.hist
    };
  });
}

export const SessionManageTable = () => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        height: HEIGHT,
        width: '100%',
        '& .position-cell': {
          backgroundColor: palette.background.paper
        }
      }}
    >
      <DataGrid
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        disableRowSelectionOnClick={true}
        disableVirtualization={true}
        hideFooter={true}
        hideFooterPagination={true}
        hideFooterSelectedRowCount={true}
        rows={convertToRows(data)}
        columns={columns}
        getRowId={(row) => row.id}
        getRowHeight={() => 'auto'}
      />
    </Box>
  );
};
