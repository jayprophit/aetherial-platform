# Aetherial Platform - Blockchain Component

This directory contains the smart contracts and deployment scripts for the Aetherial Platform's blockchain components.

## Smart Contracts

### GiftCard.sol
A smart contract for creating and managing blockchain-based gift cards with the following features:
- Support for both native tokens (ETH, MATIC) and ERC20 tokens
- Configurable fees for card issuance
- Expiration dates for gift cards
- Secure redemption process
- Fee collection for the platform

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Hardhat
- MetaMask or other Web3 wallet
- Alchemy or Infura account (for deployment to testnet/mainnet)

## Installation

1. Install dependencies:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ALCHEMY_API_KEY=your_alchemy_api_key
   ```

## Compilation

To compile the smart contracts:

```bash
npx hardhat compile
```

## Testing

To run the test suite:

```bash
npx hardhat test
```

## Deployment

### Local Network

1. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```

2. In a separate terminal, deploy the contracts:
   ```bash
   npx hardhat run scripts/deploy_giftcard.js --network localhost
   ```

### Testnet/Mainnet

To deploy to a testnet or mainnet:

```bash
npx hardhat run scripts/deploy_giftcard.js --network mumbai
```

Replace `mumbai` with the desired network from `hardhat.config.js`.

## Smart Contract Verification

After deployment, verify the contract on Etherscan/Polygonscan:

```bash
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS "constructor_arg1" "constructor_arg2"
```

## Security Considerations

- Always audit smart contracts before deploying to mainnet
- Use multi-signature wallets for contract ownership
- Implement time locks for critical operations
- Consider using OpenZeppelin Defender for additional security

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
