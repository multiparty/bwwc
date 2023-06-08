import { FC, useEffect } from 'react';
import { convertToRows, TableData } from '@utils/data-format';
import { DataGrid, GridColDef, GridColumnGroup, GridAlignment, GridCellParams } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';
import { Ethnicity, EthnicityDisplayNames } from '@utils/ethnicity';
import { Gender, GenderDisplayNames } from '@utils/gender';
import './table.css';

const POSITION_WIDTH = 200;
const COLUMN_WIDTH = 90;
const HEIGHT = 400;

export type CustomGridColDef = GridColDef & {
  headerAlign?: GridAlignment;
};

export const columns: CustomGridColDef[] = [
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
  headerAlign: 'center' as GridAlignment
}));

export interface TableProps {
  data?: TableData;
  allowDecimal?: boolean;
}
export const Table: FC<TableProps> = ({ data, allowDecimal }) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        height: HEIGHT,
        width: '100%',
        '& .position-cell': {
          backgroundColor: palette.background.paper,
          fontWeight: 'bold'
        },
        boxShadow: 'inset -1em 0em 1em rgba(0, 0, 0, 0.25)'
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
        getCellClassName={(params: GridCellParams<any, any, number>) => {
          if (params.value < 0) {
            return 'highlight-red';
          } else if (typeof params.value !== 'number' || Number.isNaN(params.value)) {
            return 'highlight-red';
          } else if (!allowDecimal && params.value % 1 !== 0) {
            return 'highlight-red';
          }
          return '';
        }}
      />
    </Box>
  );
};
