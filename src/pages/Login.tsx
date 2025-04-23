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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute w-full h-full animate-pulse-slow opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}rem`,
                height: `${Math.random() * 3 + 1}rem`,
                background: `rgba(${Math.random() * 100 + 155}, ${
                  Math.random() * 100 + 155
                }, 255, 0.1)`,
                backdropFilter: 'blur(5px)',
                animation: `float ${Math.random() * 10 + 5}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 px-4 z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-lg mx-auto transform hover:scale-105 transition-all duration-300">
            <Package2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            TransparentChain
          </h1>
          <p className="text-purple-200">
            Blockchain supply chain transparency platform
          </p>
        </div>
        
        <Card className="border-0 bg-white/10 backdrop-blur-md shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Sign in</CardTitle>
            <CardDescription className="text-purple-200">
              Choose a demo account to explore the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Button variant="link" className="px-0 font-normal text-purple-300 hover:text-purple-200">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                disabled={isLoading}
              >
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
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-purple-200">
                    Demo Accounts
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-white/5 hover:bg-white/10 transition-all border-0 flex items-center">
                  <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                    <Building2 className="h-4 w-4 text-purple-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">Admin</p>
                    <p className="text-xs text-purple-300 truncate">admin@transparentchain.com</p>
                  </div>
                </Card>
                <Card className="p-3 bg-white/5 hover:bg-white/10 transition-all border-0 flex items-center">
                  <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                    <Package2 className="h-4 w-4 text-purple-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">Manufacturer</p>
                    <p className="text-xs text-purple-300 truncate">manufacturer@transparentchain.com</p>
                  </div>
                </Card>
                <Card className="p-3 bg-white/5 hover:bg-white/10 transition-all border-0 flex items-center">
                  <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                    <Building2 className="h-4 w-4 text-purple-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">Supplier</p>
                    <p className="text-xs text-purple-300 truncate">supplier@transparentchain.com</p>
                  </div>
                </Card>
                <Card className="p-3 bg-white/5 hover:bg-white/10 transition-all border-0 flex items-center">
                  <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                    <Users className="h-4 w-4 text-purple-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">Customer</p>
                    <p className="text-xs text-purple-300 truncate">customer@example.com</p>
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
