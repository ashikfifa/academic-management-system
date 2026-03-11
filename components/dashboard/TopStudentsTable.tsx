"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types";
import { Trophy, Medal } from "lucide-react";

interface TopStudentsTableProps {
  students: Student[];
}

function getRankIcon(index: number) {
  if (index === 0) return <Trophy className="w-4 h-4 text-yellow-500" />;
  if (index === 1) return <Medal className="w-4 h-4 text-gray-400" />;
  if (index === 2) return <Medal className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs text-muted-foreground font-medium w-4 text-center">#{index + 1}</span>;
}

function getGpaBadgeVariant(gpa: number): "default" | "secondary" | "destructive" | "outline" {
  if (gpa >= 3.9) return "default";
  if (gpa >= 3.7) return "secondary";
  return "outline";
}

export default function TopStudentsTable({ students }: TopStudentsTableProps) {
  const sorted = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 10);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-center">Year</TableHead>
            <TableHead className="text-right">GPA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((student, index) => (
            <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="flex items-center justify-center">
                {getRankIcon(index)}
              </TableCell>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{student.department}</TableCell>
              <TableCell className="text-center text-sm">{student.year}</TableCell>
              <TableCell className="text-right">
                <Badge variant={getGpaBadgeVariant(student.gpa)}>{student.gpa.toFixed(2)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
