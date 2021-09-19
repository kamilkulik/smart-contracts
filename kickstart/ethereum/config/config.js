const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const CONFIG = {
  ACCOUNT_MNEMONIC: process.env.ACCOUNT_MNEMONIC,
  INFURA_API: process.env.INFURA_API,
};

module.exports = CONFIG;
