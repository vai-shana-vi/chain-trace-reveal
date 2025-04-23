
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Scan } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface QRScannerProps {
  onClose?: () => void;
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScan = (result: any) => {
    if (result) {
      const data = result?.text;
      
      if (data) {
        toast({
          title: "QR Code Detected",
          description: "Redirecting to product details",
        });
        
        // Extract product ID from URL if it's in a URL format
        try {
          const url = new URL(data);
          const pathParts = url.pathname.split('/');
          const productId = pathParts[pathParts.length - 1];
          
          navigate(`/products/${productId}`);
        } catch (e) {
          // If it's not a URL, check if it's just a product ID
          if (data.startsWith('PRD')) {
            navigate(`/products/${data}`);
          } else {
            toast({
              title: "Invalid QR Code",
              description: "The scanned code doesn't contain a valid product ID",
              variant: "destructive",
            });
          }
        }
        
        setIsScanning(false);
        onClose?.();
      }
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    toast({
      title: "QR Scanner Error",
      description: "There was an error accessing your camera. Please check permissions.",
      variant: "destructive",
    });
    setIsScanning(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="mr-2 h-5 w-5" />
          Product QR Scanner
        </CardTitle>
        <CardDescription>
          Scan a product QR code to verify authenticity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isScanning ? (
          <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={handleScan}
              scanDelay={500}
              videoStyle={{ width: '100%', height: '100%' }}
              videoContainerStyle={{ width: '100%', height: '100%' }}
              videoId="qr-reader"
            />
          </div>
        ) : (
          <Button 
            onClick={() => setIsScanning(true)} 
            className="w-full"
          >
            <Scan className="mr-2 h-4 w-4" />
            Start Scanning
          </Button>
        )}
        
        {isScanning && (
          <Button 
            variant="outline" 
            onClick={() => setIsScanning(false)}
            className="w-full"
          >
            Cancel Scan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
