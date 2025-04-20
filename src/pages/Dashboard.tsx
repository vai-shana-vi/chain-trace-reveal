
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { products, currentUser, transactions } = useApp();
  
  // Calculate statistics
  const totalProducts = products.length;
  const inTransit = products.filter(p => p.status === 'shipped').length;
  const delivered = products.filter(p => ['delivered', 'sold'].includes(p.status)).length;
  
  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);
  
  // Product statistics by category
  const productCategories = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Role-specific welcome message
  const welcomeMessages = {
    admin: "Monitor the entire supply chain system",
    manufacturer: "Track your products through the supply chain",
    supplier: "Manage shipments and deliveries",
    customer: "Verify and track your purchased products"
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser?.name}</h1>
        <p className="text-muted-foreground mt-1">
          {welcomeMessages[currentUser?.role as keyof typeof welcomeMessages] || "Welcome to TransparentChain"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Products in the blockchain
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransit}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in shipping
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delivered}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active in the network
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.slice(0, 5).map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 p-2 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <Box className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(product.created)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs capitalize px-2.5 py-0.5 rounded-full bg-secondary">
                      {product.status.replace('_', ' ')}
                    </span>
                    <Link to={`/products/${product.id}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.map(transaction => (
                <div
                  key={transaction.hash}
                  className="p-2 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Block #{transaction.blockNumber}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.status === 'success'
                          ? 'bg-blockchain-success/20 text-blockchain-success'
                          : transaction.status === 'pending'
                          ? 'bg-blockchain-warning/20 text-blockchain-warning'
                          : 'bg-blockchain-danger/20 text-blockchain-danger'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-1 truncate">
                    {transaction.hash}
                  </p>
                  <div className="mt-1 flex justify-between items-center text-xs text-muted-foreground">
                    <span>{formatDate(transaction.timestamp)}</span>
                    <span>Gas: {transaction.gasUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(productCategories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <p className="text-sm">{category}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
