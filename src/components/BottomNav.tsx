import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Heart, User, Package } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/book", icon: Package, label: "Book" },
  { to: "/sahyog", icon: Heart, label: "Sahyog" },
  { to: "/track", icon: Search, label: "Track" },
  { to: "/profile", icon: User, label: "Profile" },
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-b-0 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 h-0.5 w-6 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
