
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  QrCode, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const { currentUser, logout, sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  if (!currentUser) return null;

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: "Products", 
      path: "/products", 
      icon: <Package size={20} /> 
    },
    { 
      name: "QR Scanner", 
      path: "/scanner", 
      icon: <QrCode size={20} /> 
    },
    { 
      name: "Reports", 
      path: "/reports", 
      icon: <FileText size={20} /> 
    },
    { 
      name: "Users", 
      path: "/users", 
      icon: <Users size={20} />, 
      adminOnly: true 
    },
    { 
      name: "Settings", 
      path: "/settings", 
      icon: <Settings size={20} /> 
    }
  ];

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r bg-card",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {sidebarOpen ? (
            <h1 className="text-xl font-semibold tracking-tight">
              TransparentChain
            </h1>
          ) : (
            <h1 className="text-xl font-semibold tracking-tight">TC</h1>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="h-8 w-8"
          >
            <ChevronLeft size={18} className={cn("transition-transform", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems
            .filter(item => !item.adminOnly || currentUser.role === 'admin')
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
        </nav>
        
        <div className="flex items-center p-4 border-t">
          <div className="flex items-center flex-1 space-x-3 overflow-hidden">
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()} 
            className="h-8 w-8"
            title="Logout"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
