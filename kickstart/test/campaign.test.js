const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

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
