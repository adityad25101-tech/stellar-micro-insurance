# Stellar Micro Insurance Platform - Complete Implementation

A decentralized insurance platform built on the Stellar blockchain using Soroban smart contracts and React frontend.

## 📋 Project Structure

```
stellar-micro-insurance/
├── contracts/                 # Rust Smart Contract
│   ├── src/
│   │   └── lib.rs           # Soroban insurance contract
│   ├── Cargo.toml           # Contract dependencies
│   ├── Cargo.lock           # Dependency lock file
│   └── tests/               # Integration tests
│
├── frontend/                # React Application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js       # Dashboard overview
│   │   │   ├── Dashboard.css
│   │   │   ├── InsuranceForm.js   # Policy purchase form
│   │   │   ├── InsuranceForm.css
│   │   │   ├── PolicyList.js      # User policies display
│   │   │   └── PolicyList.css
│   │   ├── services/
│   │   │   └── StellarService.js  # Blockchain integration
│   │   ├── App.js           # Main application component
│   │   ├── App.css          # Main styles
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   └── config-overrides.js  # Webpack configuration
│
├── docs/                    # Documentation
│   ├── API_DOCS.md
│   ├── DEPLOYMENT.md
│   └── USE_CASES.md
│
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Rust 1.70+
- Freighter Wallet extension
- Stellar Testnet account

### Backend Setup (Smart Contract)

```bash
cd contracts

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Deploy to testnet (requires stellar-cli)
stellar contract deploy --network testnet --source-account <ACCOUNT_ID> --wasm target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## 🔧 Smart Contract Functions

### 1. buy_insurance()
Purchase a new insurance policy
- **Parameters**: holder, premium (stroops), coverage_amount, policy_type
- **Returns**: policy_id
- **Auth**: Policy holder required

### 2. trigger_payout()
Process a claim payout
- **Parameters**: policy_id, event_type
- **Returns**: payout_amount
- **Auth**: Admin required

### 3. get_policy()
Retrieve policy details
- **Parameters**: policy_id
- **Returns**: Policy object

### 4. get_statistics()
Get vault statistics
- **Returns**: VaultStats object with total_policies, total_premiums, active_policies

### 5. get_total_premiums()
Get total premiums collected
- **Returns**: Total premiums in stroops

## 💻 Frontend Components

### Dashboard
- Real-time vault statistics
- Total policies issued
- Total premiums collected
- Active claims count

### Insurance Form
- Select policy type
- Set custom premium and coverage
- One-click purchase with Freighter signing
- Form validation

### Policy List
- View all user policies
- Policy status (active/claimed)
- Claim insurance button
- Transaction history

## 🔐 Security Features

- **Wallet Authentication**: Freighter integration for secure signing
- **Input Validation**: All contract parameters validated
- **Storage Protection**: Extended TTL for data persistence
- **Event Audit Trail**: All transactions recorded on-chain

## 📊 Policy Types

1. **Crop Failure Insurance** - Agricultural protection
2. **Flood Protection** - Water damage coverage
3. **Accident Insurance** - Accident protection
4. **Device Damage** - Electronics coverage

## 🌐 Network Configuration

- **Network**: Stellar Testnet
- **Horizon Endpoint**: https://horizon-testnet.stellar.org
- **Soroban RPC**: https://soroban-testnet.stellar.org
- **Chain**: Test SDF Network ; September 2015

## 📝 Contract Details

- **Language**: Rust with Soroban SDK 21.7.7
- **Target**: wasm32-unknown-unknown
- **Features**: +reference-types, +bulk-memory, +simd128
- **Optimization**: Level z with LTO

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

## 🚀 Deployment Steps

### 1. Deploy Contract
```bash
cargo build --target wasm32-unknown-unknown --release
stellar contract deploy \
  --network testnet \
  --source-account <YOUR_ACCOUNT> \
  --wasm target/wasm32-unknown-unknown/release/stellar_micro_insurance.wasm
```

### 2. Update Frontend
Replace `CONTRACT_ID` in `frontend/src/services/StellarService.js` with deployed contract ID

### 3. Run Frontend
```bash
cd frontend
npm install
npm start
```

## 🧪 Testing

### Contract Tests
```bash
cd contracts
cargo test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Mobile Support
- Responsive design for mobile devices
- Touch-friendly UI components
- Mobile wallet integration ready

## 🔄 Future Enhancements

### Short-term (3-6 months)
- Multi-currency support
- Policy renewal functionality
- Withdrawal mechanisms

### Mid-term (6-12 months)
- Insurance pools
- Risk-based tiers
- Analytics dashboard
- NFT certificates

### Long-term (12+ months)
- Cross-chain compatibility
- DAO governance
- Insurance marketplace
- AI risk assessment

## 📚 Documentation

- **API_DOCS.md**: Complete contract API reference
- **DEPLOYMENT.md**: Deployment guide
- **USE_CASES.md**: Real-world use cases

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under MIT License

## 🙏 Acknowledgments

- Stellar Development Foundation
- Soroban SDK team
- Freighter wallet team

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/adityad25101-tech/stellar-micro-insurance/issues
- Email: adityad25101@iiitnr.edu.in

---

**Status**: Ready for Testnet Deployment
**Version**: 1.0.0
**Last Updated**: November 2025
