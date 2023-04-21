//Tasks part
function createTask() {
    let price = document.getElementById('modalPrice').value;
    const numericValue0 = parseFloat(price);
    const isValidNumber0 = /^\d+(\.\d+)?$/.test(price);
    if ((typeof numericValue0 === "number" && !isNaN(numericValue0) && isValidNumber0) || price === '') {
        if (price === '') {
            price = '0';
        }
        else {
            price = document.getElementById('modalPrice').value;
        }
        let allGas = getGas('modalGasPrice', 'errorBracket2');
        if (allGas != 'err') {
            let txCount = document.getElementById('modalTransactionsCount').value;
            const numericValue1 = parseFloat(txCount);
            const isValidNumber1 = /^\d+$/.test(txCount);
            if (typeof numericValue1 === "number" && !isNaN(numericValue1) && isValidNumber1 && txCount != '0') {
                if (document.getElementById('modalContractAddress').value != '') {
                    if (document.getElementById('modalFunction').value != '') {
                        if (document.getElementById('dropdownBtnForWallets').innerHTML === 'Wallets selected') {
                            let taskTbody = document.getElementById('allTasks1');
                            let allWallets = document.getElementsByClassName('itemWallet selected');
                            let numOfTasks = getTaskNumber();
                            for (let i = 0; i < allWallets.length; i++) {
                                let classs = `realTask-${i + numOfTasks}`;
                                let row = document.createElement('tr');
                                row.id = `task${i + numOfTasks}Tr`;
                                row.style.width = '100%';

                                let CheckboxColumn = document.createElement('th');
                                CheckboxColumn.style.width = '5%';
                                let CheckboxColumnInput = document.createElement('input')
                                CheckboxColumnInput.type = "checkbox";
                                CheckboxColumnInput.id = `task${i + numOfTasks}`;
                                CheckboxColumnInput.classList = classs;
                                CheckboxColumnInput.dataset.name = 'false'
                                CheckboxColumn.appendChild(CheckboxColumnInput);
                                row.appendChild(CheckboxColumn);

                                let ContractColumn = document.createElement('th');
                                ContractColumn.style.width = '40%';
                                ContractColumn.style.color = '#ffffff';
                                let ContractColumnP = document.createElement('p')
                                ContractColumnP.innerHTML = document.getElementById('modalContractAddress').value;
                                ContractColumnP.classList = classs;
                                ContractColumnP.dataset.name = 'unactive'
                                ContractColumn.appendChild(ContractColumnP);
                                row.appendChild(ContractColumn);

                                let GasColumn = document.createElement('th');
                                GasColumn.style.width = '15%';
                                GasColumn.style.color = '#ffffff';
                                let GasColumnP = document.createElement('p')
                                GasColumnP.innerHTML = `${allGas[0]}-${allGas[1]}`
                                GasColumnP.classList = classs;
                                GasColumn.appendChild(GasColumnP);
                                row.appendChild(GasColumn);

                                let AcountColumn = document.createElement('th');
                                AcountColumn.style.width = '20%';
                                AcountColumn.style.color = '#ffffff';
                                let AcountColumnP = document.createElement('p')
                                AcountColumnP.innerHTML = allWallets[i].id;
                                AcountColumnP.classList = classs;
                                AcountColumn.appendChild(AcountColumnP);
                                row.appendChild(AcountColumn);

                                let StatusColumn = document.createElement('th');
                                StatusColumn.style.width = '20%';
                                StatusColumn.style.color = '#ffffff';
                                let StatusColumnP = document.createElement('p')
                                StatusColumnP.innerHTML = 'Idle'
                                StatusColumnP.classList = classs;
                                StatusColumnP.id = `task${i + numOfTasks}Status`;
                                StatusColumn.appendChild(StatusColumnP);
                                row.appendChild(StatusColumn);

                                taskTbody.appendChild(row);

                                addTaskToJSON(
                                    `realTask-${i + numOfTasks}`,
                                    allWallets[i].id,
                                    document.getElementById('modalContractAddress').value,
                                    document.getElementById('modalFunction').value,
                                    document.getElementById('modalParameters').value,
                                    price,
                                    document.getElementById('modalTransactionsCount').value,
                                    `${allGas[0]}-${allGas[1]}`
                                )


                            }
                            closeModal();
                            removeWalletsSelect()
                        }
                        else {
                            let errorBracket = document.getElementById('errorBracket2');
                            errorBracket.innerHTML = 'No wallets selected';
                            errorBracket.style.fontSize = '15px'
                            errorBracket.style.color = 'red'
                        }
                    }
                    else {
                        let errorBracket = document.getElementById('errorBracket2');
                        errorBracket.innerHTML = 'Invalid function';
                        errorBracket.style.fontSize = '15px'
                        errorBracket.style.color = 'red'
                    }
                }
                else {
                    let errorBracket = document.getElementById('errorBracket2');
                    errorBracket.innerHTML = 'Invalid contract address';
                    errorBracket.style.fontSize = '15px'
                    errorBracket.style.color = 'red'
                }
            }
            else {
                let errorBracket = document.getElementById('errorBracket2');
                errorBracket.innerHTML = 'Invalid tx count';
                errorBracket.style.fontSize = '15px'
                errorBracket.style.color = 'red'
            }
        }


    }
    else {
        let errorBracket = document.getElementById('errorBracket2');
        errorBracket.innerHTML = 'Invalid price';
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
    }

    updateDivDimensions()
}

function stopTask() {
    let checkboxes = document.querySelectorAll(`#allDivTask1 input[type='checkbox']`)

    for (let i = 0; i < checkboxes.length; i++) {
        let task = document.getElementsByClassName(checkboxes[i].className);
        if (task[1].dataset.name == 'active') {
            if (checkboxes[i].dataset.name == `true`) {
                checkboxes[i].dataset.name = `false`
            }
            else {
                checkboxes[i].dataset.name = `true`
            }
        }
    }


}

function deleteTask() {
    let checkboxes = document.querySelectorAll(`#allDivTask1 input[type='checkbox']:checked`);
    for (let i = 0; i < checkboxes.length; i++) {
        let task = document.getElementsByClassName(checkboxes[i].className);
        let tr = document.getElementById(`${task[0].id}Tr`);
        let table = tr.parentNode;
        table.removeChild(tr);
        removeTaskJSON(checkboxes[i].className)
    }

    updateDivDimensions()
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.getElementById('modalContractAddress').value = '';
    document.getElementById('modalFunction').value = '';
    document.getElementById('modalParameters').value = '';
    document.getElementById('modalPrice').value = '';
    document.getElementById('modalGasPrice').value = '';
    document.getElementById('modalTransactionsCount').value = '1';
    document.getElementById('errorBracket2').innerHTML = '';
}
function OpenModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModalOnClickOutside(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        removeWalletsSelect();
        closeModal()
    }
}

function loadWalletsForSelection() {
    let toLoad = document.getElementById("dropdownListForWallets");
    const wallets = JSON.parse(fs.readFileSync(JSONfile));

    for (let i = 0; i <= wallets.wallets.length - 1; i++) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = wallets.wallets[i].WalletName
        newDiv.id = wallets.wallets[i].WalletName
        newDiv.className = "itemWallet";
        newDiv.onclick = function () { toggleSelection(this); };
        toLoad.appendChild(newDiv);
    }
}

function hideloadWalletsForSelection(event) {
    const dropdownBtnForWallets = document.getElementById("dropdownBtnForWallets");
    const dropdownListForWallets = document.getElementById("dropdownListForWallets");

    if (!dropdownBtnForWallets.contains(event.target) && !dropdownListForWallets.contains(event.target)) {
        dropdownListForWallets.style.display = "none";
    }
}

function toggleDropDownForWallets() {
    const dropdownListForWallets = document.getElementById("dropdownListForWallets");
    dropdownListForWallets.style.display = dropdownListForWallets.style.display === "block" ? "none" : "block";
}


function removeWalletsSelect() {
    document.getElementById("dropdownListForWallets").innerHTML = "";
    document.getElementById("dropdownBtnForWallets").innerHTML = 'Select wallets';
}

function toggleSelection(item) {
    item.classList.toggle("selected");
    const dropdownBtnForWallets = document.getElementById("dropdownBtnForWallets");
    let selectedItemsWallet = document.querySelectorAll(".itemWallet.selected");
    dropdownBtnForWallets.innerHTML = 'Wallets selected';
    if (selectedItemsWallet.length === 0) {
        document.getElementById("dropdownBtnForWallets").innerHTML = 'Select wallets';
    }
}

function changeCheckboxData(checkbox) {
    if (checkbox.dataset.name == `true`) {
        checkbox.dataset.name = `false`
    }
    else {
        checkbox.dataset.name = `true`
    }
}

function getTaskNumber() {
    let tbody = document.getElementById("allTasks1");
    let trs = tbody.getElementsByTagName("tr")
    let count = trs.length
    let num;
    if (trs[count - 1] == undefined) {
        num = 0;
    }
    else {
        let match = trs[count - 1].id.match(/\d+/);
        num = match ? match[0] : NaN;
        num = parseInt(num) + 1
    }
    return num;
}


//left upper corner buttons
function openTab(evt, tab) {
    var i, tabcontent, TabButtons;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    TabButtons = document.getElementsByClassName("TabButtons");
    for (i = 0; i < TabButtons.length; i++) {
        TabButtons[i].className = TabButtons[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

//manage funds part

function checkCheckbox(divId) {
    var checkboxes = document.querySelectorAll(`#${divId} input[type='checkbox']`);
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }

}

function uncheckCheckbox(divId) {
    var checkboxes = document.querySelectorAll(`#${divId} input[type='checkbox']`);
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }

}

function loadWallets(divId) {
    const checkboxContainer = document.getElementById(divId);
    checkboxContainer.innerHTML = '';
    const table = document.createElement('table');
    table.style.width = '100%';
    checkboxContainer.appendChild(table);
    const numOfWallets = JSON.parse(fs.readFileSync(JSONfile)).wallets.length - 1;
    for (let i = 0; i <= numOfWallets; i++) {
        const row = table.insertRow();
        const label = document.createElement('label');
        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.id = `${divId}wallet${i}`;
        checkbox.value = `${divId}wallet${i}`;
        label.appendChild(checkbox);


        const spanWallet = document.createElement('span');
        spanWallet.innerHTML = JSON.parse(fs.readFileSync(JSONfile)).wallets[i]['WalletName'];
        spanWallet.style.fontSize = '12px';
        spanWallet.style.color = '#ffffff';
        spanWallet.id = `span${divId}wallet${i}`;
        label.appendChild(spanWallet);


        const cellLabel = row.insertCell();
        cellLabel.appendChild(label);
        cellLabel.style.textAlign = 'left';
        cellLabel.style.width = '80%'; // added style property


        const cellBalance = row.insertCell();
        const besedilo = document.createElement('p');
        besedilo.id = `${divId}balance${divId}wallet${i}`;
        besedilo.innerHTML = '.......';
        besedilo.style.fontSize = '12px';
        besedilo.style.color = '#ffffff';


        cellBalance.appendChild(besedilo);
        cellBalance.style.textAlign = 'center';
        cellBalance.style.width = '20%'; // added style property
    }
    updateDivDimensions()
}

function getCheckedCheckboxes(divId) {
    var checkboxes = document.querySelectorAll(`#${divId} input[type='checkbox']:checked`);
    var selected = [];
    var selected2 = [];
    const data = JSON.parse(fs.readFileSync(JSONfile));
    for (var i = 0; i < checkboxes.length; i++) {
        let walllett = data.wallets.find(wallet => wallet.WalletName === document.getElementById(`span${checkboxes[i].value}`).innerHTML)

        selected.push(walllett.Address);
        selected2.push(`${divId}balance${checkboxes[i].value}`);
    }

    return [selected, selected2];
}


//manage wallets

function loadWalletsToEdit() {
    let tbody = document.getElementById('loadedWalletaToEdit');
    const wallets = JSON.parse(fs.readFileSync(JSONfile));
    for (let i = 0; i <= wallets.wallets.length - 1; i++) {
        let tr = document.createElement('tr');
        tr.id = `trEdit${i + 1}`
        let id = `toEditWallet_${i + 1}`

        appendWallets(tbody, id, tr, wallets.wallets[i].WalletName, wallets.wallets[i].Address, wallets.wallets[i].PrivateKey)

    }
    updateDivDimensions()
}

function saveEditedWallet() {
    let saveButton = document.getElementById('buttonManageWallets1');
    let WalletName = document.getElementById('WalletName').value;
    if (saveButton.dataset.name != '' && (!isWalletNameExists(WalletName)) || saveButton.dataset.name == WalletName) {
        let walletToChange = saveButton.dataset.name

        let deleteButton = document.getElementById('buttonManageWallets2');
        let NumberIdOfRowToChange = deleteButton.dataset.name.split('_')[1]


        let WalletAddresss = document.getElementById('WalletAddresss').value;

        let PrivatKey = document.getElementById('PrivatKey').value;

        let realAddress = getAddressFromPrivateKey('0x' + PrivatKey)

        let WalletNameTable = document.getElementById(`toEditWallet_${NumberIdOfRowToChange}_walletName`);

        let WalletAddresssTable = document.getElementById(`toEditWallet_${NumberIdOfRowToChange}_walletAddress`);

        let PrivatKeyTable = document.getElementById(`toEditWallet_${NumberIdOfRowToChange}_privatKey`);

        let editButtonTable = document.getElementById(`toEditWallet_${NumberIdOfRowToChange}_editButton`);

        if (realAddress.toLowerCase() != WalletAddresss.toLowerCase() && realAddress != null) {
            updateJSON(walletToChange, WalletName, realAddress, PrivatKey)
            WalletNameTable.innerHTML = WalletName
            WalletAddresssTable.innerHTML = realAddress
            PrivatKeyTable.innerHTML = shortenString(PrivatKey)
            editButtonTable.dataset.name = WalletName

            saveButton.dataset.name = ''
            deleteButton.dataset.name = ''
            document.getElementById('WalletName').value = ''
            document.getElementById('WalletAddresss').value = ''
            document.getElementById('PrivatKey').value = ''


        }
        else {
            updateJSON(walletToChange, WalletName, realAddress, PrivatKey)
            WalletNameTable.innerHTML = WalletName
            WalletAddresssTable.innerHTML = realAddress
            PrivatKeyTable.innerHTML = shortenString(PrivatKey)
            editButtonTable.dataset.name = WalletName

            saveButton.dataset.name = ''
            deleteButton.dataset.name = ''
            document.getElementById('WalletName').value = ''
            document.getElementById('WalletAddresss').value = ''
            document.getElementById('PrivatKey').value = ''

        }
        loadWallets('allWallets')
        loadWallets('allWallets2')

        updateDivDimensions()
    }
    else if (!isWalletNameExists(WalletName)) {
        let WalletName = document.getElementById('WalletName').value;

        let PrivatKey = document.getElementById('PrivatKey').value;

        let realAddress = getAddressFromPrivateKey('0x' + PrivatKey)

        if (realAddress != null) {
            let tbody = document.getElementById('loadedWalletaToEdit');

            const wallets = JSON.parse(fs.readFileSync(JSONfile));

            let tr = document.createElement('tr');
            tr.id = `trEdit${wallets.wallets.length + 1}`
            let id = `toEditWallet_${wallets.wallets.length + 1}`
            appendWallets(tbody, id, tr, WalletName, realAddress, PrivatKey)

            addWalletToJSON(WalletName, [PrivatKey, realAddress])

            document.getElementById('WalletName').value = ''
            document.getElementById('WalletAddresss').value = ''
            document.getElementById('PrivatKey').value = ''
        }


    }

}

function deleteEditedWallet() {
    //`trEdit${i + 1}`
    let deleteButton = document.getElementById('buttonManageWallets2');

    let NumberIdOfRowToChange = deleteButton.dataset.name.split('_')[1]
    var row = document.getElementById(`trEdit${NumberIdOfRowToChange}`);
    row.remove();

    let WalletName = document.getElementById('WalletName');
    WalletName.value = ''

    let WalletAddresss = document.getElementById('WalletAddresss');
    WalletAddresss.value = ''

    let PrivatKey = document.getElementById('PrivatKey');
    PrivatKey.value = ''

    deleteButton.setAttribute('disabled', true);

    let saveButton = document.getElementById('buttonManageWallets1');
    let walletToDelete = saveButton.dataset.name
    removeWalletJSON(walletToDelete)
    loadWallets('allWallets')
    loadWallets('allWallets2')

    updateDivDimensions()

    saveButton.dataset.name = ''
    deleteButton.dataset.name = ''

}

function generateWallets() {
    let numToCreate = document.getElementById('QuantityOfWallets').value;
    let walletNames = document.getElementById('NameOfWallets').value;
    let tbody = document.getElementById('loadedWalletaToEdit');
    const wallets = JSON.parse(fs.readFileSync(JSONfile));
    for (let i = 0; i < numToCreate; i++) {
        if (!isWalletNameExists(`${walletNames} ${i + 1}`)) {
            let newWallet = generateEthereumWallet()

            let tr = document.createElement('tr');
            tr.id = `trEdit${wallets.wallets.length + i}`
            let id = `toEditWallet_${wallets.wallets.length + i}`

            appendWallets(tbody, id, tr, `${walletNames} ${i + 1}`, newWallet[1], newWallet[0])

            addWalletToJSON(`${walletNames} ${i + 1}`, newWallet)
        }
    }
    loadWallets('allWallets')
    loadWallets('allWallets2')
    updateDivDimensions()
}

function appendWallets(tbody, id, tr, walletName, WalletAddress, WalletPK) {
    let AccountNameTH = document.createElement('th');
    AccountNameTH.style.width = '15%'
    let p1 = document.createElement('p');
    p1.innerHTML = walletName
    p1.id = `${id}_walletName`
    p1.style.color = '#ffffff';
    p1.style.fontSize = '12px';
    AccountNameTH.appendChild(p1);
    tr.appendChild(AccountNameTH)

    let WalletAddressTH = document.createElement('th');
    WalletAddressTH.style.width = '45%'
    let p2 = document.createElement('p');
    p2.innerHTML = WalletAddress
    p2.id = `${id}_walletAddress`
    p2.style.color = '#ffffff';
    p2.style.fontSize = '12px';
    WalletAddressTH.appendChild(p2);
    tr.appendChild(WalletAddressTH)

    let PrivatKeyTH = document.createElement('th');
    PrivatKeyTH.style.width = '30%'
    let p3 = document.createElement('p');
    p3.innerHTML = shortenString(WalletPK);
    p3.id = `${id}_privatKey`
    p3.style.color = '#ffffff';
    p3.style.fontSize = '12px';
    PrivatKeyTH.appendChild(p3);
    tr.appendChild(PrivatKeyTH)

    let EditTH = document.createElement('th');
    EditTH.style.width = '10%'
    let button = document.createElement('button');
    button.innerHTML = 'edit';
    button.onclick = editWallet;
    button.id = `${id}_editButton`
    button.dataset.name = `${walletName}`
    EditTH.appendChild(button);
    tr.appendChild(EditTH)

    tbody.appendChild(tr);
}

function getGas(id, errorId) {
    let gasSplit = []
    gasSplit = document.getElementById(id).value.split('-');
    const numericValue0 = parseFloat(gasSplit[0]);
    const isValidNumber0 = /^\d+(\.\d+)?$/.test(gasSplit[0]);

    if (typeof numericValue0 === "number" && !isNaN(numericValue0) && isValidNumber0) {
        gasSplit[0] = Number(gasSplit[0])
        if (gasSplit[1] == undefined) {
            gasSplit[1] = gasSplit[0]
            return gasSplit;
        }
        else {
            const numericValue1 = parseFloat(gasSplit[1]);
            const isValidNumber1 = /^\d+(\.\d+)?$/.test(gasSplit[1]);
            if (typeof numericValue1 === "number" && !isNaN(numericValue1) && isValidNumber1) {
                gasSplit[1] = Number(gasSplit[1])
                return gasSplit;
            }
            else {
                let errorBracket = document.getElementById(errorId);
                errorBracket.innerHTML = 'Invalid gas';
                errorBracket.style.fontSize = '15px'
                errorBracket.style.color = 'red'
                return 'err';
            }
        }

    }
    else {
        let errorBracket = document.getElementById(errorId);
        errorBracket.innerHTML = 'Invalid gas';
        errorBracket.style.fontSize = '15px'
        errorBracket.style.color = 'red'
        return 'err';
    }

}

function editWallet() {

    const wallets = JSON.parse(fs.readFileSync(JSONfile));
    let deleteButton = document.getElementById('buttonManageWallets2');
    deleteButton.removeAttribute("disabled");
    deleteButton.dataset.name = this.id
    let saveButton = document.getElementById('buttonManageWallets1');
    saveButton.dataset.name = this.dataset.name
    let WalletName = document.getElementById('WalletName');
    WalletName.value = this.dataset.name
    let WalletAddresss = document.getElementById('WalletAddresss');
    WalletAddresss.value = wallets.wallets.find(wallet => wallet.WalletName.toLowerCase() === this.dataset.name.toLowerCase()).Address.toLowerCase();
    let PrivatKey = document.getElementById('PrivatKey');
    PrivatKey.value = wallets.wallets.find(wallet => wallet.WalletName.toLowerCase() === this.dataset.name.toLowerCase()).PrivateKey.toLowerCase();
}

//settings
function toggleSettingsDiv() {
    var settingsDiv = document.getElementById("hiddenSettings");
    if (settingsDiv.style.display === "none") {
        settingsDiv.style.display = "block";
    } else {
        settingsDiv.style.display = "none";
    }
}

function loadSettings() {
    const rawData = fs.readFileSync(JSONfile);
    const data = JSON.parse(rawData);

    let RPC = document.getElementById('RPCid')
    let EtherscanAPI = document.getElementById('EtherscanAPI')
    let Delay1 = document.getElementById('Delay1')

    RPC.value = data.settings[0].RPC
    EtherscanAPI.value = data.settings[0].EtherscanAPI
    Delay1.value = data.settings[0].Delay
}

//all
function updateDivDimensions() {
    //loading screen 
    document.getElementById("loading-screen").style.height = (
        window.innerHeight
    ) + "px";

    document.getElementById("loading-screen").style.width = (
        window.innerWidth
    ) + "px";
    //code for left side
    document.getElementById("leftSide").style.height = (
        window.innerHeight
    ) + "px";

    document.getElementById("settingsDiv1").style.height = (
        window.innerHeight
        - document.querySelector('#ButtonsForTabs').offsetHeight
    ) / 2 + "px";

    document.getElementById("settingsDiv2").style.height = (
        window.innerHeight
        - document.querySelector('#ButtonsForTabs').offsetHeight
    ) / 2 + "px";


    document.getElementById("mainDivCreateTasks").style.height = (
        window.innerHeight
    ) + "px";


    document.getElementById("mainDivManageFunds").style.height = (
        window.innerHeight
    ) + "px";


    document.getElementById("mainDivManageWallets").style.height = (
        window.innerHeight
    ) + "px";


    //code for create task
    document.getElementById("allDivTask1").style.height = (
        window.innerHeight
        - document.querySelector('#TableCreateTasks2').offsetHeight
        - document.querySelector('#MenuBar1').offsetHeight
    ) + "px";


    //code for manage funds
    document.getElementById("sendButtons1").style.height = (
        window.innerHeight * 0.1
    ) + "px";

    document.getElementById("divButtonsManageFunds2").style.height = (
        window.innerHeight * 0.1
    ) + "px";

    document.getElementById("divButtonsManageFunds1").style.height = (
        window.innerHeight * 0.1
    ) + "px";

    document.getElementById("allWallets").style.height = (
        window.innerHeight
        - document.querySelector('#sendButtons1').offsetHeight
        - document.querySelector('.ButtonsManageFundsClass').offsetHeight
    ) + "px";

    document.getElementById("allWallets2").style.height = (
        window.innerHeight
        - document.querySelector('#sendButtons1').offsetHeight
        - document.querySelector('.ButtonsManageFundsClass').offsetHeight
    ) + "px";


    //code for manage wallets
    document.getElementById("DivManageWallets3").style.height = (
        window.innerHeight
        - document.querySelector('#tableManageWallets2').offsetHeight
        - document.querySelector('#editingPartTable').offsetHeight
        //- document.querySelector('#blankSpace').offsetHeight
    ) + "px";

}

function checkingCheckboxes(divId, checkbox) {
    var checkboxes = document.querySelectorAll(`#${divId} input[type='checkbox']`);
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = checkbox.checked;
    }
}

function toLoadOnOpen() {
    loadWallets('allWallets');
    loadWallets('allWallets2');
    loadWalletsToEdit();
    loadSettings();
}

function hideLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = 0;
    loadingScreen.addEventListener('transitionend', function () {
        loadingScreen.style.display = 'none';
    }, { once: true });
}