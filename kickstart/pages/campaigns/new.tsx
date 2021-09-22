import React, { useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState<string>('');

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setMinimumContribution(e.currentTarget.value);
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    await factory.methods.createCampaign(minimumContribution).send({
      from: accounts[0],
    });
  };

  return (
    <Layout>
      <h3>Create a new campaign</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            onChange={handleInput}
            placeholder="minimum amount in Wei"
            value={minimumContribution}
          />
        </Form.Field>

        <Button primary type="submit">
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
