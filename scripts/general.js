const fs = require('fs')
const Web3 = require('web3');
const axios = require('axios');
const Contract = require('web3-eth-contract');
const ethUtil = require('ethereumjs-util');
const { ethers } = require('ethers');
const path = require('path');



const JSONfile = path.resolve(__dirname) + '/AllInfo.json';
const ABIFolder = path.resolve(__dirname) + '/ABIs';
const disperseContract = path.resolve(__dirname) + '/disperseContract.json';

updateDivDimensions();

window.onclick = closeModalOnClickOutside;
window.onload = toLoadOnOpen;
window.onbeforeunload = removeAllTasksJSON
window.addEventListener("load", hideLoadingScreen);
window.addEventListener("resize", updateDivDimensions);
document.addEventListener("click", hideloadWalletsForSelection);