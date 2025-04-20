
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, ProductEvent, BlockchainTransaction } from '@/lib/types';
import { users, products, generateProductEvents, generateTransactions } from '@/lib/mockData';

interface AppContextType {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'hash'>) => Promise<Product>;
  getProduct: (id: string) => Product | undefined;
  
  // Events
  getProductEvents: (productId: string) => ProductEvent[];
  
  // Transactions
  transactions: BlockchainTransaction[];
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [transactionsList, setTransactionsList] = useState<BlockchainTransaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  // Load transactions on mount
  useEffect(() => {
    setTransactionsList(generateTransactions());
  }, []);
  
  // Handle login
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would authenticate with a server
    // For this demo, we'll just check if the email exists in our mock data
    const user = users.find(u => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Save to session storage for demo persistence
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };
  
  // Handle logout
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('currentUser');
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        sessionStorage.removeItem('currentUser');
      }
    }
  }, []);
  
  // Get product by ID
  const getProduct = (id: string) => {
    return productsList.find(product => product.id === id);
  };
  
  // Add new product
  const addProduct = async (productData: Omit<Product, 'id' | 'hash'>): Promise<Product> => {
    // Generate product ID and hash
    const newId = `PRD${String(productsList.length + 1).padStart(3, '0')}`;
    
    // In a real app, this would be handled by the blockchain
    // For demo, we'll just simulate creating a product
    const newProduct: Product = {
      ...productData,
      id: newId,
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };
    
    setProductsList(prevProducts => [...prevProducts, newProduct]);
    return newProduct;
  };
  
  // Get product events
  const getProductEvents = (productId: string) => {
    return generateProductEvents(productId);
  };
  
  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    products: productsList,
    addProduct,
    getProduct,
    getProductEvents,
    transactions: transactionsList,
    sidebarOpen,
    setSidebarOpen,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
