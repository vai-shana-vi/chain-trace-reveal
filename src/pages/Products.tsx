
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Package, QrCode, Search, Scan } from "lucide-react";
import { useState } from "react";
import CreateProductDialog from "@/components/CreateProductDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import QRScanner from "@/components/QRScanner";

export default function Products() {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            View and manage products in the blockchain
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowScanner(true)}
          >
            <Scan className="mr-2 h-4 w-4" />
            Scan
          </Button>
          <CreateProductDialog />
        </div>
      </div>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent>
          <QRScanner onClose={() => setShowScanner(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card className="h-full transition-all hover:shadow hover:border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{product.name}</CardTitle>
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                    <QrCode className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <CardDescription>
                  {product.category} • {product.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-28">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Manufacturer</p>
                        <p className="text-sm font-medium">{product.manufacturer.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm">{formatDate(product.created)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-xs capitalize px-2.5 py-0.5 rounded-full bg-secondary">
                    {product.status.replace('_', ' ')}
                  </div>
                  
                  <div className="badge-verified">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
