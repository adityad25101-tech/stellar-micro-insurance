# Deployment Guide

## 🚀 Deploying to Stellar Testnet

### Step 1: Install Soroban CLI

```bash
cargo install soroban-cli
```

Verify installation:
```bash
soroban --version
```

### Step 2: Create Testnet Account

1. Go to [Friendbot](https://friendbot.stellar.org/)
2. Enter your public key
3. Receive 10,000 XLM test tokens

Or using CLI:
```bash
soroban keys generate --global test-account
```

### Step 3: Build Smart Contract

```bash
cd contracts
cargo build --release --target wasm32-unknown-unknown
```

Output: `target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm`

### Step 4: Deploy Contract

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm \
  --source-account test-account \
  --network testnet
```

This returns your **CONTRACT_ID**. Save this!

### Step 5: Initialize Contract

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source-account test-account \
  --network testnet \
  -- \
  initialize \
  --admin <YOUR_PUBLIC_KEY>
```

### Step 6: Update Frontend

In `frontend/src/services/StellarService.js`:

```javascript
const CONTRACT_ID = '<YOUR_DEPLOYED_CONTRACT_ID>';
```

### Step 7: Deploy Frontend

**Option A: Vercel** (Recommended)
```bash
cd frontend
npm install -g vercel
vercel
```

**Option B: Netlify**
```bash
npm run build
netlify deploy --prod --dir=build
```

**Option C: GitHub Pages**
```bash
npm run build
# Push build/ to gh-pages branch
```

---

## 🔗 Contract Interactions

### Buy Insurance (User)

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source-account user-account \
  --network testnet \
  -- \
  buy_insurance \
  --holder <USER_ADDRESS> \
  --premium 1000000 \
  --coverage_amount 10000000 \
  --policy_type crop_failure
```

### Trigger Payout (Admin)

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source-account test-account \
  --network testnet \
  -- \
  trigger_payout \
  --policy_id 1 \
  --event_type crop_failure
```

### Query Policy

```bash
soroban contract read \
  --id <CONTRACT_ID> \
  --network testnet \
  policy_1
```

---

## 📊 Monitoring & Verification

### Check Contract State

Use [Stellar Expert](https://stellar.expert/explorer/testnet):
1. Search for your CONTRACT_ID
2. View transactions
3. Monitor policy events

### Verify Transaction

```bash
soroban contract tx \
  --id <CONTRACT_ID> \
  --network testnet \
  <TRANSACTION_HASH>
```

---

## 🔄 Upgrade Guide

### Minor Updates (Bug Fixes)

No redeploy needed - just update frontend code.

### Major Updates (New Features)

Deploy new contract version:
```bash
soroban contract deploy \
  --wasm new_contract.wasm \
  --source-account test-account \
  --network testnet
```

Update frontend CONTRACT_ID.

---

## ⚠️ Troubleshooting

### Contract Deploy Fails
- Check account has XLM: `soroban account --network testnet --id <ADDRESS>`
- Verify WASM file exists: `ls target/wasm32-unknown-unknown/release/`

### Transaction Rejected
- Ensure source account has enough balance
- Check parameters format (stroops, not dollars)
- Verify admin authorization

### Frontend Won't Connect
- Check CONTRACT_ID is correct
- Ensure Freighter is installed
- Verify testnet selection in Freighter

---

## 📈 Performance Notes

- Contract size: ~100KB (optimized)
- Deploy cost: ~1,000 stroops (~$0.0001)
- Transaction cost: ~100 stroops per operation
- Average claim processing: <30 seconds

---

## 🎯 Mainnet Deployment

When ready for production:

```bash
soroban contract deploy \
  --wasm stellar_micro_insurance.wasm \
  --source-account main-account \
  --network public
```

**⚠️ Mainnet Considerations:**
- Use real USDC token
- Implement oracle integration (Chainlink/Band)
- External security audit recommended
- Multi-sig admin wallet
- Fund emergency pausing mechanism
