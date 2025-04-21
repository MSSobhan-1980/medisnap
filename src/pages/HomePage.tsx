
import { Calendar, Clock, Bell, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  // Mock data for today's medications
  const todaysMedications = [
    {
      id: 1,
      name: "Aspirin",
      dosage: "100mg",
      time: "08:00",
      taken: true,
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1000 IU",
      time: "09:30",
      taken: false,
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      time: "13:00",
      taken: false,
    },
    {
      id: 4,
      name: "Lisinopril",
      dosage: "10mg",
      time: "20:00",
      taken: false,
    },
  ];

  const upcomingMedications = todaysMedications.filter(med => !med.taken);
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500">
              <Calendar className="inline mr-2 h-4 w-4" />
              {currentDate}
            </p>
          </div>
          <Link to="/scan">
            <Button className="bg-medsnap-blue hover:bg-blue-600">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Medication
            </Button>
          </Link>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysMedications.length} medications</div>
              <p className="text-xs text-gray-500 mt-1">
                {todaysMedications.filter(med => med.taken).length} taken
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Next Medication</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMedications.length > 0 ? (
                <>
                  <div className="text-2xl font-bold">{upcomingMedications[0].name}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="inline mr-1 h-3 w-3" />
                    {upcomingMedications[0].time}
                  </p>
                </>
              ) : (
                <div className="text-lg">All medications taken</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((todaysMedications.filter(med => med.taken).length / todaysMedications.length) * 100)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Today's Schedule */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
          <p className="text-sm text-gray-500">
            <Clock className="inline mr-1 h-4 w-4" />
            Current time: {currentTime}
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {todaysMedications.map((medication) => (
                <div 
                  key={medication.id} 
                  className={`flex items-center justify-between p-4 ${
                    medication.taken ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                        medication.taken 
                          ? "bg-gray-100 text-gray-400" 
                          : "bg-medsnap-blue text-white"
                      }`}
                    >
                      {medication.taken ? "✓" : <Bell className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{medication.name}</h3>
                      <p className="text-sm text-gray-500">{medication.dosage} • {medication.time}</p>
                    </div>
                  </div>
                  
                  <div>
                    {medication.taken ? (
                      <span className="text-sm text-gray-500">Taken</span>
                    ) : (
                      <Button variant="outline" size="sm">
                        Mark as Taken
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-medsnap-blue to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">Upgrade to Pro</h3>
                <p className="text-blue-100 mt-1">
                  Get access to advanced features like drug interaction warnings and more.
                </p>
              </div>
              <Button variant="secondary" className="whitespace-nowrap">
                View Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
