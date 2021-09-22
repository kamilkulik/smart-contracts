import React, { ReactElement, ReactNode } from 'react';
import factory from '../ethereum/factory';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/layout';

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
}

function CampaignIndex({ campaigns }: { campaigns: string[] }) {
  const renderCampaigns = (): ReactNode => {
    const items = campaigns.map((campaign) => {
      return (
        <Card fluid key={campaign}>
          <Card.Content>
            <Card.Header>{campaign}</Card.Header>
            <Card.Description>
              <a>View Campaign</a>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    });
    return <Card.Group>{items}</Card.Group>;
  };

  return (
    <React.Fragment>
      <h3>Open Campaigns</h3>
      <Button content="Create Campaign" floated="right" icon="add circle" primary />
      {renderCampaigns()}
    </React.Fragment>
  );
}

CampaignIndex.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CampaignIndex;
