
import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import CryptoPayment from "@/components/CryptoPayment";
import QRScanner from "@/components/QRScanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tag, Scan } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useApp();
  const product = getProduct(id!);
  const [showScanner, setShowScanner] = useState(false);

  if (!product) {
    return <div>Product not found</div>;
  }

  // For demo purposes, we'll set a fixed price
  const price = 0.1; // ETH

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-1">Product Details</p>
        </div>
        <Dialog open={showScanner} onOpenChange={setShowScanner}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Scan className="mr-2 h-4 w-4" />
              Scan QR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <QRScanner onClose={() => setShowScanner(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Details about this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Category: {product.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Batch: {product.batchNumber}</span>
            </div>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <div className="text-sm">
              <p>Created: {formatDate(product.created)}</p>
              <p>Status: {product.status}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Product</CardTitle>
            <CardDescription>Pay with cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold">{price} ETH</p>
              <p className="text-sm text-muted-foreground">Fixed price for demo</p>
            </div>
            <CryptoPayment 
              amount={price} 
              productId={product.id}
              onSuccess={() => {
                console.log("Payment successful");
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
