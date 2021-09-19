const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/CampaignFactory.json');
const compiledCampaign = require('../build/Campaign.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // use contract constructor part of web3 lib
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // constructor accepts js obj
    .deploy({ data: compiledFactory.bytecode }) // pass in compiled ABI
    .send({ from: accounts[0], gas: '1000000' }); // deploy it and send transaction to the network

  // let's create a Campaign from the get go here to have it available in every test
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000',
  });

  // using faactory to get deployed campaigns to access address of the above campaign contract
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  // we now need a local JS representation of the contract
  // the contract was already deployed so we just pass in the interface
  // and the address of the contract
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '1',
        from: accounts[0],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
      from: accounts[0],
      gas: '1000000',
    });
    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods.createRequest('Buy batteries', web3.utils.toWei('5', 'ether'), accounts[1]).send({
      from: accounts[0],
      gas: '1000000',
    });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    console.log(balance);
    assert(balance > 104);
  });
});
