import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';

const CampaignShow: React.FunctionComponent = () => {
  const router = useRouter();
  const { show } = router.query;
  return (
    <Layout>
      <h3>{`Campaign: ${show}`}</h3>
    </Layout>
  );
};

export default CampaignShow;
