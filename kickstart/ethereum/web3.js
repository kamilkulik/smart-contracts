const Web3 = require('web3');

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/be35448aebe541f3860bff9bb5f1e247');
  web3 = new Web3(provider);
}

module.exports = web3;
