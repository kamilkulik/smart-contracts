import React from 'react';
import Layout from '../../../components/layout';
import Link from 'next/link';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';

export async function getServerSideProps({ params: { show: address } }) {
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestCount().call();
  const requests = await Promise.all(
    Array(requestCount)
      .fill(0)
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  const requestsJson = JSON.stringify(requests);
  return { props: { address, requestsJson, requestCount } };
}

const RequestIndexPage = ({ address, requestsJson, requestCount }) => {
  // const router = useRouter();
  // const { show: address } = router.query;

  const { Body, HeaderCell, Header, Row } = Table;

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary>Add Request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <HeaderCell>ID</HeaderCell>
          <HeaderCell>Description</HeaderCell>
          <HeaderCell>Amount</HeaderCell>
          <HeaderCell>Recipient</HeaderCell>
          <HeaderCell>Approval Count</HeaderCell>
          <HeaderCell>Approve</HeaderCell>
          <HeaderCell>Finalize</HeaderCell>
        </Header>
      </Table>
    </Layout>
  );
};

export default RequestIndexPage;
