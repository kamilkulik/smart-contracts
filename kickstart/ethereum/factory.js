const web3 = require('./web3');
const CampaignFactory = require('./build/CampaignFactory.json');

// campaignFactory contract instance
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x4F11b79d07bD121c923d72719DFb6aDd9b38fd54'
);

module.exports = instance;
