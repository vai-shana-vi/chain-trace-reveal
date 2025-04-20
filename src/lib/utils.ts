
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple hash function to simulate blockchain hashes
export function generateHash(input: string): string {
  // This is a simplified version for demonstration
  // In a real blockchain app, use proper crypto functions
  let hash = '0x';
  const characters = 'abcdef0123456789';
  const inputChars = input.split('');
  
  // Generate a deterministic but random-looking hash
  let seedValue = 0;
  for (let i = 0; i < input.length; i++) {
    seedValue += input.charCodeAt(i);
  }
  
  // Generate a 64 character hash (similar to Ethereum tx hashes)
  for (let i = 0; i < 64; i++) {
    const charIndex = (seedValue + i * 13) % characters.length;
    hash += characters[charIndex];
  }
  
  return hash;
}

// Format wallet address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Generate QR code for a product (simplified)
export function generateQRCodeURL(productId: string): string {
  // In a real app, we'd use a QR code generation library
  // For this demo, we'll just return a placeholder URL
  return `https://api.qrserver.com/v1/create-qr-code/?data=https://transparentchain.example/verify/${productId}&size=200x200`;
}

// Check if the hash chain is valid
export function verifyHashChain(events: Array<{ hash: string, previousHash: string }>) {
  for (let i = 1; i < events.length; i++) {
    if (events[i].previousHash !== events[i-1].hash) {
      return false;
    }
  }
  return true;
}
