import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';

type ContractSummaryProps = {
  props: ContractSummary;
};

type ContractSummary = {
  minimumContribution: string;
  contractBalance: string;
  pendingRequests: string;
  contributorsCount: string;
  contractManager: string;
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
      minimumContribution: minimumContribution,
      contractBalance: contractBalance,
      pendingRequests: pendingRequests,
      contributorsCount: contributorsCount,
      contractManager: contractManager,
    },
  };
};

const CampaignShow: React.FunctionComponent<ContractSummary> = ({
  minimumContribution,
  contractBalance,
  pendingRequests,
  contributorsCount,
  contractManager,
}) => {
  const router = useRouter();
  const { show } = router.query;

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
      <h3>{`Campaign: ${show}`}</h3>
      {renderCards()}
    </Layout>
  );
};

export default CampaignShow;
