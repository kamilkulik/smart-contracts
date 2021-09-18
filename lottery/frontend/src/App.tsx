import React, { useCallback, useEffect, useReducer, useState } from 'react';
import lottery from './lottery';
import web3 from './web3';

type ContractDetails = {
  balance: string;
  manager: string;
  players: [];
};

const App = () => {
  const contractDetails: ContractDetails = {
    balance: '',
    manager: '',
    players: [],
  };
  const [contract, dispatch] = useReducer(
    (state: ContractDetails, newState: Partial<ContractDetails>) => ({ ...state, ...newState }),
    contractDetails
  );
  const [etherForEntry, setEtherForEntry] = useState('');
  const [message, setMessage] = useState('');

  const getDetails = useCallback(async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    dispatch({ manager, players, balance });
  }, []);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting for transaction success');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(etherForEntry, 'ether'),
    });

    setMessage('You have entered');
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {contract.manager}</p>
      <p>
        There are currently {contract.players.length} people entered competing to win{' '}
        {web3.utils.fromWei(contract.balance, 'ether')}
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input onChange={(e) => setEtherForEntry(e.target.value)} value={etherForEntry} />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h1>{message}</h1>
    </div>
  );
};

export default App;
