

async function getBatchBalance(divId) {
    let errorBracket = document.getElementById('errorBracket1');
    errorBracket.innerHTML = " ";

    let RPC = JSON.parse(fs.readFileSync(JSONfile)).settings[0].RPC
    if (!await isValidRPC(RPC)) {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = "Invalid RPC";
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
        return
    }
    let web3 = new Web3(new Web3.providers.HttpProvider(`${RPC}`));

    const infoWallets = getCheckedCheckboxes(divId);
    const wallets = infoWallets[0];
    const ids = infoWallets[1];

    const batch = new web3.BatchRequest();
    for (let ii = 0; ii < wallets.length; ii++) {
        batch.add(web3.eth.getBalance.request(wallets[ii], (err, response) => {
            const totalTokens = web3.utils.toBN(response).toString();
            const balance = web3.utils.fromWei(totalTokens, "ether");
            document.getElementById(ids[ii]).innerHTML = balance;
        }));
    }
    await batch.execute()




}

function mainFundsTransfer() {
    let walletsLeft = getCheckedCheckboxes('allWallets')[0];
    let walletsRight = getCheckedCheckboxes('allWallets2')[0];

    let errorBracket = document.getElementById('errorBracket1');
    errorBracket.innerHTML = " ";

    if (walletsLeft.length === 1 && walletsRight.length === 1) {
        mergeFuntion()
    }
    else if (walletsLeft.length === 1 && walletsRight.length > 1) {
        disperseFuntion()
    }
    else if (walletsLeft.length > 1 && walletsRight.length === 1) {
        mergeFuntion()
    }
    else if (walletsLeft.length > 1 && walletsRight.length > 1) {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = "You can't select multiple wallets in both sides";
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
    }

}


async function mergeFuntion() {
    const data = JSON.parse(fs.readFileSync(JSONfile));
    let amount = document.getElementById('amountOfFundsToSend').value;
    const numericValue0 = parseFloat(amount);
    const isValidNumber0 = /^\d+(\.\d+)?$/.test(amount);

    let RPC = JSON.parse(fs.readFileSync(JSONfile)).settings[0].RPC
    if (!await isValidRPC(RPC)) {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = "Invalid RPC";
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
        return
    }
    let web3 = new Web3(new Web3.providers.HttpProvider(`${RPC}`));


    if (typeof numericValue0 === "number" && !isNaN(numericValue0) && isValidNumber0 && amount != '0') {
        let allGas = getGas('amountOfGas', 'errorBracket1');
        if (allGas != 'err') {
            let GweiPriority = allGas[0];
            let GweiGas = allGas[1];
            let walletsFrom = getCheckedCheckboxes('allWallets')[0];
            let walletTo = getCheckedCheckboxes('allWallets2')[0];
            if (walletsFrom.length >= 1) {
                if (walletTo.length == 1) {
                    walletTo = walletTo[0];
                    if (walletsFrom.includes(walletTo)) {
                        let errorBracket = document.getElementById('errorBracket1');
                        errorBracket.innerHTML = "You can't send to the same wallet";
                        errorBracket.style.fontSize = '15px'
                        errorBracket.style.color = 'red'
                    }
                    else {

                        let gasLimit = '21000';
                        let mintHex = '0x'
                        for (let i = 0; i < walletsFrom.length; i++) {
                            let privatKeyFrom = data.wallets.find(wallet => wallet.Address === walletsFrom[i])['PrivateKey'];
                            web3.eth.getBalance(walletsFrom[i]).then(res => {

                                res = web3.utils.fromWei(res, 'ether')
                                let etherGweiGas = Number(web3.utils.fromWei(web3.utils.toWei(GweiGas.toString(), 'gwei'), 'ether'))
                                if (res < amount + (etherGweiGas * gasLimit)) {
                                    toSend = res - Number((etherGweiGas * gasLimit)) - 0.00000000001
                                }
                                else {
                                    toSend = amount
                                }
                                if (toSend == Math.abs(toSend)) {
                                    let errorBracket = document.getElementById('errorBracket1');
                                    errorBracket.innerHTML = 'Tx sent';
                                    errorBracket.style.fontSize = '15px'
                                    errorBracket.style.color = 'green'

                                    makeTx(mintHex, GweiPriority, GweiGas, toSend.toString(), walletTo, privatKeyFrom, walletsFrom[i], gasLimit, 'errorBracket1')
                                }

                            })


                        }
                    }

                }
                else {
                    let errorBracket = document.getElementById('errorBracket1');
                    errorBracket.innerHTML = 'Select only one wallet to send to';
                    errorBracket.style.fontSize = '15px'
                    errorBracket.style.color = 'red'
                }
            }
            else {
                let errorBracket = document.getElementById('errorBracket1');
                errorBracket.innerHTML = 'Select at least one wallet to send from';
                errorBracket.style.fontSize = '15px'
                errorBracket.style.color = 'red'
            }
        }
    }
    else {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = 'Invalid amount';
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
    }




}



async function makeTx(mintHex, GweiPriority, GweiGas, mintPrice, mintContract, privateKey, addressFrom, gasLimmit, errorId) {

    let RPC = JSON.parse(fs.readFileSync(JSONfile)).settings[0].RPC
    if (!await isValidRPC(RPC)) {
        let errorBracket = document.getElementById(errorId);
        errorBracket.innerHTML = "Invalid RPC";
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
        return
    }
    let web3 = new Web3(new Web3.providers.HttpProvider(`${RPC}`));

    const newNonce = await web3.eth.getTransactionCount(addressFrom)


    const rawTx = {
        gasLimit: web3.utils.toHex(gasLimmit),
        maxFeePerGas: web3.utils.toHex(web3.utils.toWei(GweiGas.toString(), 'gwei')),
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(GweiPriority.toString(), 'gwei')),
        to: mintContract,
        from: addressFrom,
        value: web3.utils.toHex(web3.utils.toWei(mintPrice, 'ether')),
        data: web3.utils.toHex(mintHex),
        nonce: web3.utils.toHex(newNonce),
        chainId: 1,
    }




    try {
        let errorBracket = document.getElementById(errorId);
        errorBracket.innerHTML = 'Pending';
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'green'
        const txx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(txx.rawTransaction);
        //v tem se podpisana transakcija pošlje na omrežje
        errorBracket.innerHTML = 'Tx Confirmed!';
        //return [receipt.transactionHash];
    }
    catch (err) {
        let errorBracket = document.getElementById(errorId);
        errorBracket.innerHTML = 'Tx Failed!';
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
    }

}

async function disperseFuntion() {

    let RPC = JSON.parse(fs.readFileSync(JSONfile)).settings[0].RPC
    if (!await isValidRPC(RPC)) {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = "Invalid RPC";
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
        return
    }
    let web3 = new Web3(new Web3.providers.HttpProvider(`${RPC}`));

    const data = JSON.parse(fs.readFileSync(JSONfile));
    let amount = document.getElementById('amountOfFundsToSend').value;
    const numericValue0 = parseFloat(amount);
    const isValidNumber0 = /^\d+(\.\d+)?$/.test(amount);
    if (typeof numericValue0 === "number" && !isNaN(numericValue0) && isValidNumber0 && amount != '0') {
        let allGas = getGas('amountOfGas', 'errorBracket1');
        if (allGas != 'err') {
            let GweiPriority = allGas[0];
            let GweiGas = allGas[1];
            let walletFrom = getCheckedCheckboxes('allWallets')[0];
            let walletsTo = getCheckedCheckboxes('allWallets2')[0];
            if (walletFrom.length == 1) {
                if (walletsTo.length > 1) {
                    walletFrom = walletFrom[0];
                    if (walletsTo.includes(walletFrom)) {
                        let errorBracket = document.getElementById('errorBracket1');
                        errorBracket.innerHTML = "You can't send to the same wallet";
                        errorBracket.style.fontSize = '15px'
                        errorBracket.style.color = 'red'
                    }
                    else {

                        contractAddress = '0xD152f549545093347A162Dce210e7293f1452150'
                        let contractABI = JSON.parse(fs.readFileSync(disperseContract))
                        let contract = new Contract(contractABI, contractAddress);
                        let parameter1 = walletsTo;
                        let parameter2 = [];
                        let mintPrice = amount * walletsTo.length
                        let balance = await web3.eth.getBalance(walletFrom);
                        balance = balance / 1000000000000000000
                        for (let i = 1; i <= walletsTo.length; i++) {
                            parameter2.push((amount * 1000000000000000000).toString())
                        }
                        let paramss = [parameter1,parameter2]
                        console.log(paramss)
                        let mintHex = contract.methods['disperseEther'](...paramss).encodeABI()
                        console.log(mintHex)
                        let privatKeyFrom = data.wallets.find(wallet => wallet.Address === walletFrom)['PrivateKey'];
                        let gasLimit = await estimateGas(walletFrom, contractAddress, mintHex, mintPrice.toString())
                        if (gasLimit[0] == 'success') {
                            if ((GweiGas * 0.000000001 * gasLimit[1]) + mintPrice <= balance) {
                                makeTx(mintHex, GweiPriority, GweiGas, mintPrice.toString(), contractAddress, privatKeyFrom, walletFrom, gasLimit[1], 'errorBracket1');
                                let errorBracket = document.getElementById('errorBracket1');
                                errorBracket.innerHTML = "Tx sent";
                                errorBracket.style.fontSize = '15px'
                                errorBracket.style.color = 'green'
                                //return ['error', 'Not enough eth balance']
                            }
                            else {
                                let errorBracket = document.getElementById('errorBracket1');
                                errorBracket.innerHTML = "Not enough balance";
                                errorBracket.style.fontSize = '15px'
                                errorBracket.style.color = 'red'
                            }
                        }
                        else {
                            let errorBracket = document.getElementById('errorBracket1');
                            errorBracket.innerHTML = "Error estimating gas";
                            errorBracket.style.fontSize = '15px'
                            errorBracket.style.color = 'red'
                        }

                    }

                }
                else {
                    let errorBracket = document.getElementById('errorBracket1');
                    errorBracket.innerHTML = 'Select at least two wallet to send to';
                    errorBracket.style.fontSize = '15px'
                    errorBracket.style.color = 'red'
                }
            }
            else {
                let errorBracket = document.getElementById('errorBracket1');
                errorBracket.innerHTML = 'Select one wallet to send from';
                errorBracket.style.fontSize = '15px'
                errorBracket.style.color = 'red'
            }
        }
    }
    else {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = 'Invalid amount';
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
    }




}

async function estimateGas(acc, contractAddr, data, mintPrice) {
    let RPC = JSON.parse(fs.readFileSync(JSONfile)).settings[0].RPC
    if (!await isValidRPC(RPC)) {
        let errorBracket = document.getElementById('errorBracket1');
        errorBracket.innerHTML = "Invalid RPC";
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
        return
    }
    let web3 = new Web3(new Web3.providers.HttpProvider(`${RPC}`));

    try {
        let estimateGasResult = await web3.eth.estimateGas({
            from: acc,
            data: data,
            to: contractAddr,
            value: web3.utils.toHex(web3.utils.toWei(mintPrice, 'ether'))
        });
        return ['success', estimateGasResult];
    }
    catch (err) {
        return ['error', err.toString()];
    }
}


async function isValidRPC(RPC) {
    if (RPC == '') {
        return false
    }
    try {
        let web3 = new Web3(new Web3.providers.HttpProvider(RPC));
        await web3.eth.getBlockNumber();
        return true;
    } catch (err) {
        return false;
    }
}

