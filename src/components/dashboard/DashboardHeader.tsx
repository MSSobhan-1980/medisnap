
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  activePatient: string;
  setActivePatient: (patient: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default function DashboardHeader({ activePatient, setActivePatient, date, setDate }: DashboardHeaderProps) {
  const { profile } = useAuth();
  
  const patients = [
    { id: "self", name: profile?.full_name ? `${profile.full_name} (You)` : "You" }
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Medication Dashboard</h1>
        <p className="text-gray-500">Track your medication schedule and history</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
        <select 
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-medsnap-blue focus:border-transparent"
          value={activePatient}
          onChange={(e) => setActivePatient(e.target.value)}
        >
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        <Button onClick={() => setDate(new Date())}>
          Today
        </Button>
      </div>
    </div>
  );
}
