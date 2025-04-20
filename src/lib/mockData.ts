
import type { User, Product, ProductEvent, BlockchainTransaction } from './types';
import { generateHash } from './utils';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@transparentchain.com',
    role: 'admin',
    walletAddress: '0x1234567890123456789012345678901234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    name: 'Manufacturer Corp',
    email: 'manufacturer@transparentchain.com',
    role: 'manufacturer',
    walletAddress: '0x2345678901234567890123456789012345678901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manufacturer',
  },
  {
    id: '3', 
    name: 'Supplier Inc',
    email: 'supplier@transparentchain.com',
    role: 'supplier',
    walletAddress: '0x3456789012345678901234567890123456789012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supplier',
  },
  {
    id: '4',
    name: 'Customer',
    email: 'customer@example.com',
    role: 'customer',
    walletAddress: '0x4567890123456789012345678901234567890123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
  },
];

// Mock products
export const products: Product[] = [
  {
    id: 'PRD001',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans sourced from sustainable farms',
    manufacturer: {
      id: '2',
      name: 'Manufacturer Corp'
    },
    created: new Date('2023-10-15T08:30:00Z'),
    expiryDate: new Date('2025-10-15T08:30:00Z'),
    hash: generateHash('PRD001'),
    category: 'Food & Beverage',
    batchNumber: 'BATCH-2023-001',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b',
    status: 'shipped',
  },
  {
    id: 'PRD002',
    name: 'Smart Watch X1',
    description: 'Next generation smartwatch with health monitoring',
    manufacturer: {
      id: '2',
      name: 'Manufacturer Corp'
    },
    created: new Date('2023-11-25T10:15:00Z'),
    hash: generateHash('PRD002'),
    category: 'Electronics',
    batchNumber: 'BATCH-2023-042',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    status: 'manufactured',
  },
  {
    id: 'PRD003',
    name: 'Sustainable Bamboo Toothbrush',
    description: 'Eco-friendly toothbrush made from 100% biodegradable bamboo',
    manufacturer: {
      id: '2',
      name: 'Manufacturer Corp'
    },
    created: new Date('2023-09-03T14:20:00Z'),
    expiryDate: new Date('2024-09-03T14:20:00Z'),
    hash: generateHash('PRD003'),
    category: 'Personal Care',
    batchNumber: 'BATCH-2023-027',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04',
    status: 'delivered',
  },
  {
    id: 'PRD004',
    name: 'Organic Cotton T-shirt',
    description: 'Premium t-shirt made from 100% organic cotton',
    manufacturer: {
      id: '2',
      name: 'Manufacturer Corp'
    },
    created: new Date('2023-12-10T09:45:00Z'),
    hash: generateHash('PRD004'),
    category: 'Apparel',
    batchNumber: 'BATCH-2023-098',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    status: 'warehouse',
  },
  {
    id: 'PRD005',
    name: 'Plant-based Protein Powder',
    description: 'Natural protein supplement made from organic plants',
    manufacturer: {
      id: '2',
      name: 'Manufacturer Corp'
    },
    created: new Date('2024-01-20T11:30:00Z'),
    expiryDate: new Date('2025-01-20T11:30:00Z'),
    hash: generateHash('PRD005'),
    category: 'Health & Nutrition',
    batchNumber: 'BATCH-2024-007',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c01446775',
    status: 'sold',
  }
];

// Generate product events
export const generateProductEvents = (productId: string): ProductEvent[] => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  
  const events: ProductEvent[] = [];
  let previousHash = '';
  
  // Creation event
  const createEvent: ProductEvent = {
    id: `${productId}-EVENT-1`,
    productId,
    timestamp: product.created,
    eventType: 'created',
    location: {
      name: 'Manufacturing Facility, San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    actor: {
      id: '2',
      name: 'Manufacturer Corp',
      role: 'manufacturer'
    },
    hash: generateHash(`${productId}-creation-${product.created.toISOString()}`),
    previousHash: '',
    verified: true
  };
  
  events.push(createEvent);
  previousHash = createEvent.hash;
  
  // Add shipping event if product is at least shipped
  if (['shipped', 'warehouse', 'delivered', 'sold'].includes(product.status)) {
    const shippingDate = new Date(product.created);
    shippingDate.setDate(shippingDate.getDate() + 2);
    
    const shippingEvent: ProductEvent = {
      id: `${productId}-EVENT-2`,
      productId,
      timestamp: shippingDate,
      eventType: 'shipped',
      location: {
        name: 'Distribution Center, Chicago, IL',
        coordinates: { lat: 41.8781, lng: -87.6298 }
      },
      actor: {
        id: '2',
        name: 'Manufacturer Corp',
        role: 'manufacturer'
      },
      data: {
        carrier: 'Express Logistics',
        trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      },
      hash: generateHash(`${productId}-shipping-${shippingDate.toISOString()}-${previousHash}`),
      previousHash,
      verified: true
    };
    
    events.push(shippingEvent);
    previousHash = shippingEvent.hash;
  }
  
  // Add warehouse reception event if product is at least at warehouse
  if (['warehouse', 'delivered', 'sold'].includes(product.status)) {
    const warehouseDate = new Date(product.created);
    warehouseDate.setDate(warehouseDate.getDate() + 5);
    
    const warehouseEvent: ProductEvent = {
      id: `${productId}-EVENT-3`,
      productId,
      timestamp: warehouseDate,
      eventType: 'received',
      location: {
        name: 'Regional Warehouse, Atlanta, GA',
        coordinates: { lat: 33.7490, lng: -84.3880 }
      },
      actor: {
        id: '3',
        name: 'Supplier Inc',
        role: 'supplier'
      },
      data: {
        condition: 'Excellent',
        storageUnit: `UNIT-${Math.floor(Math.random() * 1000)}`
      },
      hash: generateHash(`${productId}-warehouse-${warehouseDate.toISOString()}-${previousHash}`),
      previousHash,
      verified: true
    };
    
    events.push(warehouseEvent);
    previousHash = warehouseEvent.hash;
    
    // Quality check event
    const qualityDate = new Date(warehouseDate);
    qualityDate.setDate(qualityDate.getDate() + 1);
    
    const qualityEvent: ProductEvent = {
      id: `${productId}-EVENT-4`,
      productId,
      timestamp: qualityDate,
      eventType: 'quality_check',
      location: {
        name: 'Regional Warehouse, Atlanta, GA',
        coordinates: { lat: 33.7490, lng: -84.3880 }
      },
      actor: {
        id: '3',
        name: 'Supplier Inc',
        role: 'supplier'
      },
      data: {
        inspector: 'Quality Team 3',
        result: 'Passed',
        notes: 'All quality parameters within acceptable range'
      },
      hash: generateHash(`${productId}-quality-${qualityDate.toISOString()}-${previousHash}`),
      previousHash,
      verified: true
    };
    
    events.push(qualityEvent);
    previousHash = qualityEvent.hash;
  }
  
  // Add delivery event if product is at least delivered
  if (['delivered', 'sold'].includes(product.status)) {
    const deliveryDate = new Date(product.created);
    deliveryDate.setDate(deliveryDate.getDate() + 10);
    
    const deliveryEvent: ProductEvent = {
      id: `${productId}-EVENT-5`,
      productId,
      timestamp: deliveryDate,
      eventType: 'delivered',
      location: {
        name: 'Retail Store, New York, NY',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      actor: {
        id: '3',
        name: 'Supplier Inc',
        role: 'supplier'
      },
      hash: generateHash(`${productId}-delivery-${deliveryDate.toISOString()}-${previousHash}`),
      previousHash,
      verified: true
    };
    
    events.push(deliveryEvent);
    previousHash = deliveryEvent.hash;
  }
  
  // Add sold event if product is sold
  if (product.status === 'sold') {
    const soldDate = new Date(product.created);
    soldDate.setDate(soldDate.getDate() + 15);
    
    const soldEvent: ProductEvent = {
      id: `${productId}-EVENT-6`,
      productId,
      timestamp: soldDate,
      eventType: 'sold',
      location: {
        name: 'Retail Store, New York, NY',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      actor: {
        id: '4',
        name: 'Customer',
        role: 'customer'
      },
      data: {
        purchaseId: `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        paymentMethod: 'Credit Card'
      },
      hash: generateHash(`${productId}-sold-${soldDate.toISOString()}-${previousHash}`),
      previousHash,
      verified: true
    };
    
    events.push(soldEvent);
  }
  
  return events;
};

// Mock blockchain transactions
export const generateTransactions = (): BlockchainTransaction[] => {
  const transactions: BlockchainTransaction[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (10 - i));
    
    transactions.push({
      hash: generateHash(`tx-${i}-${date.toISOString()}`),
      timestamp: date,
      sender: users[Math.floor(Math.random() * users.length)].walletAddress!,
      recipient: users[Math.floor(Math.random() * users.length)].walletAddress!,
      blockNumber: 14350000 + i,
      gasUsed: Math.floor(Math.random() * 100000),
      status: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'pending' : 'failed')
    });
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
