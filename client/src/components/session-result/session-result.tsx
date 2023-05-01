import { useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Stack, Tabs, Tab } from '@mui/material';
import { TableView } from './table-view';
import { AppState, ResultFormat, TabSelection,  DataFormat, StringDataFormatMap } from '@utils/data-format';
import { createCSV } from './to-xlsx';
import { useSelector } from 'react-redux';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function handleClick(result: ResultFormat) {
  createCSV(result);
}

export const SessionResult = () => {
  const { decodedTable } = useSelector((state: AppState) => state.session);
  const result = { 0: decodedTable.data as DataFormat, 1: decodedTable.metadata.companySize as StringDataFormatMap, 2: decodedTable.metadata.industry as StringDataFormatMap};
  const [value, setValue] = useState<TabSelection>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: TabSelection) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Card>
        <CardContent sx={{ m: 2 }}>
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h4">
              Result Data
            </Typography>
            <Grid container justifyContent="center">
              <Button
                variant="contained"
                sx={{ width: 300 }}
                onClick={() => {
                  handleClick(result);
                }}
              >
                Download File
              </Button>
            </Grid>
            <Box>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="All" {...a11yProps(value)} />
                <Tab label="Company Size" {...a11yProps(value)} />
                <Tab label="Industry" {...a11yProps(value)} />
              </Tabs>
            </Box>
          </Stack>
          <Divider sx={{ width: '98%' }} />
          <TabPanel value={value} index={value}>
            <Box>
              <TableView tabSelection={value} data={result} />
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};
