
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Medication } from "@/types/medication";

interface DashboardMetricsProps {
  medications: Medication[];
  loading: boolean;
  activePatient: string;
}

export default function DashboardMetrics({ medications, loading, activePatient }: DashboardMetricsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Overall Adherence</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-3xl font-bold text-medsnap-blue">
                {medications.length > 0 ? 
                  Math.round((medications.filter(m => m.status === 'taken').length / medications.length) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-500">Last 30 days</p>
              <div className="h-2 bg-gray-100 rounded-full mt-4">
                <div 
                  className="h-2 bg-medsnap-blue rounded-full" 
                  style={{ width: medications.length > 0 ? 
                    `${Math.round((medications.filter(m => m.status === 'taken').length / medications.length) * 100)}%` : '0%' 
                  }}
                ></div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Medications Tracked</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <>
              <div className="text-3xl font-bold">{medications.length}</div>
              <p className="text-sm text-gray-500">
                {activePatient === 'self' ? 'Your' : 'Their'} medications
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">View All</Button>
                <Button size="sm" onClick={() => navigate("/scan")}>Add New</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upcoming Refills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">0</div>
          <p className="text-sm text-gray-500">In the next 7 days</p>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View Refill Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
