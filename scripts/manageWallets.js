
function updateJSON(walletToChange, NewWalletName, NewWalletAddress, NewPrivateKey) {

    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);

    const indexToChange = data.wallets.findIndex(wallet => wallet.WalletName.toLowerCase() === walletToChange.toLowerCase());

    if (indexToChange !== -1) {
        data.wallets[indexToChange].WalletName = NewWalletName;
        data.wallets[indexToChange].Address = NewWalletAddress;
        data.wallets[indexToChange].PrivateKey = NewPrivateKey;


        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(JSONfile, updatedData);
    }

}

function removeWalletJSON(walletToDelete) {
    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);
    
    const indexToDelete = data.wallets.findIndex(wallet => wallet.WalletName.toLowerCase() === walletToDelete.toLowerCase());
    if (indexToDelete !== -1) {
        data.wallets.splice(indexToDelete, 1);

        const updatedData = JSON.stringify(data, null, 2);
        fs.writeFileSync(JSONfile, updatedData);

    }
}

function addWalletToJSON(newWalletName, newWalletAP) {
    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);
    //pod 'data' se shrani vsebina datoteke z denarnicami
    
    const newWallet = {
        WalletName: newWalletName,
        Address: newWalletAP[1],
        PrivateKey: newWalletAP[0]
    };
    data.wallets.push(newWallet);
    //Tukaj program spremeni kopijo datoteke

    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(JSONfile, updatedData);
    //Spremenjeno kopijo potem shrani na mesto datoteke

}



function shortenString(string) {
    return string.slice(0, 4) + '..........' + string.slice(-4);
}

function generateEthereumWallet() {
    const wallet = ethers.Wallet.createRandom();

    const privateKey = wallet.privateKey.substring(2);
    const address = wallet.address;

    return [privateKey, address];
}

function getAddressFromPrivateKey(privateKey) {
    try {
        const bufferPrivateKey = ethUtil.toBuffer(privateKey);
        const addressBuffer = ethUtil.privateToAddress(bufferPrivateKey);
        const address = ethUtil.bufferToHex(addressBuffer);
        return address;
    } catch (error) {
        return null;
    }
}
    

function isWalletNameExists(walletName) {
    const wallets = JSON.parse(fs.readFileSync(JSONfile));
    for (let i = 0; i < wallets.wallets.length; i++) {
      if (wallets.wallets[i].WalletName === walletName) {
        return true;
      }
    }
    return false;
  }
  