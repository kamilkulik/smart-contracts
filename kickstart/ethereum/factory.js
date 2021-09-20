import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// campaignFactory contract instance
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x74be888ba471C2fFcAAfcAE4E29930e2Afc648b3'
);

export default instance;
