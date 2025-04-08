const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const networks = {
    1: 'mainnet',
    59144: 'linea-mainnet',
    10: 'optimism-mainnet',
    42161: 'arbitrum-mainnet',
    43114: 'avalanche-mainnet',
    137: 'polygon-mainnet',
    11155111: 'sepolia',
};

const infuraKey = process.env.INFURA_PROJECT_ID;
const etherscanKey = process.env.ETHERSCAN_KEY;

app.post('/getContractStorage', (req, res) => {
    const { contractAddress, rpcUrl } = req.body;

    const chainName = networks[rpcUrl];
    const rpcUrlFull = `https://${chainName}.infura.io/v3/${infuraKey}`;

    const command = `cast storage ${contractAddress} --rpc-url=${rpcUrlFull} -e ${etherscanKey}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            res.status(500).send(`Stderr: ${stderr}`);
            return;
        }
        res.send(stdout);
    });
});

app.post('/getBytecode', (req, res) => {
    const { bytecodeAddress, rpcUrl } = req.body;

    const chainName = networks[rpcUrl];
    const rpcUrlFull = `https://${chainName}.infura.io/v3/${infuraKey}`;

    const command = `cast code ${bytecodeAddress} --rpc-url=${rpcUrlFull}`;
    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            res.status(500).send(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Command output: ${stdout}`);
        res.send(stdout.trim());
    });
});

app.post('/computeSlot', (req, res) => {
    const { variableType, key, slotNumber } = req.body;

    const command = `cast index ${variableType} ${key} ${slotNumber}`;
    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            res.status(500).send(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Command output: ${stdout}`);
        res.send(stdout.trim());
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});