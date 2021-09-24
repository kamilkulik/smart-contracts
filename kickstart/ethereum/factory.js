const web3 = require('./web3');
const CampaignFactory = require('./build/CampaignFactory.json');

// campaignFactory contract instance
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xF0C84A7Ecaf0Db282E86deC09936eb7DEf8BA69D'
);

module.exports = instance;
