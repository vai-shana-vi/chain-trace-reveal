
import { useApp } from "@/context/AppContext";
import { formatAddress } from "@/lib/utils";
import { 
  Bell, 
  Menu, 
  MoonStar, 
  Sun, 
  Wallet 
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";

export function Header() {
  const { currentUser, setSidebarOpen } = useApp();
  const { theme, setTheme } = useTheme();
  const [notifications] = useState(3);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden"
      >
        <Menu size={20} />
      </Button>
      
      <div className="hidden lg:flex lg:items-center lg:gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Wallet Address */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
          <Wallet size={16} className="text-primary" />
          <span className="text-xs font-medium">{formatAddress(currentUser.walletAddress || '')}</span>
        </div>
        
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9"
        >
          {theme === "dark" ? <Sun size={18} /> : <MoonStar size={18} />}
        </Button>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell size={18} />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {notifications}
            </span>
          )}
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {}}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
