import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/contributeForm';

type ContractSummaryProps = {
  props: ContractSummary;
};

type ContractSummary = {
  contractAddress: string;
  contractBalance: string;
  contractManager: string;
  contributorsCount: string;
  minimumContribution: string;
  pendingRequests: string;
};

export const getServerSideProps = async ({ params }): Promise<ContractSummaryProps> => {
  const campaign = Campaign(params.show);

  const {
    0: minimumContribution,
    1: contractBalance,
    2: pendingRequests,
    3: contributorsCount,
    4: contractManager,
  } = await campaign.methods.getSummary().call();

  return {
    props: {
      contractAddress: params.show,
      minimumContribution: minimumContribution,
      contractBalance: contractBalance,
      pendingRequests: pendingRequests,
      contributorsCount: contributorsCount,
      contractManager: contractManager,
    },
  };
};

const CampaignShow: React.FunctionComponent<ContractSummary> = ({
  contractAddress,
  contractBalance,
  contractManager,
  contributorsCount,
  minimumContribution,
  pendingRequests,
}) => {
  const renderCards = () => {
    const items = [
      {
        description: 'manager created this campaign and can create requests to withdraw money',
        header: contractManager,
        meta: 'address of manager',
        style: { overflowWrap: 'break-word' },
      },
      {
        description: 'You must contribute at least this much wei to become an approver',
        header: minimumContribution,
        meta: 'minimum contribution (wei)',
      },
      {
        description: 'A request trie to withdraw money from the contract. Requests must be approved by approvers',
        header: pendingRequests,
        meta: 'number of requests',
      },
      {
        description: 'Number of people who have already contributed to this campaign.',
        header: contributorsCount,
        meta: 'number of approvers',
      },
      {
        description: 'How much money this campaign has to spend',
        header: web3.utils.fromWei(contractBalance, 'ether'),
        meta: 'campaign balance (ETH)',
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>{`Campaign: ${contractAddress}`}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width="10">{renderCards()}</Grid.Column>
          <Grid.Column width="6">
            <ContributeForm address={contractAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${contractAddress}/requests`}>
              <a>
                <Button primary>Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default CampaignShow;
