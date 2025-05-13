
import { Button } from "@/components/ui/button";

export function MedicationWeeklyView() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-center">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Weekly View</h3>
      <p className="text-gray-500 mb-4">
        Track your medications over the week at a glance
      </p>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {Array(7).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={`h-16 border rounded-md ${
              i === 2 ? 'bg-white border-medsnap-blue' : 'bg-white'
            } flex flex-col justify-center items-center`}
          >
            <div className="text-xs">{i + 1}</div>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1"></div>
          </div>
        ))}
      </div>
      <Button className="bg-medsnap-blue hover:bg-blue-600">
        View Detailed Weekly Report
      </Button>
    </div>
  );
}
