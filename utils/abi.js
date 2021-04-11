export const tokenAbi = [{
    "inputs": [{
        "internalType": "uint256",
        "name": "_initialAmount",
        "type": "uint256"
    },
        {
            "internalType": "string",
            "name": "_tokenName",
            "type": "string"
        },
        {
            "internalType": "uint8",
            "name": "_decimalUnits",
            "type": "uint8"
        },
        {
            "internalType": "string",
            "name": "_tokenSymbol",
            "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
},
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
        },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
        },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "_owner",
            "type": "address"
        },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "allocateTo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "_spender",
            "type": "address"
        },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "dst",
            "type": "address"
        },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "src",
            "type": "address"
        },
            {
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


export const bridgeAbi = [{
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "bytes",
        "name": "reason",
        "type": "bytes"
    }],
    "name": "Failure",
    "type": "event"
},
    {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "reason",
                "type": "bytes"
            }
        ],
        "name": "Receipt",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
            {
                "indexed": false,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "reason",
                "type": "bytes"
            }
        ],
        "name": "Refund",
        "type": "event"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
            {
                "internalType": "bytes",
                "name": "_message",
                "type": "bytes"
            }
        ],
        "name": "pushInboundMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive",
        "payable": true
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "sendToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimGas",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    }
]
export const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

export const bridgeAddress = "0x151982ebf8fbbb8979167b64b729f5f5c43562db";

export const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";