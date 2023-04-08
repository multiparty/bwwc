import { FC, useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Stack, Tabs, Tab } from '@mui/material';
import { TableView } from './table-view';
import { ToyResult } from '@constants/delete/toy-result';
import { toyresultDataA } from '@constants/delete/toy-result-dataA';
import { ResultTable } from './result-table';
import { ResultFormat } from '@utils/data-format';

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

function handleClick(result:ResultFormat) {
  console.log(result)
}

export const SessionResult: FC = (result:ResultFormat) => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
                DownLoad FIle
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
            <Box>{value == 0 ? <ResultTable data={toyresultDataA} /> : <TableView tabSelection={value} data={ToyResult[value.toString()]} />}</Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};
