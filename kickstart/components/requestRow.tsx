import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Request } from '../pages/campaigns/[show]/requests';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

type RequestRowProps = {
  address: string;
  approversCount: number;
  id: number;
  key: number;
  request: Request;
};

const RequestRow: React.FunctionComponent<RequestRowProps> = ({
  address,
  approversCount,
  id,
  key,
  request,
}: RequestRowProps) => {
  const { Cell, Row } = Table;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  const onApprove = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(address);
      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onFinalize = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(address);
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button basic color="green" onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button basic color="teal" onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
