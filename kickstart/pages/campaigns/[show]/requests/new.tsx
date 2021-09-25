import React, { useReducer } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import Campaign from '../../../../ethereum/campaign.js';
import web3 from '../../../../ethereum/web3';
import { Button, Form, Input, Message } from 'semantic-ui-react';

type NewRequestProgressState = {
  error: string;
  loading: boolean;
};

type NewRequestDetails = {
  amount: string;
  description: string;
  receipient: string;
};

const RequestNew: React.FunctionComponent = () => {
  const router = useRouter();
  const { show: campaignAddress } = router.query;

  const contributionProgress: NewRequestProgressState = {
    error: '',
    loading: false,
  };

  const newRequestDetails: NewRequestDetails = {
    amount: '',
    description: '',
    receipient: '',
  };

  const [requestDetails, setRequestDetail] = useReducer(
    (prevState: NewRequestDetails, newState: Partial<NewRequestDetails>) => ({
      ...prevState,
      ...newState,
    }),
    newRequestDetails
  );

  const [newRequestSubmissionProgress, dispatch] = useReducer(
    (prevState: NewRequestProgressState, newState: Partial<NewRequestProgressState>) => ({
      ...prevState,
      ...newState,
    }),
    contributionProgress
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inputName = e.currentTarget.name;
    const inputValue = e.currentTarget.value;
    setRequestDetail({ [inputName]: inputValue });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const campaign = Campaign(campaignAddress);

    try {
      dispatch({ error: '', loading: true });
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(requestDetails.amount, 'ether'),
      });
      router.reload();
    } catch (err: any) {
      dispatch({ error: err.message });
      console.log(err.message);
    }
    dispatch({ loading: false });
  };

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!newRequestSubmissionProgress.error}>
        <Form.Field>
          <label>Description</label>
          <Input onChange={handleInput} value={requestDetails.description}></Input>
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input label="ether" labelPosition="right" onChange={handleInput} value={requestDetails.description}></Input>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            label="address"
            labelPosition="right"
            onChange={handleInput}
            value={requestDetails.description}
          ></Input>
        </Form.Field>
        <Message content={newRequestSubmissionProgress.error} error header="Ooops" />
        <Button loading={newRequestSubmissionProgress.loading} primary type="submit">
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default RequestNew;
