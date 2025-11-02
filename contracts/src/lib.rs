#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, Env, Address, Symbol, symbol_short, Map};

// Insurance Policy Structure
#[contracttype]
#[derive(Clone)]
pub struct Policy {
    pub id: u64,
    pub holder: Address,
    pub premium: i128,
    pub coverage_amount: i128,
    pub policy_type: Symbol,
    pub active: bool,
    pub claimed: bool,
    pub timestamp: u64,
}

// Policy Statistics
#[contracttype]
#[derive(Clone)]
pub struct VaultStats {
    pub total_policies: u32,
    pub total_premiums: i128,
    pub total_payouts: i128,
    pub active_policies: u32,
}

// Storage keys
#[contracttype]
pub enum PolicyBook {
    Policy(u64),
}

// Constants
const POLICY_COUNT: Symbol = symbol_short!("POL_CNT");
const STATS: Symbol = symbol_short!("STATS");

#[contract]
pub struct InsuranceVault;

#[contractimpl]
impl InsuranceVault {
    /// Purchase a new insurance policy
    pub fn buy_insurance(
        env: Env,
        holder: Address,
        premium: i128,
        coverage_amount: i128,
        policy_type: Symbol,
    ) -> u64 {
        holder.require_auth();
        
        // Validation
        assert!(premium > 0, "Premium must be greater than 0");
        assert!(
            coverage_amount <= premium * 100,
            "Coverage cannot exceed 100x premium"
        );

        // Get next policy ID
        let mut policy_id: u64 = env.storage().instance().get(&POLICY_COUNT).unwrap_or(0);
        policy_id += 1;

        // Create policy
        let policy = Policy {
            id: policy_id,
            holder: holder.clone(),
            premium,
            coverage_amount,
            policy_type,
            active: true,
            claimed: false,
            timestamp: env.ledger().timestamp(),
        };

        // Store policy
        env.storage().instance().set(&PolicyBook::Policy(policy_id), &policy);
        env.storage().instance().set(&POLICY_COUNT, &policy_id);

        // Update stats
        Self::update_stats(&env, premium, 0);
        env.storage().instance().extend_ttl(5000, 5000);

        policy_id
    }

    /// Trigger a payout for a verified claim
    pub fn trigger_payout(env: Env, policy_id: u64, _event_type: Symbol) -> i128 {
        // Get policy
        let mut policy = Self::get_policy(&env, policy_id);

        assert!(policy.active, "Policy is not active");
        assert!(!policy.claimed, "Policy already claimed");

        let payout_amount = policy.coverage_amount;
        
        // Mark as claimed
        policy.claimed = true;
        policy.active = false;

        env.storage().instance().set(&PolicyBook::Policy(policy_id), &policy);
        Self::update_stats(&env, 0, payout_amount);
        env.storage().instance().extend_ttl(5000, 5000);

        payout_amount
    }

    /// Get a specific policy
    pub fn get_policy(env: &Env, policy_id: u64) -> Policy {
        let key = PolicyBook::Policy(policy_id);
        env.storage().instance().get(&key).expect("Policy not found")
    }

    /// Get total premiums collected
    pub fn get_total_premiums(env: Env) -> i128 {
        let stats = Self::get_statistics(&env);
        stats.total_premiums
    }

    /// Get vault statistics
    pub fn get_statistics(env: &Env) -> VaultStats {
        env.storage().instance().get(&STATS).unwrap_or(VaultStats {
            total_policies: 0,
            total_premiums: 0,
            total_payouts: 0,
            active_policies: 0,
        })
    }

    // Helper function to update statistics
    fn update_stats(env: &Env, premium: i128, payout: i128) {
        let mut stats = Self::get_statistics(env);

        if premium > 0 {
            stats.total_premiums += premium;
            stats.total_policies += 1;
            stats.active_policies += 1;
        }
        if payout > 0 {
            stats.total_payouts += payout;
            stats.active_policies = stats.active_policies.saturating_sub(1);
        }

        env.storage().instance().set(&STATS, &stats);
    }
}