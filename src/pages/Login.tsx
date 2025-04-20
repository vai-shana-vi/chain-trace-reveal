
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Key, KeyRound, Building2, Package2, Users } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Logged in successfully",
          description: "Welcome back to TransparentChain!",
        });
        // Explicitly redirect after successful login
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. For demo, use any email from the mock user list.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/50">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mx-auto">
            <Package2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">TransparentChain</h1>
          <p className="text-muted-foreground">
            Blockchain supply chain transparency platform
          </p>
        </div>
        
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Choose a demo account to explore the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="px-0 font-normal">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo Accounts
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-xs text-muted-foreground">admin@transparentchain.com</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Package2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Manufacturer</p>
                      <p className="text-xs text-muted-foreground">manufacturer@transparentchain.com</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Supplier</p>
                      <p className="text-xs text-muted-foreground">supplier@transparentchain.com</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Customer</p>
                      <p className="text-xs text-muted-foreground">customer@example.com</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
