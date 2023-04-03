import { FC } from 'react';
import { convertToRows, TableData } from '@utils/data-format';
import { DataGrid, GridColDef, GridColumnGroup, GridAlignment } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';
import { Ethnicity, EthnicityDisplayNames } from '@utils/ethnicity';
import { Gender, GenderDisplayNames } from '@utils/gender';

const POSITION_WIDTH = 200;
const COLUMN_WIDTH = 90;
const HEIGHT = 400;

type CustomGridColDef = GridColDef & {
  headerAlign?: GridAlignment;
};

const columns: CustomGridColDef[] = [
  {
    field: 'position',
    width: POSITION_WIDTH,
    sortable: false,
    headerName: '',
    cellClassName: 'position-cell',
    headerAlign: 'center',
    type: 'custom'
  },
  ...Object.values(Ethnicity)
    .map((e) => [
      {
        field: `${e}F`,
        headerName: GenderDisplayNames[Gender.Female],
        width: COLUMN_WIDTH,
        sortable: false,
        headerAlign: 'center' as GridAlignment,
        type: 'custom'
      },
      {
        field: `${e}M`,
        headerName: GenderDisplayNames[Gender.Male],
        width: COLUMN_WIDTH,
        sortable: false,
        headerAlign: 'center' as GridAlignment,
        type: 'custom'
      },
      {
        field: `${e}NB`,
        headerName: GenderDisplayNames[Gender.NonBinary],
        width: COLUMN_WIDTH,
        sortable: false,
        headerAlign: 'center' as GridAlignment,
        type: 'custom'
      }
    ])
    .flat()
];

const columnGroupingModel: GridColumnGroup[] = Object.values(Ethnicity).map((e) => ({
  groupId: EthnicityDisplayNames[e],
  children: [{ field: `${e}M` }, { field: `${e}F` }, { field: `${e}NB` }],
  headerAlign: 'center' as GridAlignment // Add this line
}));

export interface TableProps {
  data?: TableData;
}

export const Table: FC<TableProps> = ({ data }) => {
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
        columnGroupingModel={columnGroupingModel}
        rows={convertToRows(data)}
        columns={columns}
        getRowId={(row) => row.position}
        getRowHeight={() => 'auto'}
        showCellVerticalBorder={true}
        showColumnVerticalBorder={true}
      />
    </Box>
  );
};
