
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Medication } from "@/types/medication";

interface MedicationSummaryProps {
  date: Date | undefined;
  medications: Medication[];
  loading: boolean;
}

export default function MedicationSummary({ date, medications, loading }: MedicationSummaryProps) {
  const formattedDate = date ? format(date, "PPP") : "";
  
  return (
    <div className="mt-6">
      <div className="text-lg font-semibold mb-2">
        {date ? formattedDate : "Select a date"}
      </div>
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <>
          <div className="text-gray-500">
            {medications.length} medication{medications.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">
                {medications.filter(m => m.status === "taken").length} Taken
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-500">
                {medications.filter(m => m.status === "pending").length} Pending
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-500">
                {medications.filter(m => m.status === "missed").length} Missed
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
