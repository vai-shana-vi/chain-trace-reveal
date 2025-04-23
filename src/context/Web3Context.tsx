
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  verifyProductOnChain: (productId: string) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if ethereum is available
  const isMetaMaskInstalled = typeof window !== 'undefined' && Boolean(window.ethereum);

  // Reconnect on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled && localStorage.getItem('isWalletConnected') === 'true') {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
          localStorage.removeItem('isWalletConnected');
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled || !account) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        updateBalance(accounts[0]);
        toast({
          title: "Account Changed",
          description: `Switched to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        });
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      toast({
        title: "Network Changed",
        description: `Switched to network ID: ${newChainId}`,
      });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, isMetaMaskInstalled]);

  const updateBalance = async (address: string) => {
    if (!isMetaMaskInstalled || !address) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      toast({
        title: "MetaMask Not Installed",
        description: "Please install MetaMask browser extension to connect",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Request accounts access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        setChainId(parseInt(chainIdHex, 16));
        localStorage.setItem('isWalletConnected', 'true');
        await updateBalance(account);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${account.substring(0, 6)}...${account.substring(38)}`,
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    localStorage.removeItem('isWalletConnected');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Mock function to verify product on blockchain
  const verifyProductOnChain = async (productId: string): Promise<boolean> => {
    if (!isMetaMaskInstalled || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to verify this product on-chain",
        variant: "destructive",
      });
      return false;
    }

    // In a real application, this would interact with a smart contract
    // This is a mock implementation for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, we'll consider products with odd IDs as verified
        const isVerified = productId.endsWith("1") || productId.endsWith("3") || productId.endsWith("5") || productId.endsWith("7") || productId.endsWith("9");
        
        toast({
          title: isVerified ? "Product Verified" : "Verification Failed",
          description: isVerified 
            ? `Product ${productId} has been verified on the blockchain`
            : `Could not verify product ${productId} on the blockchain`,
          variant: isVerified ? "default" : "destructive",
        });
        
        resolve(isVerified);
      }, 1500);
    });
  };

  const value = {
    account,
    chainId,
    balance,
    isConnected: Boolean(account),
    isConnecting,
    connectWallet,
    disconnectWallet,
    verifyProductOnChain,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Add TypeScript global type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
