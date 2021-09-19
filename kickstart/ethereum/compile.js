const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // looks at the folder and deletes everything inside of it

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

//using solidity compiler to compile everything found in source
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath); // checks if dir exists and if none found creates one for us

for (let contract in output) {
  fs.outputJSONSync(path.resolve(buildPath, contract.replace(':', '') + '.json'), output[contract]);
}
