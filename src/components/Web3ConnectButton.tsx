
import { useWeb3 } from "@/context/Web3Context";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";

export default function Web3ConnectButton({ variant = "default" }: { variant?: "default" | "outline" | "secondary" | "ghost" }) {
  const { isConnected, isConnecting, account, balance, connectWallet, disconnectWallet } = useWeb3();

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block px-3 py-1 rounded-full bg-secondary text-xs">
          <span className="font-medium">{balance} ETH</span>
        </div>
        <Button 
          variant={variant} 
          size="sm"
          onClick={disconnectWallet}
          className="flex items-center gap-2"
        >
          <Wallet size={16} />
          {account.substring(0, 6)}...{account.substring(38)}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant={variant} 
      size="sm"
      onClick={connectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet size={16} className="mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
