import { FC, useState } from 'react';
import { Box, Card, CardContent, Divider, Typography, Stack, Tabs, Tab } from '@mui/material';
import { ResultTable } from './result-table';
import { ToyResult } from '@constants/delete/toy-result';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
export const SessionResult: FC = () => {
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
            <Box>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="All" {...a11yProps(value)} />
                <Tab label="Large" {...a11yProps(value)} />
                <Tab label="Medium-Large" {...a11yProps(value)} />
                <Tab label="Medium" {...a11yProps(value)} />
                <Tab label="Small" {...a11yProps(value)} />
              </Tabs>
            </Box>
          </Stack>
          <Divider sx={{ width: '98%' }} />
          <TabPanel value={value} index={value}>
            <ResultTable data={ToyResult[value.toString()]} />
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};
