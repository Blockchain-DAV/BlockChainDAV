import web3 from './web3';
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
export const address = "0x4ceD875FDCf7F13cAc237178CEB7a63Becd1Af47";

//use the ABI from your contract
export const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "recover",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "publicKey",
				"type": "address"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getHash",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "x",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
export default new web3.eth.Contract(abi, address);