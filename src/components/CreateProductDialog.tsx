
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/context/Web3Context";
import { useApp } from "@/context/AppContext";
import { FilePlus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateProductDialog() {
  const { toast } = useToast();
  const { addProduct } = useApp();
  const { account, isConnected } = useWeb3();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to create a product",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const product = await addProduct({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        manufacturer: {
          id: account!,
          name: formData.get("manufacturerName") as string,
        },
        batchNumber: formData.get("batchNumber") as string,
        created: new Date(),
        status: "manufactured",
      });

      toast({
        title: "Product Created",
        description: `Successfully created product ${product.name}`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Create Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Product Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Input
              id="category"
              name="category"
              placeholder="Enter product category"
              required
            />
          </div>
          
          <div>
            <label htmlFor="manufacturerName" className="text-sm font-medium">
              Manufacturer Name
            </label>
            <Input
              id="manufacturerName"
              name="manufacturerName"
              placeholder="Enter manufacturer name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="batchNumber" className="text-sm font-medium">
              Batch Number
            </label>
            <Input
              id="batchNumber"
              name="batchNumber"
              placeholder="Enter batch number"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
