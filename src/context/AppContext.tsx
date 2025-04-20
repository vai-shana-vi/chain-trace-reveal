
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, ProductEvent, BlockchainTransaction } from '@/lib/types';
import { users, products, generateProductEvents, generateTransactions } from '@/lib/mockData';
import { generateHash, generateSecureProductId, verifyProductAuthenticity } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  verifyProduct: (id: string) => { authentic: boolean; confidence: number; reason?: string };
  
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
  const { toast } = useToast();
  
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
  
  // Verify product authenticity
  const verifyProduct = (id: string) => {
    const product = getProduct(id);
    if (!product) {
      return {
        authentic: false,
        confidence: 0,
        reason: "Product not found"
      };
    }
    
    const events = getProductEvents(id);
    return verifyProductAuthenticity(product, events);
  };
  
  // Add new product
  const addProduct = async (productData: Omit<Product, 'id' | 'hash'>): Promise<Product> => {
    // Generate secure product ID
    const newId = generateSecureProductId();
    
    // Generate a unique blockchain hash for this product
    const uniqueData = `${newId}:${JSON.stringify(productData)}:${Date.now()}`;
    const productHash = generateHash(uniqueData);
    
    // In a real app, this would be handled by the blockchain
    const newProduct: Product = {
      ...productData,
      id: newId,
      hash: productHash,
    };
    
    toast({
      title: "Product Added",
      description: "New product has been added to the blockchain",
    });
    
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
    verifyProduct,
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
