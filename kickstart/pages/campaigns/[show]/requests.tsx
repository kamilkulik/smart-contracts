import React from 'react';
import Layout from '../../../components/layout';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';

const RequestIndexPage = () => {
  const router = useRouter();
  const { show: address } = router.query;

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary>Add Request</Button>
        </a>
      </Link>
    </Layout>
  );
};

export default RequestIndexPage;
