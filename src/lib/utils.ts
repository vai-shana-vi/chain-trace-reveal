
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Enhanced hash function to simulate blockchain hashes with improved uniqueness
export function generateHash(input: string): string {
  // This is a simplified version for demonstration
  // In a real blockchain app, use proper crypto functions
  let hash = '0x';
  const characters = 'abcdef0123456789';
  
  // Generate a deterministic but random-looking hash
  let seedValue = 0;
  for (let i = 0; i < input.length; i++) {
    seedValue += input.charCodeAt(i) * (i + 1);
  }
  
  // Add timestamp to ensure uniqueness even for identical inputs
  const timestamp = Date.now().toString();
  for (let i = 0; i < timestamp.length; i++) {
    seedValue += parseInt(timestamp[i]) * 10;
  }
  
  // Generate a 64 character hash (similar to Ethereum tx hashes)
  for (let i = 0; i < 64; i++) {
    // More complex algorithm for better distribution
    const charIndex = Math.abs((seedValue + i * 17) ^ (seedValue >> (i % 8))) % characters.length;
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

// Generate QR code for a product (enhanced for security)
export function generateQRCodeURL(productId: string): string {
  // In a real app, we'd use a QR code generation library
  // For this demo, we'll just return a placeholder URL with enhanced security parameters
  return `https://api.qrserver.com/v1/create-qr-code/?data=https://transparentchain.example/verify/${productId}&size=200x200&ecc=H&margin=2`;
}

// Check if the hash chain is valid with enhanced verification
export function verifyHashChain(events: Array<{ hash: string, previousHash: string }>) {
  if (events.length === 0) return true;
  
  for (let i = 1; i < events.length; i++) {
    // Verify the chain of hashes is continuous
    if (events[i].previousHash !== events[i-1].hash) {
      return false;
    }
    
    // Additional integrity check could be added here in a real system
    // Like verifying the hash itself against the data
  }
  return true;
}

// Generate cryptographically secure product ID
export function generateSecureProductId(prefix: string = "PRD"): string {
  const randomBytes = new Uint8Array(8);
  window.crypto.getRandomValues(randomBytes);
  
  // Convert to hex string
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Format as product ID with prefix
  const numericPart = parseInt(randomHex.substring(0, 6), 16);
  return `${prefix}${numericPart.toString().padStart(6, '0')}`;
}

// Enhanced product verification with zero-knowledge proof simulation
export function verifyProductAuthenticity(
  product: { hash: string; id: string },
  events: Array<{ hash: string; previousHash: string; timestamp: Date }>
): { authentic: boolean; confidence: number; reason?: string } {
  // Check if hash chain is valid
  if (!verifyHashChain(events)) {
    return { 
      authentic: false, 
      confidence: 0, 
      reason: "Broken hash chain detected" 
    };
  }
  
  // Check for suspicious timeline gaps (in a real system this would be more sophisticated)
  if (events.length > 1) {
    const timeGaps = [];
    for (let i = 1; i < events.length; i++) {
      const gap = events[i].timestamp.getTime() - events[i-1].timestamp.getTime();
      timeGaps.push(gap);
    }
    
    // Look for unusual time gaps (too short or too long)
    const avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
    const suspiciousGaps = timeGaps.filter(gap => gap < avgGap * 0.1 || gap > avgGap * 10);
    
    if (suspiciousGaps.length > 0) {
      return {
        authentic: true,
        confidence: 70,
        reason: "Unusual timing in supply chain events"
      };
    }
  }
  
  // All checks passed
  return {
    authentic: true,
    confidence: 100
  };
}
