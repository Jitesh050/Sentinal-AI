import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { LayoutDashboard, Network, Shield, Menu, X, LogOut, Bell, BarChart, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignOut, setShowSignOut] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Network", path: "/network", icon: Network },
    { name: "Scanner", path: "/scanner", icon: Shield },
    { name: "Reports", path: "/reports", icon: BarChart },
    { name: "Monitoring", path: "/monitoring", icon: Activity },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-cyber-darker overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-cyber-dark border-r border-cyber-blue/20 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-cyber-blue flex items-center justify-center">
                <Shield size={18} className="text-black" />
              </div>
              <span className="font-mono text-xl tracking-tight text-cyber-blue">
                SentinelAI
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-3 font-mono text-sm rounded-md transition-all duration-200",
                    isActive
                      ? "bg-cyber-blue/20 text-cyber-blue"
                      : "text-gray-300 hover:bg-cyber-blue/10 hover:text-cyber-blue"
                  )
                }
              >
                <item.icon
                  className={cn("mr-3 h-5 w-5 flex-shrink-0")}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-cyber-blue/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/profile')}>
                {(() => {
                  const user = useUser();
                  if (!user) return (
                    <div className="h-8 w-8 rounded-full bg-cyber-subtle flex items-center justify-center animate-pulse">
                      <span className="text-xs font-medium">...</span>
                    </div>
                  );
                  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
                  return (
                    <>
                      <div className="h-8 w-8 rounded-full bg-cyber-subtle flex items-center justify-center">
                        <span className="text-xs font-medium">{initials}</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-gray-200 group-hover:underline">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="relative">
                <div className="flex items-center space-x-2 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-cyber-blue focus:outline-none"
                    onClick={e => {
                      e.stopPropagation();
                      setShowSignOut(v => !v);
                    }}
                    tabIndex={0}
                    onBlur={e => {
                      setTimeout(() => {
                        if (!e.currentTarget.contains(document.activeElement)) setShowSignOut(false);
                      }, 100);
                    }}
                    aria-haspopup="true"
                    aria-expanded={showSignOut}
                  >
                    <LogOut size={18} />
                  </Button>
                  {showSignOut && (
                    <div
                      className="absolute right-[-155px] top-1 min-w-[120px] bg-cyber-dark border border-cyber-blue/30 rounded shadow-xl z-[9999] py-1 flex items-center"
                      tabIndex={-1}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-cyber-blue/10 text-white rounded"
                        onClick={() => { setShowSignOut(false); signOut(auth); navigate('/login'); }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-cyber-dark/80 backdrop-blur-sm border-b border-cyber-blue/20">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>

            <div className="flex flex-1 justify-end items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell size={20} />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-cyber-orange text-black">
                    3
                  </Badge>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-300">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
