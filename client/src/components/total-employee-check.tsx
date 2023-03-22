import { FC } from 'react';
import { TotalEmployees } from '@utils/data-format';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';

const COLUMN_WIDTH = 120;
const HEIGHT = 90;

export interface TotalEmployeeCheckProps {
  data?: TotalEmployees;
}

const columns: GridColDef[] = [
  { field: 'F', headerName: 'Female', width: COLUMN_WIDTH, sortable: false },
  { field: 'M', headerName: 'Male', width: COLUMN_WIDTH, sortable: false },
  { field: 'NB', headerName: 'Non-Binary', width: COLUMN_WIDTH, sortable: false },
  { field: 'all', headerName: 'Total', width: COLUMN_WIDTH, sortable: false }
];

export const TotalEmployeeCheck: FC<TotalEmployeeCheckProps> = ({ data }) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        height: HEIGHT,
        width: 'auto',
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
        rows={data ? [data] : []}
        columns={columns}
        getRowId={(row) => row.M}
        getRowHeight={() => 'auto'}
      />
    </Box>
  );
};
