
import { useApp } from "@/context/AppContext";
import { formatDate, verifyHashChain } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, getProductEvents } = useApp();
  
  const product = getProduct(id || "");
  const events = product ? getProductEvents(product.id) : [];
  
  // Check if hash chain is valid
  const isValid = verifyHashChain(events);
  
  if (!product) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-muted-foreground mt-2">
            The requested product could not be found
          </p>
          <Link to="/products">
            <Button className="mt-4">View All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to products
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm capitalize px-3 py-1 rounded-full bg-secondary">
            {product.status.replace('_', ' ')}
          </span>
          {isValid ? (
            <div className="badge-verified">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Verified
            </div>
          ) : (
            <div className="badge-error">
              <XCircle className="mr-1 h-3 w-3" />
              Invalid
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Product ID</p>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{product.manufacturer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(product.created)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch Number</p>
                  <p className="font-medium">{product.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">
                    {product.expiryDate ? formatDate(product.expiryDate) : "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                  <p className="hash-text">{product.hash}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{product.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Timeline</CardTitle>
              <CardDescription>
                Verified product journey on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {events.length > 1 && <div className="timeline-connector"></div>}
                <div className="space-y-6">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className="relative pl-10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center">
                          <div className="absolute left-0 p-1 rounded-full bg-card border-4 border-background">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {event.eventType.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">By: </span>
                            <span>{event.actor.name}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Location: </span>
                            <span>{event.location.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      {event.data && (
                        <div className="mt-2 p-2 text-sm bg-secondary/50 rounded">
                          {Object.entries(event.data).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground capitalize">
                                {key.replace('_', ' ')}:
                              </span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Hash:</p>
                        <p className="hash-text">{event.hash}</p>
                        
                        {event.previousHash && (
                          <>
                            <p className="text-xs text-muted-foreground mt-1">Previous Hash:</p>
                            <p className="hash-text">{event.previousHash}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Verification QR Code</CardTitle>
              <CardDescription>
                Scan to verify this product's authenticity
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={`https://transparentchain.example/verify/${product.id}`}
                  size={200}
                  level="H"
                />
              </div>
              <p className="mt-4 text-sm text-center text-muted-foreground">
                Scan this QR code to verify the authenticity and track the journey of this product
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
