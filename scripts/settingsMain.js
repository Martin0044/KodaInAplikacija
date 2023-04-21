
function saveSettings() {

    let RPC = document.getElementById('RPCid').value;
    let EtherscanAPI = document.getElementById('EtherscanAPI').value;
    let Delay1 = document.getElementById('Delay1').value;

    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);

    data.settings[0].RPC = RPC;
    data.settings[0].EtherscanAPI = EtherscanAPI;
    data.settings[0].Delay = Delay1;

    const updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(JSONfile, updatedData);

}

