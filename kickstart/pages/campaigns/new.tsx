import React, { useReducer, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

type creationProgress = {
  error: string;
  loading: boolean;
};

const CampaignNew = () => {
  const creationProgress: creationProgress = {
    error: '',
    loading: false,
  };
  const [minimumContribution, setMinimumContribution] = useState<string>('');
  const [campaignCreationProgress, dispatch] = useReducer(
    (prevState: creationProgress, newState: Partial<creationProgress>) => ({ ...prevState, ...newState }),
    creationProgress
  );
  const router = useRouter();

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setMinimumContribution(e.currentTarget.value);
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({ error: '', loading: true });
    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      router.push('/');
    } catch (err: any) {
      dispatch({ error: err.message });
    }
    dispatch({ loading: false });
  };

  return (
    <Layout>
      <h3>Create a new campaign</h3>
      <Form onSubmit={onSubmit} error={!!campaignCreationProgress.error}>
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
        <Message content={campaignCreationProgress.error} error header="Ooops" />
        <Button loading={campaignCreationProgress.loading} primary type="submit">
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
