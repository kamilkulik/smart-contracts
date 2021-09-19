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
});
