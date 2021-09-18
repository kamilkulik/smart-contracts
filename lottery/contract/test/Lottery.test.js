const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery, accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

// WHAT BEHAVIOUR do we really care in this contract?

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]); // right address is in that array
    assert.equal(1, players.length); // one record inside the array
  });

  it('allows multiple account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]); // right address is in that array
    assert.equal(accounts[1], players[1]); // right address is in that array
    assert.equal(accounts[2], players[2]); // right address is in that array
    assert.equal(3, players.length); // one record inside the array
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200,
      });
      assert(false); // if above doesn't throw an error, this test should fail
    } catch (er) {
      assert(er); // checking if there is an error in case of enter method failing
    }
  });

  it('only manager can call pickWinner()', async () => {
    // no need to enter into lottery
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (er) {
      assert(er);
    }
  });

  it('sends money to the winner and resets the winenrs array', async () => {
    // entering with accounts[0] for 1 ETH
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether'),
    });
    // getting initial BALANCE of that accounts[0] address
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    // pickWinner(), return eth to the winner
    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    // gas is needed to process the transaction on the network
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei('0.99', 'ether'));
  });

  it('players array is emptied out after a winner is picked', async () => {
    // entering with accounts[0] for 1 ETH
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether'),
    });
    // picking a winner
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    // checking players array length
    const playersArray = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.equal(0, playersArray.length);
  });

  it('amount of ETH in contract after picking a winner is 0', async () => {
    // entering with accounts[1] for 1 ETH
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether'),
    });
    // picking a winner
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    // getting contract value
    const contractAcc = lottery.options.address;
    const contractAccBalance = await web3.eth.getBalance(contractAcc);

    assert.equal(0, contractAccBalance);
  });
});
