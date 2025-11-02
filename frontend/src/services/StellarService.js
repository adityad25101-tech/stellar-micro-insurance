import * as StellarSdk from 'stellar-sdk';

const STELLAR_NETWORK = StellarSdk.Networks.TESTNET_NETWORK_PASSPHRASE;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const CONTRACT_ID = 'CBMT5ZHB7D34ATEG5Q3NETD6OOLAU2MOL6YYFUUGY2PVQAGWBJTJTAAQ'; // Deployed on testnet

export class StellarService {
  // Detect if Freighter extension is installed
  static isFreighterInstalled() {
    return !!(window.freighterApi || window.stellar || window.freighter);
  }

  // Get Freighter API object
  static getFreighterApi() {
    return window.freighterApi || window.stellar || window.freighter;
  }

  // Open Freighter extension
  static openFreighterExtension() {
    console.log('� Attempting to open Freighter extension...');
    const api = this.getFreighterApi();
    
    if (api && typeof api.showWallet === 'function') {
      try {
        api.showWallet();
        console.log('✅ Freighter extension opened');
        return true;
      } catch (error) {
        console.error('Error opening wallet:', error);
      }
    } else if (api && typeof api.open === 'function') {
      try {
        api.open();
        console.log('✅ Freighter extension opened');
        return true;
      } catch (error) {
        console.error('Error opening wallet:', error);
      }
    }
    
    return false;
  }

  // Download and open Freighter extension
  static downloadFreighter() {
    console.log('📥 Opening Freighter download page...');
    window.open('https://www.freighter.app', '_blank');
  }

  static async connectWallet() {
    try {
      console.log('🔌 Wallet Connection Starting...');
      console.log('📋 Checking window properties...');
      console.log('  - window.freighterApi:', typeof window.freighterApi);
      console.log('  - window.stellar:', typeof window.stellar);
      console.log('  - window.freighter:', typeof window.freighter);
      
      // First, check if Freighter is immediately available
      let api = this.getFreighterApi();
      
      if (!api) {
        console.log('⏳ Freighter not found, waiting for extension injection (up to 10 seconds)...');
        
        // Wait for Freighter to be available (it injects into window asynchronously)
        let waitTime = 0;
        const maxWaitTime = 10000; // 10 seconds - wait much longer
        const checkInterval = 200; // Check every 200ms
        
        while (!api && waitTime < maxWaitTime) {
          api = this.getFreighterApi();
          
          if (api) {
            console.log('✅ Freighter found after', waitTime, 'ms');
            break;
          }
          
          // Log progress every 2 seconds
          if (waitTime % 2000 === 0) {
            console.log('⏳ Still waiting... (' + waitTime + 'ms)');
          }
          
          // Wait before checking again
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          waitTime += checkInterval;
        }
      }
      
      if (!api) {
        console.error('❌ Freighter wallet not installed');
        
        // Create a custom error object with a flag to indicate wallet not found
        const error = new Error('WALLET_NOT_INSTALLED');
        error.message = 'Freighter wallet extension not detected.';
        error.isNotInstalled = true;
        throw error;
      }

      console.log('✅ Freighter API found');
      console.log('Available methods:', Object.keys(api));

      // Try to open wallet UI first (popup confirmation)
      if (typeof api.showWallet === 'function') {
        try {
          console.log('📲 Showing wallet UI...');
          api.showWallet();
        } catch (error) {
          console.warn('Could not show wallet UI:', error);
        }
      }

      // Get the public key/address
      let publicKey = null;

      // Method 1: Modern Freighter API - getAddress
      if (typeof api.getAddress === 'function') {
        console.log('📲 Using: getAddress()');
        try {
          publicKey = await api.getAddress();
          console.log('✅ Got address:', publicKey);
        } catch (error) {
          console.error('getAddress failed:', error);
        }
      }
      
      // Method 2: getPublicKey
      if (!publicKey && typeof api.getPublicKey === 'function') {
        console.log('📲 Using: getPublicKey()');
        try {
          publicKey = await api.getPublicKey();
          console.log('✅ Got public key:', publicKey);
        } catch (error) {
          console.error('getPublicKey failed:', error);
        }
      }
      
      // Method 3: requestPublicKey
      if (!publicKey && typeof api.requestPublicKey === 'function') {
        console.log('📲 Using: requestPublicKey()');
        try {
          publicKey = await api.requestPublicKey();
          console.log('✅ Got public key:', publicKey);
        } catch (error) {
          console.error('requestPublicKey failed:', error);
        }
      }

      if (!publicKey) {
        console.error('❌ Could not get public key from wallet');
        throw new Error('Failed to get public key from wallet. Please unlock your Freighter wallet and try again.');
      }

      console.log('✅ Connected wallet:', publicKey);

      // Fetch account info from Horizon
      const server = new StellarSdk.Server(HORIZON_URL);
      let account;
      
      try {
        account = await server.loadAccount(publicKey);
      } catch (error) {
        console.warn('Account not found on testnet, returning basic info');
        account = { 
          balances: [{ balance: '0' }]
        };
      }

      return {
        address: publicKey,
        balance: account.balances[0]?.balance || '0',
      };
    } catch (error) {
      console.error('❌ Wallet connection error:', error);
      throw error;
    }
  }

  static async buyInsurance(account, premium, coverage, policyType) {
    try {
      const server = new StellarSdk.Server(HORIZON_URL);
      const userAccount = await server.loadAccount(account.address);

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(userAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK,
      })
        .addOperation(
          StellarSdk.Operation.invokeHostFunction({
            func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract([
              StellarSdk.Address.fromString(CONTRACT_ID).toXdrObject(),
              StellarSdk.nativeToScVal('buy_insurance'),
              [
                StellarSdk.nativeToScVal(parseFloat(premium) * 10000000), // Convert to stroops
                StellarSdk.nativeToScVal(parseFloat(coverage) * 10000000),
                StellarSdk.nativeToScVal(policyType),
              ],
            ]),
            auth: [],
          })
        )
        .setTimeout(300)
        .build();

      // Sign transaction with Freighter (modern API)
      let signedXdr = null;
      
      if (window.freighterApi?.signTransaction) {
        signedXdr = await window.freighterApi.signTransaction(
          transaction.toXDR(),
          { networkPassphrase: STELLAR_NETWORK }
        );
      } else if (window.stellar?.signTransaction) {
        signedXdr = await window.stellar.signTransaction(
          transaction.toXDR(),
          { networkPassphrase: STELLAR_NETWORK }
        );
      } else {
        throw new Error('Cannot sign transaction - Freighter wallet unavailable');
      }

      // Submit to network
      const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK);
      const result = await server.submitTransaction(tx);

      return {
        policyId: result.id,
        txHash: result.hash,
      };
    } catch (error) {
      console.error('Buy insurance error:', error);
      throw new Error('Failed to buy insurance: ' + error.message);
    }
  }

  static async claimInsurance(account, policyId) {
    try {
      const server = new StellarSdk.Server(HORIZON_URL);
      const userAccount = await server.loadAccount(account.address);

      const transaction = new StellarSdk.TransactionBuilder(userAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK,
      })
        .addOperation(
          StellarSdk.Operation.invokeHostFunction({
            func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract([
              StellarSdk.Address.fromString(CONTRACT_ID).toXdrObject(),
              StellarSdk.nativeToScVal('trigger_payout'),
              [
                StellarSdk.nativeToScVal(policyId),
              ],
            ]),
            auth: [],
          })
        )
        .setTimeout(300)
        .build();

      // Sign transaction with Freighter (modern API)
      let signedXdr = null;
      
      if (window.freighterApi?.signTransaction) {
        signedXdr = await window.freighterApi.signTransaction(
          transaction.toXDR(),
          { networkPassphrase: STELLAR_NETWORK }
        );
      } else if (window.stellar?.signTransaction) {
        signedXdr = await window.stellar.signTransaction(
          transaction.toXDR(),
          { networkPassphrase: STELLAR_NETWORK }
        );
      } else {
        throw new Error('Cannot sign transaction - Freighter wallet unavailable');
      }

      const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK);
      const result = await server.submitTransaction(tx);

      return {
        claimId: result.id,
        txHash: result.hash,
      };
    } catch (error) {
      console.error('Claim insurance error:', error);
      throw new Error('Failed to claim insurance: ' + error.message);
    }
  }

  static async getPolicies(account) {
    try {
      // This would fetch policies from contract state
      // For MVP, return mock data
      // eslint-disable-next-line no-unreachable
      return [
        {
          id: 1,
          type: 'Crop Failure Insurance',
          premium: 0.5,
          coverage: 5,
          active: true,
          claimed: false,
          timestamp: Math.floor(Date.now() / 1000),
        },
        {
          id: 2,
          type: 'Flood Protection',
          premium: 1.0,
          coverage: 10,
          active: true,
          claimed: false,
          timestamp: Math.floor(Date.now() / 1000) - 86400,
        },
      ];
    } catch (error) {
      console.error('Failed to fetch policies:', error);
      return [];
    }
  }

  static async getDashboardStats(account) {
    try {
      // Mock data for MVP demo
      return {
        totalPolicies: 2,
        totalPremiums: 1.5,
        activeClaims: 0,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return { totalPolicies: 0, totalPremiums: 0, activeClaims: 0 };
    }
  }
}
