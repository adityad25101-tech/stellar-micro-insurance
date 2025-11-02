# API Reference

## Smart Contract Functions

### Overview

The **InsuranceVault** contract manages all insurance operations on Stellar/Soroban. It tracks policies, premiums, and processes claims automatically.

---

## 1. Initialize Contract

### Function: `initialize(env, admin)`

Sets up the insurance vault with an admin account.

**Parameters:**
```rust
pub fn initialize(env: Env, admin: Address)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |
| `admin` | `Address` | Wallet address with payout permissions |

**Usage Example:**
```bash
soroban contract invoke \
  --id CBUY7C... \
  --source-account admin \
  --network testnet \
  -- \
  initialize \
  --admin GBXU...
```

---

## 2. Purchase Insurance

### Function: `buy_insurance(env, holder, premium, coverage_amount, policy_type)`

User purchases an insurance policy.

**Parameters:**
```rust
pub fn buy_insurance(
    env: Env,
    holder: Address,
    premium: u128,
    coverage_amount: u128,
    policy_type: Symbol,
) -> u64
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |
| `holder` | `Address` | Policy buyer's address |
| `premium` | `u128` | Amount paid (in stroops: 1 USDC = 10,000,000) |
| `coverage_amount` | `u128` | Payout if claim approved (in stroops) |
| `policy_type` | `Symbol` | Policy category (see types below) |

**Returns:** `u64` - Unique policy ID

**Policy Types:**
```
"crop_failure"      - Agricultural coverage
"flood_protection"  - Water damage coverage
"accident"         - Personal injury coverage
"device"           - Electronics damage coverage
```

**Stroops Conversion:**
```
$0.01 = 100,000 stroops
$0.10 = 1,000,000 stroops
$1.00 = 10,000,000 stroops
```

**JavaScript Example:**
```javascript
const policyId = await StellarService.buyInsurance(
  account,
  premium = "0.50",   // $0.50
  coverage = "5",     // $5.00
  policyType = "crop_failure"
);
console.log("Policy ID:", policyId);
```

**Rust Contract Example:**
```rust
let policy_id = InsuranceVault::buy_insurance(
    env,
    user_address,
    1_000_000,          // $0.10 premium
    10_000_000,         // $1.00 coverage
    Symbol::new(&env, "crop_failure"),
);
```

**Events Emitted:**
```
Event: insurance_bought
{
  holder: Address,
  policy_id: u64,
  premium: u128,
  policy_type: Symbol
}
```

---

## 3. Retrieve Policy

### Function: `get_policy(env, policy_id)`

Get details of a specific policy.

**Parameters:**
```rust
pub fn get_policy(env: Env, policy_id: u64) 
    -> Option<(u64, Address, u128, u128, Symbol, bool, bool, u64)>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |
| `policy_id` | `u64` | ID of policy to retrieve |

**Returns:** 
```
Option<(
  policy_id: u64,
  holder: Address,
  premium: u128,
  coverage_amount: u128,
  policy_type: Symbol,
  active: bool,
  claimed: bool,
  timestamp: u64
)>
```

**Usage Example:**
```bash
soroban contract read \
  --id CBUY7C... \
  --network testnet \
  policy_1
```

**Response:**
```json
{
  "policy_id": 1,
  "holder": "GBXU...",
  "premium": 1000000,
  "coverage_amount": 10000000,
  "policy_type": "crop_failure",
  "active": true,
  "claimed": false,
  "timestamp": 1735900800
}
```

---

## 4. Trigger Payout

### Function: `trigger_payout(env, policy_id, event_type)`

Admin triggers insurance claim for a qualifying event.

**Parameters:**
```rust
pub fn trigger_payout(
    env: Env,
    policy_id: u64,
    event_type: Symbol,
) -> u128
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |
| `policy_id` | `u64` | Policy to pay out |
| `event_type` | `Symbol` | Event that triggered claim |

**Returns:** `u128` - Payout amount (in stroops)

**Validation Rules:**
- ✓ Event type must match policy type
- ✓ Policy must be active
- ✓ Policy must not already be claimed
- ✓ Only admin can trigger

**Usage Example:**
```bash
soroban contract invoke \
  --id CBUY7C... \
  --source-account admin \
  --network testnet \
  -- \
  trigger_payout \
  --policy_id 1 \
  --event_type crop_failure
```

**Events Emitted:**
```
Event: payout_processed
{
  holder: Address,
  amount: u128,
  event_type: Symbol
}
```

**Response:**
```json
{
  "payout_amount": 10000000,
  "policy_id": 1,
  "timestamp": 1735900960
}
```

---

## 5. Get Total Premiums

### Function: `get_total_premiums(env)`

Query total premiums collected in vault.

**Parameters:**
```rust
pub fn get_total_premiums(env: Env) -> u128
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |

**Returns:** `u128` - Total collected (in stroops)

**Usage Example:**
```bash
soroban contract invoke \
  --id CBUY7C... \
  --network testnet \
  -- \
  get_total_premiums
```

**Response:**
```json
{
  "total_premiums": 50000000
}
```
Means: 50,000,000 stroops = $5.00 total premiums

---

## 6. Get Active Policies Count

### Function: `get_active_policies(env)`

Count total policies in vault.

**Parameters:**
```rust
pub fn get_active_policies(env: Env) -> u64
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |

**Returns:** `u64` - Number of policies

**Usage Example:**
```bash
soroban contract invoke \
  --id CBUY7C... \
  --network testnet \
  -- \
  get_active_policies
```

**Response:**
```json
{
  "policy_count": 15
}
```

---

## Frontend SDK

### StellarService Class

JavaScript/React integration class.

#### Methods

**connectWallet()**
```javascript
const account = await StellarService.connectWallet();
// Returns: { address: "GBXU...", balance: "1000" }
```

**buyInsurance(account, premium, coverage, policyType)**
```javascript
const result = await StellarService.buyInsurance(
  account,
  "0.50",           // premium in USDC
  "5",              // coverage in USDC
  "crop_failure"    // policy type
);
// Returns: { policyId: 1, txHash: "abc123..." }
```

**claimInsurance(account, policyId)**
```javascript
const result = await StellarService.claimInsurance(
  account,
  1  // policy ID
);
// Returns: { claimId: 1, txHash: "def456..." }
```

**getPolicies(account)**
```javascript
const policies = await StellarService.getPolicies(account);
// Returns: Array of policy objects
```

**getDashboardStats(account)**
```javascript
const stats = await StellarService.getDashboardStats(account);
// Returns: { totalPolicies, totalPremiums, activeClaims }
```

---

## Error Handling

### Common Errors

```
PolicyNotFound
├─ Cause: Policy ID doesn't exist
├─ Solution: Verify policy_id parameter
└─ Example: get_policy(env, 999)

EventTypeMismatch
├─ Cause: Event type ≠ policy type
├─ Solution: Use matching event type
└─ Example: Policy="crop_failure", Event="flood"

PolicyAlreadyClaimed
├─ Cause: Can't claim twice
├─ Solution: Check claimed status first
└─ Example: get_policy() shows claimed=true

UnauthorizedPayout
├─ Cause: Non-admin triggered payout
├─ Solution: Use admin account
└─ Example: Wrong source-account used
```

---

## Rate Limits & Constraints

| Constraint | Value | Notes |
|-----------|-------|-------|
| Min Premium | 100,000 stroops | $0.01 |
| Max Premium | 100,000,000,000 stroops | $10,000 |
| Max Coverage | 1,000,000,000,000 stroops | $100,000 |
| Policy Expiry | None | Perpetual |
| Max Policies/User | Unlimited | Scalable |
| Transaction Fee | ~100 stroops | $0.00001 |

---

## Testing

### Unit Tests

```bash
cd contracts
cargo test
```

### Integration Tests

```bash
soroban contract invoke --network testnet ...
```

### Load Testing

```bash
# Generate 100 policies
for i in {1..100}; do
  soroban contract invoke \
    --id CBUY7C... \
    --source-account test-$i \
    --network testnet \
    -- \
    buy_insurance \
    --holder GBXU$i \
    --premium 1000000 \
    --coverage_amount 10000000 \
    --policy_type crop_failure
done
```

---

## Webhooks & Events

### Supported Events

```
on_policy_created
├─ Triggered when: buy_insurance() called
└─ Data: { policy_id, holder, premium }

on_payout_processed
├─ Triggered when: trigger_payout() called
└─ Data: { policy_id, amount, event_type }

on_premium_collected
├─ Triggered when: Policy created
└─ Data: { total_premiums, policy_count }
```

---

## Support & Resources

- **Docs**: [https://docs.stellar.org](https://docs.stellar.org)
- **Explorer**: [https://stellar.expert](https://stellar.expert)
- **Issues**: Create GitHub issue in project repo
- **Chat**: Stellar Discord #soroban
