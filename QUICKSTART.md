# Quick Start: Freighter + Stellar CLI

## 🚀 30-Second Setup

### 1. Check Prerequisites
```powershell
# Verify Stellar CLI installed
stellar version

# Verify you're on Testnet
stellar network use test-sdf
```

### 2. Get Your Freighter Address
```powershell
# From http://localhost:3000
# Copy your Freighter address (starts with G)
$myAddress = "GXXXXXX...YOUR_ADDRESS_HERE"
```

### 3. Fund Your Account
```powershell
# Use the wrapper script
node stellar-freighter-wrapper.js --fund $myAddress

# OR manual:
curl https://friendbot.stellar.org?addr=$myAddress
```

### 4. Verify Funding
```powershell
node stellar-freighter-wrapper.js --info $myAddress
```

### 5. Deploy Your Contract
```powershell
node stellar-freighter-wrapper.js --deploy ./contracts $myAddress
```

Expected output:
```
✅ Contract deployed: CXXXXXX...YOUR_CONTRACT_ID
Save this contract ID for future interactions!
```

### 6. Invoke Contract Function
```powershell
node stellar-freighter-wrapper.js --invoke CXXXXXX... buy_insurance buyer=$myAddress amount=1000
```

---

## 📋 Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `--info` | Get account details | `--info GXXXXXX...` |
| `--fund` | Fund account with test XLM | `--fund GXXXXXX...` |
| `--build` | Build WASM contract | `--build ./contracts` |
| `--deploy` | Deploy contract to Testnet | `--deploy ./contracts GXXXXXX...` |
| `--invoke` | Call contract function | `--invoke CXXXXXX... buy_insurance buyer=GXXXXXX... amount=1000` |

---

## 🎯 Common Workflows

### Deploy + Invoke
```powershell
# 1. Build and deploy
node stellar-freighter-wrapper.js --deploy ./contracts $myAddress

# 2. Invoke function (copy contract ID from step 1)
node stellar-freighter-wrapper.js --invoke CXXXXXX... get_statistics
```

### Check Policy
```powershell
# Get policy details
node stellar-freighter-wrapper.js --invoke CXXXXXX... get_policy policy_id=1
```

### Trigger Payout
```powershell
# Trigger insurance payout
node stellar-freighter-wrapper.js --invoke CXXXXXX... trigger_payout policy_id=1
```

---

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| `Stellar CLI not found` | Install from https://github.com/stellar/stellar-cli/releases |
| `Account not found` | Fund with `--fund` command |
| `Network use test-sdf failed` | Ensure Stellar CLI is configured for Testnet |
| `Contract deploy failed` | Check contract builds: `cargo build --target wasm32-unknown-unknown --release` |

---

## 📚 Full Documentation

See `FREIGHTER_STELLAR_CLI_SETUP.md` for detailed setup instructions.

---

## ✅ Checklist

- [ ] Stellar CLI installed
- [ ] Freighter wallet installed
- [ ] Account funded with test XLM
- [ ] Contract built successfully
- [ ] Contract deployed to Testnet
- [ ] Can invoke contract functions
- [ ] Transactions appear in explorer

You're ready to deploy and test your insurance smart contract! 🎉

