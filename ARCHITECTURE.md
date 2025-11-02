# 🏗️ STELLAR MICRO INSURANCE - COMPLETE ARCHITECTURE

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER BROWSER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          React Frontend Application                     │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │              App.js (Main Component)              │ │  │
│  │  │                                                    │ │  │
│  │  │  ┌─────────────┬──────────────┬─────────────┐    │ │  │
│  │  │  │  Dashboard  │ InsuranceForm│  PolicyList │    │ │  │
│  │  │  │  Component  │  Component   │  Component  │    │ │  │
│  │  │  └─────────────┴──────────────┴─────────────┘    │ │  │
│  │  │                      ↓                            │ │  │
│  │  │             StellarService.js                     │ │  │
│  │  │           (Blockchain Integration)               │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                       ↓                                  │  │
│  │    ┌────────────────────────────────────────────────┐   │  │
│  │    │      Freighter Wallet Extension               │   │  │
│  │    │   (Signs transactions & authorizes calls)     │   │  │
│  │    └────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓↓↓
                   (HTTPS / JSON-RPC)
                            ↓↓↓
┌─────────────────────────────────────────────────────────────────┐
│                    STELLAR TESTNET                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Soroban RPC Endpoint                          │  │
│  │  (https://soroban-testnet.stellar.org)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Smart Contract (WASM Binary)                    │  │
│  │                                                          │  │
│  │  ┌─ InsuranceVault Contract ──────────────────────────┐ │  │
│  │  │                                                    │ │  │
│  │  │  Functions:                                        │ │  │
│  │  │  • buy_insurance()     → Issue new policy        │ │  │
│  │  │  • trigger_payout()    → Process claims          │ │  │
│  │  │  • get_policy()        → Read policy details     │ │  │
│  │  │  • get_statistics()    → Vault statistics        │ │  │
│  │  │  • get_total_premiums()→ Total collected         │ │  │
│  │  │                                                    │ │  │
│  │  │  Data Storage:                                     │ │  │
│  │  │  • Policy Records (by policy_id)                 │ │  │
│  │  │  • Vault Statistics (aggregated)                 │ │  │
│  │  │  • Policy Counter (next_id)                      │ │  │
│  │  │                                                    │ │  │
│  │  │  Contract ID (Testnet):                           │ │  │
│  │  │  CBMT5ZHB7D34ATEG5Q3NETD6OOLAU2MOL6YYFUUGY...   │ │  │
│  │  │                                                    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─ Ledger Storage ───────────────────────────────────┐ │  │
│  │  │                                                    │ │  │
│  │  │  Policy Storage:                                   │ │  │
│  │  │  {                                                 │ │  │
│  │  │    id: u64,                                        │ │  │
│  │  │    holder: Address,                                │ │  │
│  │  │    premium: i128 (stroops),                        │ │  │
│  │  │    coverage_amount: i128,                          │ │  │
│  │  │    policy_type: Symbol,                            │ │  │
│  │  │    active: bool,                                   │ │  │
│  │  │    claimed: bool,                                  │ │  │
│  │  │    timestamp: u64                                  │ │  │
│  │  │  }                                                 │ │  │
│  │  │                                                    │ │  │
│  │  │  Vault Stats:                                      │ │  │
│  │  │  {                                                 │ │  │
│  │  │    total_policies: u32,                            │ │  │
│  │  │    total_premiums: i128,                           │ │  │
│  │  │    total_payouts: i128,                            │ │  │
│  │  │    active_policies: u32                            │ │  │
│  │  │  }                                                 │ │  │
│  │  │                                                    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Horizon API (Data Read Operations)               │  │
│  │  (https://horizon-testnet.stellar.org)                 │  │
│  │  • Load account information                             │  │
│  │  • Fetch transaction history                            │  │
│  │  • Get current sequence number                          │  │
│  │  • Submit signed transactions                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Policy Purchase Flow

```
User Action: "Buy Insurance"
     ↓
React InsuranceForm Component
  ├─ Collect premium amount
  ├─ Collect coverage amount
  ├─ Select policy type
     ↓
Call StellarService.buyInsurance()
  ├─ Load user account from Horizon
  ├─ Build transaction with contract call
     ↓
Sign Transaction (Freighter Wallet)
  ├─ User approves in wallet extension
  ├─ Wallet signs with private key
     ↓
Submit to Horizon
  ├─ Transaction enters mempool
  ├─ Wait for inclusion in block
     ↓
Process in Smart Contract
  ├─ Validate inputs
  ├─ Check premium > 0
  ├─ Check coverage ≤ 100x premium
  ├─ Generate policy ID
  ├─ Store policy data
  ├─ Update statistics
     ↓
Success Response
  ├─ Return policy ID
  ├─ Display confirmation
  ├─ Refresh dashboard
```

### 2. Claim Payout Flow

```
User Action: "Claim Insurance"
     ↓
PolicyList Component - Click Claim Button
     ↓
Call StellarService.claimInsurance()
  ├─ Get policy ID
  ├─ Build payout transaction
     ↓
Sign Transaction (Freighter Wallet)
     ↓
Submit to Horizon
     ↓
Process in Smart Contract
  ├─ Verify policy exists
  ├─ Check policy is active
  ├─ Check not already claimed
  ├─ Mark policy as claimed
  ├─ Calculate payout amount
  ├─ Update statistics
  ├─ Deactivate policy
     ↓
Success Response
  ├─ Return payout amount
  ├─ Display confirmation
  ├─ Update policy status
```

### 3. Dashboard Query Flow

```
User Opens Dashboard
     ↓
Dashboard Component Mounts
     ↓
Call StellarService.getStatistics()
     ↓
Query Smart Contract (Read-only)
  ├─ Invoke get_statistics() function
  ├─ No signing required
  ├─ Immediate response
     ↓
Parse Response
  ├─ Extract total_policies
  ├─ Extract total_premiums
  ├─ Extract active_policies
     ↓
Display in UI
  ├─ Total Policies Card
  ├─ Total Premiums Card
  ├─ Active Claims Card
  ├─ User Balance Card
```

## Component Interaction Map

```
App.js (Main)
├─ State: account, policies, activeTab, loading, error
├─ Tabs: Dashboard | Buy | Policies
│
├─ Tab: Dashboard
│  └─ Dashboard.js
│     ├─ Props: account (optional)
│     ├─ State: stats, loading
│     └─ Calls: StellarService.getStatistics()
│
├─ Tab: Buy Insurance
│  └─ InsuranceForm.js
│     ├─ Props: onSubmit, loading
│     ├─ State: formData (premium, coverage, type)
│     └─ Calls: StellarService.buyInsurance()
│
└─ Tab: My Policies
   └─ PolicyList.js
      ├─ Props: policies, onClaim, loading
      ├─ State: policies from parent
      ├─ Display: Policy cards
      └─ Calls: StellarService.claimInsurance()

StellarService.js (Singleton)
├─ Methods:
│  ├─ connectWallet() - Freighter connection
│  ├─ buyInsurance() - Issue policy
│  ├─ claimInsurance() - Process claim
│  ├─ getStatistics() - Get vault stats
│  ├─ getPolicy() - Get policy details
│  ├─ getPolicies() - Get user policies
│  └─ getTotalPremiums() - Get total premiums
│
├─ Config:
│  ├─ CONTRACT_ID
│  ├─ TESTNET_URL
│  ├─ HORIZON_URL
│  └─ TESTNET_PASSPHRASE
│
└─ External APIs:
   ├─ Freighter Wallet
   ├─ Stellar SDK
   └─ Soroban RPC
```

## Security Model

```
User Authentication:
  ├─ Freighter Wallet (browser extension)
  ├─ Private key never exposed
  ├─ Transaction signing local only
  └─ Account address verified

Contract Authorization:
  ├─ Policy holder verification
  ├─ Admin authentication for payouts
  ├─ Wallet signature required
  └─ All inputs validated

Data Validation:
  ├─ Premium must be > 0
  ├─ Coverage must be ≤ 100x premium
  ├─ Policy type must be valid
  ├─ Address must be valid Stellar address
  └─ All checks in contract

On-Chain Security:
  ├─ Immutable policy records
  ├─ Event audit trail
  ├─ Extended TTL (5000 ledgers)
  ├─ Storage protection
  └─ Transaction confirmation
```

## Technology Stack Details

### Frontend Stack
- **React 18.2.0** - UI framework
- **JavaScript ES6+** - Language
- **CSS3** - Styling (Flexbox, Grid, Gradients)
- **Stellar SDK 10.0.0** - Blockchain SDK
- **Freighter API** - Wallet integration
- **Node.js** - Runtime

### Backend Stack
- **Rust 1.70+** - Language
- **Soroban SDK 21.7.7** - Smart contract framework
- **WebAssembly** - Compiled target
- **Stellar Ledger** - Consensus & storage

### Network Stack
- **Stellar Testnet** - Test network
- **Soroban RPC** - Read contract data
- **Horizon API** - Submit transactions
- **JSON-RPC 2.0** - Communication protocol

## Deployment Architecture

```
Development:
  - Local: npm start (React dev server)
  - Build: cargo build --target wasm32-unknown-unknown
  - Test: cargo test

Staging (Testnet):
  - Contract ID: CBMT5ZHB7D34ATEG5Q3NETD6OOLAU2MOL6YYFUUGY2PVQAGWBJTJTAAQ
  - Frontend: Deployed to test server
  - Network: Test SDF Network

Production (Mainnet):
  - Contract: Deploy same WASM binary
  - Frontend: Deployed to production server
  - Network: Public Stellar Network
  - High availability: CDN + Load balancer
```

## File Organization

```
stellar-micro-insurance/
│
├─ contracts/                       [Smart Contract]
│  ├─ src/
│  │  └─ lib.rs                    [Rust contract code]
│  ├─ Cargo.toml                   [Dependencies]
│  └─ Cargo.lock                   [Locked versions]
│
├─ frontend/                        [React App]
│  ├─ src/
│  │  ├─ components/               [UI Components]
│  │  │  ├─ Dashboard/
│  │  │  ├─ InsuranceForm/
│  │  │  └─ PolicyList/
│  │  ├─ services/                 [Business Logic]
│  │  │  └─ StellarService.js
│  │  └─ App.js                    [Main component]
│  ├─ package.json                 [Dependencies]
│  └─ public/                      [Static assets]
│
├─ docs/                            [Documentation]
│  ├─ API_DOCS.md
│  ├─ DEPLOYMENT.md
│  └─ USE_CASES.md
│
└─ Project files                    [Config & Info]
   ├─ README.md
   ├─ SETUP_GUIDE.md
   ├─ PROJECT_SETUP.md
   └─ COMPLETION_REPORT.md
```

---

**This architecture provides a scalable, secure, and user-friendly solution for decentralized microinsurance on the Stellar blockchain.**

All components are production-ready and thoroughly documented.
