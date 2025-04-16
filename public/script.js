

document.getElementById('chainIdSelect').dispatchEvent(new Event('change'));
document.getElementById('chainIdSelect').addEventListener('change', () => {
    const chainId = document.getElementById('chainIdSelect').value;
    rpcUrl = chainId;
});

let rpcUrl = 1; // Default to mainnet

document.getElementById('getStorageButton').addEventListener('click', async () => {
    const contractAddress = document.getElementById('contractAddress').value;
    const storageResult = document.getElementById('storageResult');

    try {
        const response = await fetch('/getContractStorage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contractAddress, rpcUrl })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.text();
        storageResult.innerHTML = formatStorageResult(result);
    } catch (error) {
        storageResult.textContent = `Error: ${error.message}`;
    }
});

document.getElementById('clearStorageButton').addEventListener('click', () => {
    document.getElementById('contractAddress').value = '';
    document.getElementById('storageResult').innerHTML = '';
});

document.getElementById('computeSlotButton').addEventListener('click', async () => {
    const variableType = document.getElementById('variableType').value;
    const key = document.getElementById('key').value;
    const slotNumber = document.getElementById('slotNumber').value;
    const slotResult = document.getElementById('slotResult');

    try {
        const response = await fetch('/computeSlot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ variableType, key, slotNumber })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        slotResult.textContent = result;
    } catch (error) {
        slotResult.textContent = `Error: ${error.message}`;
    }
});

document.getElementById('clearSlotButton').addEventListener('click', () => {
    document.getElementById('variableType').value = '';
    document.getElementById('key').value = '';
    document.getElementById('slotNumber').value = '';
    document.getElementById('slotResult').innerHTML = '';
});

document.getElementById('getBytecodeButton').addEventListener('click', async () => {
    const bytecodeAddress = document.getElementById('bytecodeAddress').value;
    const bytecodeResult = document.getElementById('bytecodeResult');

    try {
        const response = await fetch('/getBytecode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bytecodeAddress, rpcUrl })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.text();
        bytecodeResult.textContent = result;
    } catch (error) {
        bytecodeResult.textContent = `Error: ${error.message}`;
    }
});

document.getElementById('clearBytecodeButton').addEventListener('click', () => {
    document.getElementById('bytecodeAddress').value = '';
    document.getElementById('bytecodeResult').innerHTML = '';
});

document.getElementById('bytecodeResult').addEventListener('click', () => {
    copyToClipboard('bytecodeResult');
});

document.getElementById('convertToHexButton').addEventListener('click', () => {
    const intInput = document.getElementById('intInput').value;
    const hexResult = document.getElementById('hexResult');
    const hexValue = BigInt(intInput).toString(16);
    hexResult.textContent = hexValue;
});

document.getElementById('clearHexButton').addEventListener('click', () => {
    document.getElementById('intInput').value = '';
    document.getElementById('hexResult').innerHTML = '';
});

document.getElementById('hexResult').addEventListener('click', () => {
    copyToClipboard('hexResult');
});

document.getElementById('convertToIntButton').addEventListener('click', () => {
    const hexInput = document.getElementById('hexInput').value;
    const intResult = document.getElementById('intResult');
    const intValue = BigInt(hexInput).toString(10);
    intResult.textContent = intValue;
});

document.getElementById('clearIntButton').addEventListener('click', () => {
    document.getElementById('hexInput').value = '';
    document.getElementById('intResult').innerHTML = '';
});

document.getElementById('intResult').addEventListener('click', () => {
    copyToClipboard('intResult');
});

document.getElementById('padTo32BytesButton').addEventListener('click', () => {
    const padInput = document.getElementById('padInput').value;
    const padResult = document.getElementById('padResult');
    const paddedValue = padInput.padStart(64, '0');
    padResult.textContent = `0x${paddedValue}`;
});

document.getElementById('clearPadButton').addEventListener('click', () => {
    document.getElementById('padInput').value = '';
    document.getElementById('padResult').innerHTML = '';
});

document.getElementById('padResult').addEventListener('click', () => {
    copyToClipboard('padResult');
});

document.getElementById('addZerosButton').addEventListener('click', () => {
    const addZerosInput = document.getElementById('addZerosInput').value;
    const addZerosResult = document.getElementById('addZerosResult');
    const result = `${addZerosInput}${'0'.repeat(18)}`;
    addZerosResult.textContent = result;
});

document.getElementById('clearAddZerosButton').addEventListener('click', () => {
    document.getElementById('addZerosInput').value = '';
    document.getElementById('addZerosResult').innerHTML = '';
});

document.getElementById('addZerosResult').addEventListener('click', () => {
    copyToClipboard('addZerosResult');
});

document.addEventListener('DOMContentLoaded', () => {
    const initialContract = document.querySelector('.contract');
    addContractButtonListeners(initialContract);
});

document.getElementById('addNewContractButton').addEventListener('click', () => {
    const contractsContainer = document.getElementById('contractsContainer');
    const contractDiv = document.createElement('div');
    contractDiv.className = 'contract';
    contractDiv.innerHTML = `
        <div class="contract-header">
            <span>Contract</span>
            <div>
                <button class="addContractButton">Add</button>
                <button class="removeContractButton">Remove</button>
            </div>
        </div>
        <div class="contract-body">
            <input type="text" class="contractAddress" placeholder="Enter Contract Address">
            <input type="text" class="contractBytecode" placeholder="Enter Contract Bytecode">
            <input type="text" class="contractBalance" placeholder="Enter Balance">
            <input type="text" class="contractNonce" placeholder="Enter Nonce">
            <div class="storageContainer">
                <div class="storagePair">
                    <input type="text" class="storageKey" placeholder="Enter Storage Key">
                    <input type="text" class="storageValue" placeholder="Enter Storage Value">
                </div>
            </div>
            <button class="addStorageButton">Add New Storage Key-Value Pair</button>
        </div>
    `;
    contractsContainer.appendChild(contractDiv);
    addContractButtonListeners(contractDiv);
});

function addContractButtonListeners(contractDiv) {
    const contractHeader = contractDiv.getElementsByClassName('contract-header')[0];
    const addContractButton = contractDiv.getElementsByClassName('addContractButton')[0];
    const removeContractButton = contractDiv.getElementsByClassName('removeContractButton')[0];
    const contractBody = contractDiv.getElementsByClassName('contract-body')[0];
    const addStorageButton = contractDiv.getElementsByClassName('addStorageButton')[0];

    contractHeader.addEventListener('click', () => {
        contractBody.style.display = contractBody.style.display === 'none' ? 'block' : 'none';
    });

    addContractButton.addEventListener('click', () => {
        const contractAddress = contractDiv.getElementsByClassName('contractAddress')[0].value;
        const addedContracts = document.getElementById('addedContracts');
        const contractText = document.createElement('div');
        contractText.textContent = contractAddress;
        addedContracts.appendChild(contractText);

        addContractButton.textContent = 'Added';
        addContractButton.disabled = true;
        addContractButton.classList.add('disabled');
        contractBody.style.display = 'none';
    });

    removeContractButton.addEventListener('click', () => {
        contractDiv.remove();
    });

    addStorageButton.addEventListener('click', () => {
        const storageContainer = contractDiv.getElementsByClassName('storageContainer')[0];
        const storagePair = document.createElement('div');
        storagePair.className = 'storagePair';
        storagePair.innerHTML = `
            <input type="text" class="storageKey" placeholder="Enter Storage Key">
            <input type="text" class="storageValue" placeholder="Enter Storage Value">
        `;
        storageContainer.appendChild(storagePair);
    });
}

document.getElementById('generateJsonButton').addEventListener('click', () => {
    const contractsContainer = document.getElementById('contractsContainer');
    const contracts = contractsContainer.getElementsByClassName('contract');
    const accounts = {};

    for (const contract of contracts) {
        const address = contract.getElementsByClassName('contractAddress')[0].value;
        const bytecode = contract.getElementsByClassName('contractBytecode')[0].value;
        const balance = contract.getElementsByClassName('contractBalance')[0].value;
        const nonce = contract.getElementsByClassName('contractNonce')[0].value;
        const storage = {};

        const storageContainers = contract.getElementsByClassName('storageContainer');
        for (const storageContainer of storageContainers) {
            const key = storageContainer.getElementsByClassName('storageKey')[0].value;
            const value = storageContainer.getElementsByClassName('storageValue')[0].value;
            if (key && value) {
                storage[key] = value;
            }
        }

        accounts[address] = {
            nonce: parseInt(nonce, 10),
            balance: balance,
            code: bytecode,
            storage: storage
        };
    }

    const jsonState = JSON.stringify({ accounts: accounts }, null, 2);
    const jsonResult = document.getElementById('jsonResult');
    jsonResult.textContent = jsonState;
});

document.getElementById('clearStateButton').addEventListener('click', () => {
    document.getElementById('contractsContainer').innerHTML = `
        <div class="contract">
            <div class="contract-header">
                <span>Contract</span>
                <button class="addContractButton">Add</button>
                <button class="removeContractButton" disabled>Remove</button>
            </div>
            <div class="contract-body">
                <input type="text" class="contractAddress" placeholder="Enter Contract Address">
                <input type="text" class="contractBytecode" placeholder="Enter Contract Bytecode">
                <input type="text" class="contractBalance" placeholder="Enter Balance">
                <input type="text" class="contractNonce" placeholder="Enter Nonce">
                <div class="storageContainer">
                    <input type="text" class="storageKey" placeholder="Enter Storage Key">
                    <input type="text" class="storageValue" placeholder="Enter Storage Value">
                </div>
            </div>
        </div>
    `;
    document.getElementById('jsonResult').innerHTML = '';
    document.getElementById('addedContracts').innerHTML = '';
    addContractButtonListeners(document.querySelector('.contract'));
});

document.getElementById('jsonResult').addEventListener('click', () => {
    copyToClipboard('jsonResult');
});

document.getElementById('downloadJsonButton').addEventListener('click', () => {
    const jsonResult = document.getElementById('jsonResult').textContent;
    const blob = new Blob([jsonResult], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state.json';
    a.click();
    URL.revokeObjectURL(url);
});

function addStorageButtonListener(contractDiv) {
    const addStorageButton = contractDiv.getElementsByClassName('addStorageButton')[0];
    addStorageButton.addEventListener('click', () => {
        const storageContainer = document.createElement('div');
        storageContainer.className = 'storageContainer';
        storageContainer.innerHTML = `
            <input type="text" class="storageKey" placeholder="Enter Storage Key">
            <input type="text" class="storageValue" placeholder="Enter Storage Value">
        `;
        contractDiv.appendChild(storageContainer);
        addStorageButtonListener(storageContainer);
    });
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    navigator.clipboard.writeText(element.textContent).then(() => {
        showTooltip(element, 'Copied!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;

    setTimeout(() => {
        tooltip.remove();
    }, 2000);
}

function formatStorageResult(result) {
    const rows = result.split('\n').filter(row => row.trim().length > 0);
    let table = '<table><thead><tr><th>Name</th><th>Type</th><th>Slot</th><th>Offset</th><th>Bytes</th><th>Value</th><th>Hex Value</th><th>Contract</th></tr></thead><tbody>';

    let headersAdded = false;
    rows.forEach(row => {
        if (row.startsWith('|')) {
            const columns = row.split('|').map(col => col.trim()).filter(col => col.length > 0);
            if (columns.length === 8) {
                if (!headersAdded) {
                    headersAdded = true;
                } else {
                    table += '<tr>';
                    columns.forEach(col => {
                        table += `<td>${col}</td>`;
                    });
                    table += '</tr>';
                }
            }
        }
    });

    table += '</tbody></table>';
    return table;
}