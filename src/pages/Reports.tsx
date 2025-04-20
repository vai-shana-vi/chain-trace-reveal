
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Filter, Calendar } from "lucide-react";
import { formatDate, verifyHashChain } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Reports() {
  const { products, transactions } = useApp();
  const [dateFilter, setDateFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  
  // Filter transactions based on user input
  const filteredTransactions = transactions.filter(tx => {
    // Apply date filter if present
    if (dateFilter) {
      const txDate = new Date(tx.timestamp).toISOString().split('T')[0];
      if (txDate !== dateFilter) return false;
    }
    
    return true;
  });

  // Get integrity statistics
  const verifiedProducts = products.filter(product => {
    const events = useApp().getProductEvents(product.id);
    return verifyHashChain(events);
  });
  
  const integrityPercentage = products.length > 0 
    ? Math.round((verifiedProducts.length / products.length) * 100)
    : 100;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Reports</h1>
          <p className="text-muted-foreground mt-1">
            Analyze blockchain transparency and supply chain integrity
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Supply Chain Integrity</CardTitle>
            <CardDescription>Product verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {integrityPercentage}%
            </div>
            <p className="text-muted-foreground">
              {verifiedProducts.length} of {products.length} products verified
            </p>
            <div className="h-2 bg-secondary rounded-full mt-4">
              <div 
                className="h-2 bg-primary rounded-full" 
                style={{ width: `${integrityPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Blockchain Transactions</CardTitle>
            <CardDescription>Total confirmed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {transactions.filter(tx => tx.status === 'success').length}
            </div>
            <p className="text-muted-foreground">
              {transactions.filter(tx => tx.status === 'pending').length} pending
            </p>
            <p className="text-muted-foreground">
              Last confirmed: {formatDate(
                new Date(
                  Math.max(...transactions
                    .filter(tx => tx.status === 'success')
                    .map(tx => tx.timestamp.getTime())
                  )
                )
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {Array.from(
                new Set(products.map(p => p.category))
              ).map(category => {
                const count = products.filter(p => p.category === category).length;
                const percentage = Math.round((count / products.length) * 100);
                
                return (
                  <div key={category} className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Blockchain Transactions</CardTitle>
              <CardDescription>Recent transactions on the blockchain</CardDescription>
            </div>
            <div className="flex gap-2">
              <div>
                <Label htmlFor="date-filter" className="sr-only">Date Filter</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-[150px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setDateFilter("")}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium">Hash</th>
                    <th className="h-10 px-4 text-left font-medium">Time</th>
                    <th className="h-10 px-4 text-left font-medium">Status</th>
                    <th className="h-10 px-4 text-left font-medium">Block</th>
                    <th className="h-10 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.slice(0, 10).map((tx) => (
                      <tr key={tx.hash} className="border-b">
                        <td className="p-4 align-middle font-mono text-xs">
                          {tx.hash.substring(0, 18)}...
                        </td>
                        <td className="p-4 align-middle">
                          {formatDate(tx.timestamp)}
                        </td>
                        <td className="p-4 align-middle">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            tx.status === 'success' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' 
                              : tx.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          {tx.blockNumber}
                        </td>
                        <td className="p-4 align-middle">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
