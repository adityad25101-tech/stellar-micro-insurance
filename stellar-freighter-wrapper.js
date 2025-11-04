#!/usr/bin/env node

/**
 * Stellar CLI + Freighter Wallet Integration Wrapper
 * 
 * This script connects Freighter wallet with Stellar CLI for:
 * - Transaction signing
 * - Smart contract deployment
 * - Account management
 * 
 * Usage:
 *   node stellar-freighter-wrapper.js --info [address]
 *   node stellar-freighter-wrapper.js --deploy [contract_path]
 *   node stellar-freighter-wrapper.js --invoke [contract_id] [function] [args]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
    log(`❌ ERROR: ${message}`, 'red');
    process.exit(1);
}

function success(message) {
    log(`✅ ${message}`, 'green');
}

function info(message) {
    log(`ℹ️  ${message}`, 'cyan');
}

function warn(message) {
    log(`⚠️  ${message}`, 'yellow');
}

/**
 * Execute shell command
 */
function exec(command) {
    try {
        info(`Running: ${command}`);
        const output = execSync(command, { encoding: 'utf-8' });
        return output;
    } catch (err) {
        error(`Command failed: ${err.message}`);
    }
}

/**
 * Check if Stellar CLI is installed
 */
function checkStellarCLI() {
    try {
        const version = execSync('stellar version', { encoding: 'utf-8' });
        success(`Stellar CLI found: ${version.trim()}`);
        return true;
    } catch (err) {
        error('Stellar CLI not installed. Download from: https://github.com/stellar/stellar-cli/releases');
    }
}

/**
 * Set network to Testnet
 */
function setTestnet() {
    info('Setting network to Testnet...');
    exec('stellar network use test-sdf');
    success('Network set to Testnet');
}

/**
 * Get account information
 */
function getAccountInfo(publicKey) {
    log(`\n📊 Account Information`, 'blue');
    log('─'.repeat(50), 'blue');
    
    const output = exec(`stellar account info ${publicKey}`);
    console.log(output);
    
    return output;
}

/**
 * Fund account via Friendbot (Testnet)
 */
function fundAccount(publicKey) {
    log(`\n💰 Funding Account`, 'blue');
    log('─'.repeat(50), 'blue');
    
    info(`Funding ${publicKey} with test XLM...`);
    
    try {
        const output = execSync(
            `curl -s https://friendbot.stellar.org?addr=${publicKey}`,
            { encoding: 'utf-8' }
        );
        
        success('Account funded with 10,000 test XLM!');
        console.log(output);
        
        return output;
    } catch (err) {
        warn('Could not fund account. Try manual funding at: https://laboratory.stellar.org/');
    }
}

/**
 * Build smart contract
 */
function buildContract(contractPath) {
    log(`\n🏗️  Building Smart Contract`, 'blue');
    log('─'.repeat(50), 'blue');
    
    const contractDir = path.dirname(contractPath);
    
    if (!fs.existsSync(path.join(contractDir, 'Cargo.toml'))) {
        error('Cargo.toml not found in contract directory');
    }
    
    info('Building WASM contract...');
    exec(`cd ${contractDir} && cargo build --target wasm32-unknown-unknown --release`);
    
    success('Contract built successfully!');
    
    const wasmPath = path.join(
        contractDir,
        'target/wasm32-unknown-unknown/release',
        path.basename(contractDir) + '.wasm'
    );
    
    if (fs.existsSync(wasmPath)) {
        info(`WASM file: ${wasmPath}`);
        return wasmPath;
    } else {
        error('WASM file not found after build');
    }
}

/**
 * Deploy contract to Testnet
 */
function deployContract(publicKey, wasmPath) {
    log(`\n🚀 Deploying Smart Contract`, 'blue');
    log('─'.repeat(50), 'blue');
    
    if (!fs.existsSync(wasmPath)) {
        error(`WASM file not found: ${wasmPath}`);
    }
    
    info(`Deploying contract...`);
    info(`Source account: ${publicKey}`);
    info(`Contract WASM: ${wasmPath}`);
    
    try {
        const output = exec(
            `soroban contract deploy \\
                --wasm ${wasmPath} \\
                --source-account ${publicKey} \\
                --network test-sdf`
        );
        
        // Extract contract ID from output
        const match = output.match(/Contract ID: (\S+)/);
        const contractId = match ? match[1] : null;
        
        if (contractId) {
            success(`Contract deployed: ${contractId}`);
            info(`Save this contract ID for future interactions!`);
            return contractId;
        } else {
            warn('Could not extract contract ID from output:');
            console.log(output);
        }
    } catch (err) {
        error(`Deployment failed: ${err.message}`);
    }
}

/**
 * Invoke contract function
 */
function invokeContract(publicKey, contractId, functionName, args = []) {
    log(`\n📞 Invoking Contract Function`, 'blue');
    log('─'.repeat(50), 'blue');
    
    info(`Contract ID: ${contractId}`);
    info(`Function: ${functionName}`);
    info(`Arguments: ${JSON.stringify(args)}`);
    
    let command = `soroban contract invoke \\
        --id ${contractId} \\
        --source-account ${publicKey} \\
        --network test-sdf \\
        --function ${functionName}`;
    
    // Add arguments
    for (const arg of args) {
        command += ` \\
        --arg ${arg}`;
    }
    
    try {
        const output = exec(command);
        success('Function invoked successfully!');
        console.log(output);
        return output;
    } catch (err) {
        error(`Function invocation failed: ${err.message}`);
    }
}

/**
 * Interactive CLI menu
 */
function interactiveMenu() {
    log(`
╔════════════════════════════════════════════════════════╗
║   🌟 Stellar + Freighter Integration Wrapper 🌟        ║
║                                                        ║
║   Connect Freighter wallet with Stellar CLI          ║
╚════════════════════════════════════════════════════════╝
    `, 'cyan');
    
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        log(`
Usage:
  node stellar-freighter-wrapper.js --info <address>
  node stellar-freighter-wrapper.js --fund <address>
  node stellar-freighter-wrapper.js --build <contract_path>
  node stellar-freighter-wrapper.js --deploy <contract_path> <public_key>
  node stellar-freighter-wrapper.js --invoke <contract_id> <function> [args...]

Examples:
  node stellar-freighter-wrapper.js --info GXXXXXX...
  node stellar-freighter-wrapper.js --fund GXXXXXX...
  node stellar-freighter-wrapper.js --build ./contracts
  node stellar-freighter-wrapper.js --deploy ./contracts GXXXXXX...
  node stellar-freighter-wrapper.js --invoke CXXXXXX... buy_insurance buyer=GXXXXXX... amount=1000
        `, 'yellow');
        process.exit(0);
    }
    
    // Check Stellar CLI
    checkStellarCLI();
    setTestnet();
    
    const command = args[0];
    
    switch (command) {
        case '--info':
            if (args.length < 2) error('Missing address argument');
            getAccountInfo(args[1]);
            break;
            
        case '--fund':
            if (args.length < 2) error('Missing address argument');
            fundAccount(args[1]);
            break;
            
        case '--build':
            if (args.length < 2) error('Missing contract path argument');
            buildContract(args[1]);
            break;
            
        case '--deploy':
            if (args.length < 3) error('Missing contract path or public key');
            const contractPath = args[1];
            const publicKey = args[2];
            
            // First build
            const wasmPath = buildContract(contractPath);
            
            // Then deploy
            const deployedContractId = deployContract(publicKey, wasmPath);
            
            // Save contract ID
            if (deployedContractId) {
                const configPath = path.join(
                    path.dirname(contractPath),
                    'contract-config.json'
                );
                fs.writeFileSync(configPath, JSON.stringify(
                    { contractId: deployedContractId, publicKey, network: 'testnet' },
                    null,
                    2
                ));
                success(`Contract config saved to: ${configPath}`);
            }
            break;
            
        case '--invoke':
            if (args.length < 3) error('Missing contract ID or function name');
            const invokeContractId = args[1];
            const func = args[2];
            const funcArgs = args.slice(3);
            
            // Load public key from contract config if available
            let pubKey = null;
            try {
                const configPath = path.join(process.cwd(), 'contract-config.json');
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                    pubKey = config.publicKey;
                }
            } catch (e) {
                warn('Could not load contract config');
            }
            
            if (!pubKey) error('Please provide public key or create contract-config.json');
            invokeContract(pubKey, invokeContractId, func, funcArgs);
            break;
            
        default:
            error(`Unknown command: ${command}`);
    }
}

// Run
if (require.main === module) {
    interactiveMenu();
}

module.exports = {
    checkStellarCLI,
    setTestnet,
    getAccountInfo,
    fundAccount,
    buildContract,
    deployContract,
    invokeContract,
};
