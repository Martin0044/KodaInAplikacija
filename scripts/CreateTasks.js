
async function getTaskInfo() {
    let checkboxes = document.querySelectorAll(`#allDivTask1 input[type='checkbox']:checked`);
    const data = JSON.parse(fs.readFileSync(JSONfile));

    let etherscanAPIKey = JSON.parse(fs.readFileSync(JSONfile)).settings[0].EtherscanAPI
    if (!await isValidEtherscanApiKey(etherscanAPIKey)) {
        for (let i = 0; i < checkboxes.length; i++) {
            let task = document.getElementsByClassName(checkboxes[i].className);
            document.getElementById(`${task[0].id}Status`).innerHTML = `Invalid Etherscan API`
        }

        return
    }

    for (let i = 0; i < checkboxes.length; i++) {
        const Taskindex = data.tasks.findIndex(tasks => tasks.taskName === checkboxes[i].className);

        let task = document.getElementsByClassName(checkboxes[i].className);
        if (task[1].dataset.name == 'active') {
            return
        }

        task[1].dataset.name = 'active'
        let contractAddress = data.tasks[Taskindex].contractAddress.toLowerCase()
        let fun = data.tasks[Taskindex].function
        let parameters = data.tasks[Taskindex].parameters.split(';');
        let price = data.tasks[Taskindex].price
        let txCount = data.tasks[Taskindex].txCount
        let allGas = data.tasks[Taskindex].GasPrice.split('-');
        let walletNameToUse = data.tasks[Taskindex].WalletName

        const Walletindex = data.wallets.findIndex(wallet => wallet.WalletName.toLowerCase() === walletNameToUse.toLowerCase());
        let walletAddressToUse = data.wallets[Walletindex].Address;

        let ABI;
        if (getFileNames(ABIFolder).includes(`${contractAddress}.json`)) {
            ABI = fs.readFileSync(`${ABIFolder}/${contractAddress}.json`)
        }
        else if (getFileNames(ABIFolder).includes(`${contractAddress}.txt`)) {
            ABI = readFirstLine(`${ABIFolder}/${contractAddress}.txt`)
        }
        else {
            ABI = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanAPIKey}`)
            ABI = ABI.data.result
            if (ABI == 'Invalid Address format') {

                createTextFile(`${ABIFolder}/${contractAddress}.txt`, 'Invalid Address format')
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else if (ABI == 'Contract source code not verified') {
                createTextFile(`${ABIFolder}/${contractAddress}.txt`, 'Contract source code not verified')
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else {
                createJsonFile(`${ABIFolder}/${contractAddress}.json`, JSON.parse(ABI))
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        let delay = JSON.parse(fs.readFileSync(JSONfile)).settings[0].Delay
        console.log(contractAddress,fun,parameters,walletAddressToUse,allGas)
        prepareTx(contractAddress, Number(delay), fun, task, parameters, price, walletAddressToUse, allGas, ABI, checkboxes[i], task[1], txCount)

    }
}

async function prepareTx(contractAddress, delay, functionName, task, params, price, walletAddressToUse, allGas, ABI, curentCheckbox, contractElement, txCount) {
    let inputValidation = await validateFunction(functionName, params, task, ABI)
    if (inputValidation == false) {
        contractElement.dataset.name = 'unactive'
    }
    else {
        let contractABI = JSON.parse(ABI)

        let RPC = JSON.parse(fs.readFileSync(JSONfile)).settings[0].RPC
        if (!await isValidRPC(RPC)) {
            document.getElementById(`${task[0].id}Status`).innerHTML = `Invalid RPC`
            contractElement.dataset.name = 'unactive'
            return
        }
        let web3 = new Web3(new Web3.providers.HttpProvider(`${RPC}`));

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        let count = 0;

        while (true) {
            try {

                console.log(functionName)
                console.log(...params)
                const isOpen = await contract.methods[functionName](...params).call({
                    from: walletAddressToUse,
                    value: web3.utils.toWei(price, "ether"),
                });
                let privatKeyFrom = JSON.parse(fs.readFileSync(JSONfile)).wallets.find(wallet => wallet.Address.toLowerCase() === walletAddressToUse.toLowerCase())['PrivateKey'];

                let mintHex = contract.methods[functionName](...params).encodeABI()

                let gasLimit = await estimateGas(walletAddressToUse, contractAddress, mintHex, price.toString())

                let balance = await web3.eth.getBalance(walletAddressToUse);
                balance = balance / 1000000000000000000

                if (gasLimit[0] == 'error') {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Error estimating gas`
                    contractElement.dataset.name = 'unactive'
                    return;
                }
                if ((allGas[1] * 0.000000001 * gasLimit[1]) + price > balance) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Not enough balance`
                    contractElement.dataset.name = 'unactive'
                    return;
                }
                if (isOpen) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Tx sent!`
                    for (let n = 0; n < Number(txCount); n++) {
                        makeTx(mintHex, allGas[0], allGas[1], price, contractAddress, privatKeyFrom, walletAddressToUse, gasLimit[1], `${task[0].id}Status`)
                    }
                    contractElement.dataset.name = 'unactive'
                    return true;
                }
            } catch (error) {
                console.log(error)
                if (error.message.includes('insufficient funds')) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Not enough balance`
                    contractElement.dataset.name = 'unactive'
                    return
                }

                if (error.message.includes('Invalid JSON RPC')) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Invalid RPC`
                    contractElement.dataset.name = 'unactive'
                    return
                }

                if (error.message.includes('Ownable')) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Not a contract owner!`
                    contractElement.dataset.name = 'unactive'
                    return
                }

                if (error.message.includes('invalid')) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Invalid parameter type`
                    contractElement.dataset.name = 'unactive'
                    return
                }


                if (curentCheckbox.dataset.name == 'true') {
                    let checkboxes = document.querySelectorAll(`#allDivTask1 input[type='checkbox']:checked`);
                    for (let j = 0; j < checkboxes.length; j++) {
                        if (checkboxes[j] == curentCheckbox) {
                            changeCheckboxData(curentCheckbox)
                            document.getElementById(`${task[0].id}Status`).innerHTML = `Idle`
                            contractElement.dataset.name = 'unactive'
                            return
                        }
                    }
                    changeCheckboxData(curentCheckbox)
                }

                if (error.message.includes('reverted')) {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Not open yet ${count}`
                }
                else {
                    document.getElementById(`${task[0].id}Status`).innerHTML = `Error`
                    contractElement.dataset.name = 'unactive'
                    return
                }



            }

            count++
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

}

async function validateFunction(functionName, params, task, ABI) {
    try {
        if (ABI == 'Invalid Address format') {
            document.getElementById(`${task[0].id}Status`).innerHTML = `This contract doesn't exist`
            return false;
        }
        if (ABI == 'Contract source code not verified') {
            document.getElementById(`${task[0].id}Status`).innerHTML = `Non verified contract`
            return false;
        }
        let contractABI = JSON.parse(ABI);

        const functionABI = contractABI.find((item) => item.name === functionName);

        if (!functionABI) {
            document.getElementById(`${task[0].id}Status`).innerHTML = `Wrong function`
            return false;
        }

        if (functionABI.inputs.length !== params.length) {
            document.getElementById(`${task[0].id}Status`).innerHTML = `Wrong parameters`
            return false;
        }

        return true;
    } catch (error) {
        document.getElementById(`${task[0].id}Status`).innerHTML = `Error`
        return false;
    }
}

function createJsonFile(filename, content) {
    const data = JSON.stringify(content);
    fs.writeFile(filename, data, (err) => {
        if (err) throw err;
    });
}

function getFileNames(folderPath) {
    return fs.readdirSync(folderPath).map((file) => path.basename(file));
}
function readFirstLine(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n')[0];
}

function createTextFile(filename, content) {
    fs.writeFile(filename, content, (err) => {
        if (err) throw err;
    });
}

function addTaskToJSON(taskN, WalletN, contractA, fun, para, price, txC, Gas) {
    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);

    const newTask = {
        taskName: taskN,
        WalletName: WalletN,
        contractAddress: contractA,
        function: fun,
        parameters: para,
        price: price,
        txCount: txC,
        GasPrice: Gas,
        active: false
    };

    data.tasks.push(newTask);

    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(JSONfile, updatedData);

}

function removeTaskJSON(taskToDelete) {
    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);

    const indexToDelete = data.tasks.findIndex(tasks => tasks.taskName === taskToDelete);

    if (indexToDelete !== -1) {
        data.tasks.splice(indexToDelete, 1);

        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(JSONfile, updatedData);

    }
}

function removeAllTasksJSON() {
    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);

    data.tasks = [];

    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(JSONfile, updatedData);
}

async function isValidEtherscanApiKey(apiKey) {
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`;
    try {
        const response = await axios.get(url);
        const result = response.data.result;
        if (result == 'Invalid API Key' || apiKey == '' || apiKey == 'Too many invalid api key attempts, please try again later') {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        return false;
    }
}
