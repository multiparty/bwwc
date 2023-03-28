import React, {FC} from 'react';
import { Box, useTheme, Collapse, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroup, GridColumnGroupingModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

var data:Submission[] = []

// Example usage
const newSubmission: Submission = {
  industry: 'Information Technology',
  participationID:  'dd34567833',
  size: 'Medium (50-199 employees)',
  hist: '2022-03-12 12:34',
};
data.push(newSubmission);

const newSubmission2: Submission = {
  industry: 'Information Technology',
  participationID:  'dd34567833',
  size: 'Medium (50-199 employees)',
  hist: '2022-03-12 12:34',
};
data.push(newSubmission2);

const newSubmission3: Submission = {
  industry: 'Biotech/Pharmaceuticals',
  participationID:  '1234567833',
  size: 'Medium (50-199 employees)',
  hist: '2022-03-12 12:34',
};
data.push(newSubmission3);


const COLUMN_WIDTH = 90;
const HEIGHT = 400;

interface Submission {
  participationID: string;
  industry: string;
  size:string;
  hist: string;
}

const columns: GridColDef[] = [
  {
    field: 'participationID',
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: '',
  },

  {
    field: 'industry',
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: '',
  },
  {
    field: 'size',
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: '',
  },
  {
    field: 'hist',
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: '',
  }
]


interface TableProps {
  data?: Submission;
}

export const sessionManageTable: FC<TableProps> = () => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        height: HEIGHT,
        width: '100%',
        '& .position-cell': {
          backgroundColor: palette.background.paper,
          fontWeight: 'bold'
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
        experimentalFeatures={{ columnGrouping: true }}
        rows={convertToRows(data)}
        columns={columns}
        getRowId={(row) => row.position}
        getRowHeight={() => 'auto'}
      />
    </Box>
  );
};
