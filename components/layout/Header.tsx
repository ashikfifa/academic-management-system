"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  ClipboardList,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/faculty", label: "Faculty", icon: Users },
  { href: "/assignments", label: "Assignments", icon: UserCheck },
  { href: "/grades", label: "Grades", icon: ClipboardList },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/students": "Students",
  "/students/new": "Add Student",
  "/courses": "Courses",
  "/courses/new": "Add Course",
  "/faculty": "Faculty",
  "/faculty/new": "Add Faculty",
  "/assignments": "Course Assignments",
  "/grades": "Grade Management",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.match(/^\/students\/\d+\/edit$/)) return "Edit Student";
  if (pathname.match(/^\/students\/\d+$/)) return "Student Profile";
  if (pathname.match(/^\/courses\/\d+\/edit$/)) return "Edit Course";
  if (pathname.match(/^\/faculty\/\d+\/edit$/)) return "Edit Faculty";
  return "Academic Manager";
}

export default function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              AM
            </div>
            <SheetTitle className="font-semibold text-sm m-0 p-0 text-left">Academic Manager</SheetTitle>
          </div>
          <nav className="flex flex-col gap-1 p-3">
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
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
