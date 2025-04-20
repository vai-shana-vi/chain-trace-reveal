
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";

export function MainLayout() {
  const { isAuthenticated, currentUser, sidebarOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
    
    if (!isAuthenticated && !isAuthPage) {
      navigate("/login");
    } else if (isAuthenticated && isAuthPage) {
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          sidebarOpen ? "lg:pl-64 pl-20" : "pl-20"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
