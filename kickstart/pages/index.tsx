import React, { useCallback, useEffect } from 'react';
import factory from '../ethereum/factory';

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
}

function CampaignIndex({ campaigns }: { campaigns: string[] }) {
  return <h1>{campaigns[0]}</h1>;
}

export default CampaignIndex;
