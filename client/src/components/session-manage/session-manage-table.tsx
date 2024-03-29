import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getSubmissionHistory } from '@services/api';
import { useSelector } from 'react-redux';
import { AppState } from '@utils/data-format';

const COLUMN_WIDTH = 250;
const SMALL_COLUMN_WIDTH = 150;
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
    width: COLUMN_WIDTH,
    sortable: true,
    headerName: 'ParticipationID',
    cellClassName: 'position-cell'
  },

  {
    field: 'industry',
    width: SMALL_COLUMN_WIDTH,
    sortable: true,
    headerName: 'Industry',
    cellClassName: 'position-cell'
  },
  {
    field: 'size',
    width: SMALL_COLUMN_WIDTH,
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

export const SessionManageTable = () => {
  const { palette } = useTheme();
  const { sessionId, authToken } = useSelector((state: AppState) => state.session);
  const data: Submission[] = [];
  const [histData, setHistData] = useState(data);

  useEffect(() => {
    async function updateSubmissionHistory() {
      const SubmissionHistory: any = await getSubmissionHistory(sessionId, authToken);
      if (SubmissionHistory.data.length > 0) {
        const newData = Object.values(SubmissionHistory.data).map((val: any) => ({
          industry: val.industry,
          participationID: val.participantCode,
          size: val.companySize,
          hist: new Date(val.timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h12'
          })
        }));

        let updatedData = [...histData];
        newData.forEach((newItem) => {
          const existingItemIndex = updatedData.findIndex((item) => item.participationID === newItem.participationID);

          if (existingItemIndex !== -1) {
            const existingItem = updatedData[existingItemIndex];
            // Check if there are any changes in other elements and Update the existing item in histData
            if (existingItem.industry !== newItem.industry || existingItem.size !== newItem.size) {
              updatedData[existingItemIndex] = {
                ...newItem
              };
            }
          } else {
            updatedData.push(newItem);
          }
        });

        setHistData(updatedData);
      }
    }
    if (sessionId) {
      const intervalId = setInterval(() => {
        updateSubmissionHistory();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [sessionId]);

  return (
    <Box
      sx={{
        minHeight: HEIGHT,
        height: 'auto',
        width: '85%',
        overflow: 'hidden',
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
        rows={histData}
        columns={columns}
        getRowId={(row) => row.participationID}
        getRowHeight={() => 'auto'}
        autoHeight={true}
      />
    </Box>
  );
};
