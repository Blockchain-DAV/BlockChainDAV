import web3 from './web3';
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
export const address = "0x012c7f63A542e231a722d74DeA63CdCDc5Cc4132";

//use the ABI from your contract
export const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "x",
				"type": "address"
			}
		],
		"name": "sendAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
export default new web3.eth.Contract(abi, address);