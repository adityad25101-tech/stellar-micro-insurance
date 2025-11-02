# 📚 Stellar Micro Insurance - Help Book

Welcome to the complete Stellar Micro Insurance Platform project guide!

## 🎯 Quick Navigation

### Getting Started
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Quick Start](#quick-start)

### Development
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Building the Project](#building-the-project)
- [Deployment](#deployment)

### Reference
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The Stellar Micro Insurance Platform is a complete decentralized insurance solution built on the Stellar blockchain.

**Features:**
- ✅ Purchase micro-insurance policies
- ✅ Automatic claim processing
- ✅ Real-time dashboard
- ✅ Freighter wallet integration
- ✅ Blockchain-verified transactions

**Technologies:**
- **Backend**: Rust + Soroban SDK (Smart Contract)
- **Frontend**: React + JavaScript
- **Blockchain**: Stellar (Testnet/Mainnet)
- **Wallet**: Freighter

---

## Architecture

```
┌─────────────────────────────────┐
│     React Frontend (Web UI)     │
│  - Dashboard                    │
│  - Insurance Form               │
│  - Policy List                  │
│  - Freighter Integration        │
└──────────────┬──────────────────┘
               │
               ↓ (HTTPS/JSON-RPC)
┌─────────────────────────────────┐
│   Stellar Testnet / Mainnet     │
│  - Soroban Smart Contract       │
│  - Policy Storage               │
│  - Claim Processing             │
│  - Statistics Tracking          │
└─────────────────────────────────┘
```

---

## Installation

### Prerequisites
- Node.js 16+ (for frontend)
- Rust 1.70+ (for smart contract)
- Freighter Wallet (browser extension)
- Stellar Testnet Account

### Step 1: Install Dependencies

```bash
# Backend
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Frontend
cd ../frontend
npm install
```

### Step 2: Configure

Update `frontend/src/services/StellarService.js`:
```javascript
const CONTRACT_ID = 'YOUR_DEPLOYED_CONTRACT_ID';
```

### Step 3: Run

```bash
# Terminal 1: Start frontend
cd frontend
npm start

# Terminal 2: Watch contracts (optional)
cd contracts
cargo watch -x build
```

---

## Quick Start

### 1. Build Smart Contract
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

### 2. Deploy to Testnet
```bash
stellar contract deploy \
  --network testnet \
  --source-account YOUR_ACCOUNT \
  --wasm target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm
```

### 3. Start Frontend
```bash
cd frontend
npm start
```

### 4. Open Browser
```
http://localhost:3000
```

---

## Backend Setup

### Smart Contract Structure

**Location**: `contracts/src/lib.rs`

**Core Functions**:

#### buy_insurance()
Purchase a new insurance policy
```rust
pub fn buy_insurance(
    env: Env,
    holder: Address,
    premium: i128,
    coverage_amount: i128,
    policy_type: Symbol,
) -> u64
```

#### trigger_payout()
Process a claim payout
```rust
pub fn trigger_payout(
    env: Env,
    policy_id: u64,
    event_type: Symbol,
) -> i128
```

#### get_statistics()
Retrieve vault statistics
```rust
pub fn get_statistics(env: Env) -> VaultStats
```

#### get_policy()
Get specific policy details
```rust
pub fn get_policy(env: &Env, policy_id: u64) -> Policy
```

#### get_total_premiums()
Get total premiums collected
```rust
pub fn get_total_premiums(env: Env) -> i128
```

### Data Structures

```rust
Policy {
  id: u64,
  holder: Address,
  premium: i128,
  coverage_amount: i128,
  policy_type: Symbol,
  active: bool,
  claimed: bool,
  timestamp: u64
}

VaultStats {
  total_policies: u32,
  total_premiums: i128,
  total_payouts: i128,
  active_policies: u32
}
```

### Testing

```bash
cd contracts
cargo test
```

---

## Frontend Setup

### Component Structure

**Location**: `frontend/src/`

#### Dashboard.js
- Displays vault statistics
- Shows total policies issued
- Displays total premiums collected
- Real-time updates

#### InsuranceForm.js
- Policy purchase form
- Premium input
- Coverage input
- Policy type selection
- Submit button with wallet signing

#### PolicyList.js
- View user policies
- Policy status display
- Claim button
- Transaction history

#### App.js
- Main application wrapper
- Tab navigation
- Wallet connection
- State management

#### StellarService.js
- Blockchain integration
- Freighter wallet connection
- Contract function calls
- Transaction signing

### Styling

- `App.css` - Global styles
- `Dashboard.css` - Dashboard styling
- `InsuranceForm.css` - Form styling
- `PolicyList.css` - Policy list styling

### Dependencies

```json
{
  "react": "^18.2.0",
  "stellar-sdk": "^10.0.0",
  "axios": "^1.4.0",
  "tailwindcss": "^3.3.0"
}
```

---

## Building the Project

### Build Contract to WASM

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

**Output**: `contracts/target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm`

### Build Frontend

```bash
cd frontend
npm run build
```

**Output**: `frontend/build/`

---

## Deployment

### Deploy to Testnet

1. **Create testnet account**
   - Visit: https://laboratory.stellar.org/#account-creator

2. **Deploy contract**
   ```bash
   stellar contract deploy \
     --network testnet \
     --source-account YOUR_ACCOUNT \
     --wasm target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm
   ```

3. **Copy contract ID**
   - Save the returned contract ID

4. **Update frontend**
   - Edit `frontend/src/services/StellarService.js`
   - Replace `CONTRACT_ID` with deployed ID

5. **Deploy frontend**
   ```bash
   npm run build
   # Deploy build/ folder to hosting service
   ```

### Deploy to Mainnet

Same process but use `--network public` instead of `--network testnet`

---

## API Documentation

### Contract Functions

#### buy_insurance
**Method**: Invoke  
**Auth**: Policy holder required  
**Params**: holder, premium, coverage_amount, policy_type  
**Returns**: policy_id (u64)  
**Gas**: ~15,000 stroops

**Example**:
```javascript
const policyId = await contract.invoke({
  method: 'buy_insurance',
  args: [holderAddress, 5000000, 50000000, 'crop_failure']
});
```

#### trigger_payout
**Method**: Invoke  
**Auth**: Admin required  
**Params**: policy_id, event_type  
**Returns**: payout_amount (i128)  
**Gas**: ~20,000 stroops

**Example**:
```javascript
const payout = await contract.invoke({
  method: 'trigger_payout',
  args: [1, 'verified_claim']
});
```

#### get_statistics
**Method**: Query (read-only)  
**Returns**: VaultStats object  
**Gas**: ~3,000 stroops

**Example**:
```javascript
const stats = await contract.read({
  method: 'get_statistics'
});
// Returns: { total_policies, total_premiums, active_policies }
```

#### get_policy
**Method**: Query (read-only)  
**Params**: policy_id  
**Returns**: Policy object  
**Gas**: ~5,000 stroops

**Example**:
```javascript
const policy = await contract.read({
  method: 'get_policy',
  args: [1]
});
```

#### get_total_premiums
**Method**: Query (read-only)  
**Returns**: i128 (total stroops)  
**Gas**: ~3,000 stroops

**Example**:
```javascript
const total = await contract.read({
  method: 'get_total_premiums'
});
```

---

## Project Structure

```
stellar-micro-insurance/
│
├── contracts/                    [Smart Contract]
│   ├── src/
│   │   ├── lib.rs              [Main contract code]
│   │   └── tests/              [Tests]
│   ├── Cargo.toml              [Rust dependencies]
│   └── Cargo.lock
│
├── frontend/                    [React Application]
│   ├── src/
│   │   ├── components/         [React components]
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── InsuranceForm.js
│   │   │   ├── InsuranceForm.css
│   │   │   ├── PolicyList.js
│   │   │   └── PolicyList.css
│   │   ├── services/           [Business logic]
│   │   │   └── StellarService.js
│   │   ├── App.js              [Main component]
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json            [NPM dependencies]
│   ├── public/                 [Static files]
│   └── config-overrides.js     [Webpack config]
│
├── docs/                        [Documentation]
│   ├── API_DOCS.md
│   ├── DEPLOYMENT.md
│   └── USE_CASES.md
│
├── README.md                    [Project overview]
└── HELP_BOOK.md                [This file]
```

---

## Troubleshooting

### Freighter Wallet Not Found
**Solution**: 
1. Install Freighter: https://www.freighter.app
2. Enable extension in browser
3. Refresh page
4. Try connecting again

### Contract Deployment Failed
**Solutions**:
1. Check testnet account has lumens
2. Verify contract builds without errors
3. Check Soroban RPC is accessible
4. Use stellar-cli latest version

### Frontend Won't Connect
**Solutions**:
1. Update CONTRACT_ID in StellarService.js
2. Verify contract is deployed on same network
3. Check Freighter has correct network selected
4. Check browser console for errors

### Build Errors in Rust
**Solutions**:
1. Update Rust: `rustup update`
2. Clear build: `cargo clean`
3. Check Soroban SDK version
4. Rebuild: `cargo build --target wasm32-unknown-unknown`

### NPM Installation Issues
**Solutions**:
1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Delete package-lock.json: `rm package-lock.json`
4. Reinstall: `npm install`

---

## Network Configuration

### Testnet
- **Network**: Stellar Test SDF Network
- **Horizon**: https://horizon-testnet.stellar.org
- **Soroban RPC**: https://soroban-testnet.stellar.org
- **Account Creator**: https://laboratory.stellar.org/#account-creator

### Mainnet
- **Network**: Public Stellar Network
- **Horizon**: https://horizon.stellar.org
- **Soroban RPC**: https://soroban-mainnet.stellar.org

---

## Security Considerations

✅ **Always**:
- Keep private keys secure
- Use Freighter for signing
- Validate all user inputs
- Test on testnet first

❌ **Never**:
- Expose private keys
- Skip input validation
- Deploy untested contracts
- Use hardcoded credentials

---

## Support & Resources

- **Stellar Docs**: https://developers.stellar.org/
- **Soroban SDK**: https://soroban.stellar.org/
- **Freighter Docs**: https://docs.freighter.app/
- **GitHub**: https://github.com/adityad25101-tech/stellar-micro-insurance

---

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

This project is licensed under the MIT License.

---

**Last Updated**: November 2, 2025  
**Version**: 1.0.0  
**Status**: Production Ready

For questions or support, open an issue on GitHub.
