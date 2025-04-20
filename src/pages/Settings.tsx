
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Shield, 
  Link, 
  Database, 
  Eye, 
  EyeOff,
  Lock
} from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [hashAlgorithm, setHashAlgorithm] = useState("SHA-256");
  
  // Mock wallet data
  const walletAddress = currentUser?.walletAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
  
  const handleSaveSettings = () => {
    // In a real app, we would save these settings to the blockchain
    toast({
      title: "Settings updated",
      description: "Your blockchain settings have been updated",
    });
  };
  
  const handleResetPrivateKey = () => {
    toast({
      title: "Private key reset",
      description: "Your private key has been reset. Keep it secure!",
    });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your blockchain and account settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Blockchain Security
            </CardTitle>
            <CardDescription>
              Configure your blockchain security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <div className="flex">
                <Input
                  id="wallet-address"
                  value={walletAddress}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    toast({
                      title: "Copied!",
                      description: "Wallet address copied to clipboard",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="private-key" className="flex justify-between">
                <span>Private Key</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 px-2 text-xs"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? (
                    <EyeOff className="mr-1 h-3 w-3" />
                  ) : (
                    <Eye className="mr-1 h-3 w-3" />
                  )}
                  {showPrivateKey ? "Hide" : "Show"}
                </Button>
              </Label>
              <div className="flex">
                <Input
                  id="private-key"
                  type={showPrivateKey ? "text" : "password"}
                  value={showPrivateKey ? privateKey : "•".repeat(20)}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={handleResetPrivateKey}
                >
                  Reset
                </Button>
              </div>
              <p className="text-[0.8rem] text-muted-foreground">
                Never share your private key with anyone. Keep it in a secure location.
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings}>Save Security Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="mr-2 h-5 w-5" />
              Blockchain Configuration
            </CardTitle>
            <CardDescription>
              Configure blockchain network and hash settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <select 
                id="network"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="polygon">Polygon</option>
                <option value="optimism">Optimism</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="avalanche">Avalanche</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hash-algorithm">Hash Algorithm</Label>
              <select 
                id="hash-algorithm"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={hashAlgorithm}
                onChange={(e) => setHashAlgorithm(e.target.value)}
              >
                <option value="SHA-256">SHA-256 (Recommended)</option>
                <option value="Keccak-256">Keccak-256 (Ethereum)</option>
                <option value="Scrypt">Scrypt (Memory-Hard)</option>
                <option value="Argon2id">Argon2id (Password Hashing)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gas-price">Default Gas Price (Gwei)</Label>
              <Input
                id="gas-price"
                type="number"
                defaultValue={30}
                min={1}
              />
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings}>Save Blockchain Settings</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Supply Chain Transparency
            </CardTitle>
            <CardDescription>
              Configure supply chain and product tracking settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable-anonymous"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked={true}
                  />
                  <Label htmlFor="enable-anonymous">
                    Enable Anonymous Manufacturer Data
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-1">
                  Masks manufacturer identity while preserving supply chain integrity
                </p>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-verification"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked={true}
                  />
                  <Label htmlFor="require-verification">
                    Require Multi-Party Verification
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-1">
                  Each supply chain step requires verification from multiple parties
                </p>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-verification"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked={true}
                  />
                  <Label htmlFor="auto-verification">
                    Automatic Fraud Detection
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-1">
                  AI-powered detection of unusual supply chain patterns
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-threshold">
                Minimum Verifications Required
              </Label>
              <Input
                id="verification-threshold"
                type="number"
                defaultValue={3}
                min={1}
                max={10}
              />
              <p className="text-xs text-muted-foreground">
                Minimum number of verifications required before a product moves to the next stage
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings}>Save Transparency Settings</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Product Encryption
            </CardTitle>
            <CardDescription>
              Configure product cryptographic settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
              <select 
                id="encryption-algorithm"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="aes-256-gcm">AES-256-GCM (Recommended)</option>
                <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
                <option value="rsa-4096">RSA-4096</option>
                <option value="ed25519">Ed25519</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qr-security">QR Code Security Level</Label>
              <select 
                id="qr-security"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="L">Low (7% error correction)</option>
                <option value="M">Medium (15% error correction)</option>
                <option value="Q">Quartile (25% error correction)</option>
                <option value="H">High (30% error correction, recommended)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Higher security levels make QR codes more resilient to damage but larger
              </p>
            </div>
            
            <div>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable-watermark"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked={false}
                  />
                  <Label htmlFor="enable-watermark">
                    Enable Digital Watermarking
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-1">
                  Embed invisible watermarks in product QR codes
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings}>
                Save Encryption Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
