import React from 'react';
import Layout from '../../../components/layout';
import Link from 'next/link';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/requestRow';

export type Request = {
  approvalCount: number;
  complete: boolean;
  description: string;
  recipient: string;
  value: string;
};

export async function getServerSideProps({ params: { show: address } }) {
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  let mappedRequests: Request[] = [];
  if (requestCount > 0) {
    const requests = await Promise.all(
      Array(requestCount)
        .fill(0)
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    mappedRequests = requests.map(({ approvalCount, complete, description, recipient, value }) => {
      return { approvalCount, complete, description, recipient, value };
    });
  }

  return { props: { address, approversCount, mappedRequests, requestCount } };
}

const RequestIndexPage = ({ address, approversCount, mappedRequests, requestCount }) => {
  const { Body, HeaderCell, Header, Row } = Table;

  const renderRows = () => {
    return mappedRequests.map((request, index) => {
      return <RequestRow address={address} approversCount={approversCount} id={index} key={index} request={request} />;
    });
  };

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
        <Body>{renderRows()}</Body>
      </Table>
    </Layout>
  );
};

export default RequestIndexPage;
