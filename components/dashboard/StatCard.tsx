"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  gradient: string;
}

export default function StatCard({ title, value, icon: Icon, description, gradient }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className={`flex items-center gap-4 p-5 ${gradient}`}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {description && (
              <p className="text-xs text-white/60 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
