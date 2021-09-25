import React, { useReducer } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import Campaign from '../../../../ethereum/campaign.js';
import web3 from '../../../../ethereum/web3';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Link from 'next/link';

type NewRequestProgressState = {
  error: string;
  loading: boolean;
};

type NewRequestDetails = {
  amount: string;
  description: string;
  recipient: string;
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
    recipient: '',
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
    console.log(inputName);
    const inputValue = e.currentTarget.value;
    console.log(inputValue);
    setRequestDetail({ [inputName]: inputValue });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const campaign = Campaign(campaignAddress);
    const { description, amount, recipient } = requestDetails;

    try {
      dispatch({ error: '', loading: true });
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.createRequest(description, web3.utils.toWei(amount, 'ether'), recipient).send({
        from: accounts[0],
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
      <Link href={`/campaigns/${campaignAddress}/requests`}>
        <a>
          <Button>Back</Button>
        </a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!newRequestSubmissionProgress.error}>
        <Form.Field>
          <label>Description</label>
          <Input name="description" onChange={handleInput} value={requestDetails.description}></Input>
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            name="amount"
            onChange={handleInput}
            value={requestDetails.amount}
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            label="address"
            labelPosition="right"
            name="recipient"
            onChange={handleInput}
            value={requestDetails.recipient}
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
