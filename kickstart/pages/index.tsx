import React, { useCallback, useEffect } from 'react';
import factory from '../ethereum/factory';

function CampaignIndex() {
  const loadUpData = useCallback(async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    console.log(campaigns);
  }, []);

  useEffect(() => {
    loadUpData;
  }, []);
  return <h1>Show</h1>;
}

export default CampaignIndex;
