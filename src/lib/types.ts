
export type UserRole = 'admin' | 'manufacturer' | 'supplier' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  walletAddress?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  manufacturer: {
    id: string;
    name: string;
  };
  created: Date;
  expiryDate?: Date;
  hash: string;
  category: string;
  batchNumber: string;
  imageUrl?: string;
  qrCode?: string;
  status: 'manufactured' | 'shipped' | 'warehouse' | 'delivered' | 'sold';
}

export interface ProductEvent {
  id: string;
  productId: string;
  timestamp: Date;
  eventType: 'created' | 'shipped' | 'received' | 'quality_check' | 'delivered' | 'sold';
  location: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  actor: {
    id: string;
    name: string;
    role: UserRole;
  };
  data?: Record<string, any>;
  hash: string;
  previousHash: string;
  verified: boolean;
}

export interface BlockchainTransaction {
  hash: string;
  timestamp: Date;
  sender: string;
  recipient: string;
  blockNumber: number;
  gasUsed: number;
  status: 'success' | 'pending' | 'failed';
}
