# Freighter + Stellar CLI Integration Guide

## Overview
This guide shows how to connect your Freighter wallet with Stellar CLI for:
- ✅ Deploy smart contracts to Stellar Testnet
- ✅ Sign transactions using Freighter
- ✅ Manage insurance policies
- ✅ Test contract functions

---

## Step 1: Install Stellar CLI

### Windows (PowerShell)
```powershell
# Install using Chocolatey (if installed)
choco install stellar-cli

# OR download manually
# Download from: https://github.com/stellar/stellar-cli/releases
# Extract and add to PATH
```

### Verify Installation
```powershell
stellar version
```

Expected output:
```
stellar-cli 20.x.x
```

---

## Step 2: Get Your Freighter Public Key

### From Browser:
1. Open http://localhost:3000
2. Enter your Freighter wallet address in the manual input field
3. OR click "Connect Freighter" if working
4. Copy your public key (starts with `G`)

### From Freighter Extension:
1. Click Freighter icon in browser
2. Your account address is displayed
3. Copy it (e.g., `GXXXXXX...`)

---

## Step 3: Fund Your Testnet Account

### Option A: Using Stellar Testnet Friendbot
```powershell
# Fund your account with test XLM
curl https://friendbot.stellar.org?addr=GXXXXXX...YOUR_ADDRESS_HERE

# Or in PowerShell:
$address = "GXXXXXX...YOUR_ADDRESS_HERE"
Invoke-WebRequest -Uri "https://friendbot.stellar.org?addr=$address"
```

### Option B: Using Stellar Laboratory
1. Go to: https://laboratory.stellar.org/
2. Navigate to "Fund Account"
3. Paste your Freighter address
4. Click Fund

---

## Step 4: Configure Stellar CLI with Your Freighter Account

### Create a Testnet Configuration
```powershell
# Set Stellar CLI to use Testnet
stellar network use test-sdf

# Add your Freighter account to CLI
# Replace GXXXXXX... with your actual address
$publicKey = "GXXXXXX...YOUR_ADDRESS_HERE"

# Store it as an account (for reference)
stellar account info $publicKey
```

### Expected Output:
```
Account ID: GXXXXXX...
Balances:
  10000.0000000 XLM

Signers:
  Signer 1: GXXXXXX...

Limits:
  ...
```

---

## Step 5: Deploy Your Smart Contract with Stellar CLI

### Using Soroban CLI (Stellar's Smart Contract Tool)

```powershell
# Navigate to contracts directory
cd c:\Users\adity\OneDrive\Desktop\stellar\stellar-micro-insurance\contracts

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Initialize Soroban CLI (one time)
soroban contract invoke --help

# Get your account sequence number
$publicKey = "GXXXXXX...YOUR_ADDRESS_HERE"
stellar account info $publicKey
```

### Deploy to Testnet
```powershell
# Set network to testnet
soroban network use test-sdf

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm \
  --source-account $publicKey \
  --network test-sdf

# Store the returned contract ID for later use
# Example output: CXXXXXX...
```

---

## Step 6: Sign Transactions with Freighter

### Method 1: Using Frontend (Recommended)
```javascript
// In your React app (index.html)
const signTransaction = async (transactionXDR) => {
    const signedXDR = await window.freighter.signTransaction(transactionXDR);
    return signedXDR;
};
```

### Method 2: Using Stellar CLI with Freighter
```powershell
# This requires a custom wrapper script
# See stellar-cli-wrapper.js below

node stellar-cli-wrapper.js --sign-transaction
```

---

## Step 7: Call Smart Contract Functions

### Using Soroban CLI

```powershell
# Replace CONTRACT_ID with your deployed contract ID
$contractId = "CXXXXXX...YOUR_CONTRACT_ID"
$publicKey = "GXXXXXX...YOUR_ADDRESS_HERE"

# Example: Call buy_insurance function
soroban contract invoke \
  --id $contractId \
  --source-account $publicKey \
  --network test-sdf \
  --function buy_insurance \
  --arg buyer=$publicKey \
  --arg amount=1000

# Example: Check policy details
soroban contract invoke \
  --id $contractId \
  --source-account $publicKey \
  --network test-sdf \
  --function get_policy \
  --arg policy_id=1
```

---

## Step 8: Monitor Transactions

### Check Transaction Status
```powershell
# Get recent transactions for your account
stellar transaction list --account $publicKey

# Get specific transaction details
stellar transaction info TXHASH_HERE
```

### View on Testnet Explorer
```
https://testnet.stellar.expert/entity/GXXXXXX...YOUR_ADDRESS_HERE
```

---

## Quick Setup Checklist

- [ ] Stellar CLI installed (`stellar version`)
- [ ] Freighter installed and unlocked
- [ ] Freighter account funded with test XLM
- [ ] Freighter public key copied
- [ ] Testnet configured (`stellar network use test-sdf`)
- [ ] Smart contract built (`cargo build --target wasm32-unknown-unknown --release`)
- [ ] Contract deployed and contract ID saved
- [ ] Frontend connected to Freighter
- [ ] Can call contract functions via CLI or frontend

---

## Troubleshooting

### Error: "Account not found"
```powershell
# Solution: Fund your account
Invoke-WebRequest -Uri "https://friendbot.stellar.org?addr=$publicKey"
```

### Error: "Freighter not responding"
- [ ] Check Freighter is unlocked
- [ ] Check browser permissions
- [ ] Restart browser
- [ ] Check DevTools console for errors

### Error: "Invalid contract ID"
- [ ] Re-deploy the contract
- [ ] Copy full contract ID (starts with C)
- [ ] Verify contract deployed to Testnet

### Error: "Sequence number mismatch"
```powershell
# Get latest sequence number
stellar account info $publicKey

# Use in subsequent transactions
```

---

## Advanced: Transaction Wrapper Script

See `stellar-cli-wrapper.js` for a Node.js script that:
- Connects to Freighter
- Builds transactions
- Signs with Freighter
- Submits to Stellar Network

---

## Useful Links

- 📚 Stellar Docs: https://developers.stellar.org/
- 🔗 Soroban Guide: https://soroban.stellar.org/
- 🦁 Freighter Docs: https://freighter.app/
- 🧪 Testnet Explorer: https://testnet.stellar.expert/
- 🛠️ Stellar Laboratory: https://laboratory.stellar.org/
- 💰 Testnet Faucet: https://friendbot.stellar.org/

---

## Summary

1. **Install Stellar CLI** ✅
2. **Get Freighter Public Key** ✅
3. **Fund Testnet Account** ✅
4. **Configure CLI for Testnet** ✅
5. **Build Smart Contract** ✅
6. **Deploy Contract** ✅
7. **Sign Transactions with Freighter** ✅
8. **Call Contract Functions** ✅

You now have a complete setup for testing and deploying your insurance smart contract!

