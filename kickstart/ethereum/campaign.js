const web3 = require('./web3.js');
const Campaign = require('./build/Campaign.json');

const getContract = (address) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

export default getContract;
