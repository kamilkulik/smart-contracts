import { useRouter } from 'next/router';
import React, { useReducer, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import web3 from '../ethereum/web3';

type contributionProgressState = {
  error: string;
  loading: boolean;
};

type ContributeFormProps = {
  address: string;
};

const ContributeForm: React.FunctionComponent<ContributeFormProps> = ({ address }: ContributeFormProps) => {
  const router = useRouter();

  const contributionProgress: contributionProgressState = {
    error: '',
    loading: false,
  };

  const [contribution, setContribution] = useState<string>('');
  const [contributionSubmissionProgress, dispatch] = useReducer(
    (prevState: contributionProgressState, newState: Partial<contributionProgressState>) => ({
      ...prevState,
      ...newState,
    }),
    contributionProgress
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setContribution(e.currentTarget.value);
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const campaign = Campaign(address);

    try {
      dispatch({ error: '', loading: true });
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether'),
      });
      router.reload();
    } catch (err: any) {
      dispatch({ error: err.message });
      console.log(err.message);
    }
    dispatch({ loading: false });
  };

  return (
    <Form onSubmit={onSubmit} error={!!contributionSubmissionProgress.error}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input label="ether" labelPosition="right" onChange={handleInput} value={contribution}></Input>
      </Form.Field>
      <Message content={contributionSubmissionProgress.error} error header="Ooops" />
      <Button loading={contributionSubmissionProgress.loading} primary type="submit">
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
