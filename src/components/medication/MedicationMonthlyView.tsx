
import { Button } from "@/components/ui/button";

export function MedicationMonthlyView() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-center">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Monthly View</h3>
      <p className="text-gray-500 mb-4">
        See your monthly medication adherence statistics
      </p>
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full border-8 border-medsnap-blue flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold">87%</div>
            <div className="text-xs text-gray-500">Adherence</div>
          </div>
        </div>
      </div>
      <Button className="bg-medsnap-blue hover:bg-blue-600">
        Generate Monthly Report
      </Button>
    </div>
  );
}
