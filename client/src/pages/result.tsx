import { FC } from 'react';
import { AppState } from '@utils/data-format';
import { SessionResult } from '@components/session-result/session-result';
import { Layout } from '@layouts/layout';
import { useSelector } from 'react-redux';
import { DataFormat, StringDataFormatMap } from '@utils/data-format';

export const ResultPage: FC = () => {
  const { decodedTable } = useSelector((state: AppState) => state.session);
  const result = { 0: decodedTable.data as DataFormat, 1: decodedTable.metadata.companySize as StringDataFormatMap, 2: decodedTable.metadata.industry as StringDataFormatMap};

  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <SessionResult result={result} />
    </Layout>
  );
};
