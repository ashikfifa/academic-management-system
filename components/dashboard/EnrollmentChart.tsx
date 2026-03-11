"use client";

import dynamic from "next/dynamic";
import { Course, Student } from "@/types";
import { useMemo } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface EnrollmentChartProps {
  courses: Course[];
  students: Student[];
}

export default function EnrollmentChart({ courses, students }: EnrollmentChartProps) {
  const chartData = useMemo(() => {
    const enrollmentCounts = courses.map((course) => {
      const count = students.filter((s) =>
        s.enrolledCourses.includes(course.id)
      ).length;
      return { name: course.code, count };
    });

    return {
      categories: enrollmentCounts.map((d) => d.name),
      data: enrollmentCounts.map((d) => d.count),
    };
  }, [courses, students]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "55%",
        distributed: true,
      },
    },
    colors: [
      "#6366f1",
      "#8b5cf6",
      "#a78bfa",
      "#c084fc",
      "#d946ef",
      "#ec4899",
      "#f43f5e",
      "#f97316",
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: { text: "Students Enrolled" },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} students`,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
  };

  const series = [
    {
      name: "Enrollment",
      data: chartData.data,
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
