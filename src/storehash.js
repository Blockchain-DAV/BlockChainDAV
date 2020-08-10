import web3 from './web3';
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
export const address = "0xDA77Fb7570666e1b7D18D7c3B657C03eb64c4817";

//use the ABI from your contract
export const abi = [
	{
		"inputs": [],
		"name": "getHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "x",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "x",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
export default new web3.eth.Contract(abi, address);