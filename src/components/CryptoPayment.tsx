
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/context/Web3Context";
import { ethers } from "ethers";
import { Wallet, Loader2 } from "lucide-react";
import { useState } from "react";

interface CryptoPaymentProps {
  amount: number;
  productId: string;
  onSuccess?: () => void;
}

export default function CryptoPayment({ amount, productId, onSuccess }: CryptoPaymentProps) {
  const { toast } = useToast();
  const { account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to make a payment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert amount to Wei (ETH's smallest unit)
      const amountInWei = ethers.parseEther(amount.toString());

      // Request transaction
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // For demo, we'll send to a fixed address
      const transaction = await signer.sendTransaction({
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Demo receiver address
        value: amountInWei
      });

      toast({
        title: "Transaction Sent",
        description: "Please wait for confirmation...",
      });

      // Wait for transaction confirmation
      await transaction.wait();

      toast({
        title: "Payment Successful",
        description: `Transaction hash: ${transaction.hash.slice(0, 10)}...`,
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading || !isConnected}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Pay {amount} ETH
        </>
      )}
    </Button>
  );
}
