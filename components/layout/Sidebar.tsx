"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/faculty", label: "Faculty", icon: Users },
  { href: "/assignments", label: "Assignments", icon: UserCheck },
  { href: "/grades", label: "Grades", icon: ClipboardList },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 sticky top-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
          AM
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm truncate">Academic Manager</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
