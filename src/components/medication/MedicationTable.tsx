
import { ListOrdered, Pill, FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Medication } from "@/types/medication";
import { MedicationTimingDisplay } from "./MedicationTimingDisplay";
import { MedicationStatus } from "./MedicationStatus";
import { getMedicationName, getDosingPatternText, hasSpecialInstructions } from "@/utils/medicationUtils";

interface MedicationTableProps {
  medications: Medication[];
  onMarkAsTaken: (medicationId: string) => Promise<void>;
  onMarkAsMissed: (medicationId: string) => Promise<void>;
  onDelete: (medicationId: string) => Promise<void>;
  onEdit: (medication: Medication) => void;
}

export function MedicationTable({ 
  medications, 
  onMarkAsTaken, 
  onMarkAsMissed,
  onDelete,
  onEdit
}: MedicationTableProps) {
  const sortedMedications = [...medications].sort((a, b) => 
    a.time?.localeCompare(b.time || "") || 0
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead className="w-[120px]">Morning</TableHead>
            <TableHead className="w-[120px]">Noon</TableHead>
            <TableHead className="w-[120px]">Evening</TableHead>
            <TableHead className="w-[180px]">Dosing Pattern</TableHead>
            <TableHead className="w-[120px] text-right">Status</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMedications.map((med, index) => (
            <TableRow key={med.id} className={hasSpecialInstructions(med) ? "border-l-4 border-l-amber-400" : ""}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <ListOrdered className="h-4 w-4 text-gray-400 mr-2" />
                  {index + 1}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <div className="font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4 text-medsnap-blue" />
                    {getMedicationName(med)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {med.dosage || "No dosage specified"}
                  </div>
                  {hasSpecialInstructions(med) && (
                    <div className="flex items-center mt-1 bg-amber-50 p-1 rounded text-xs text-amber-800">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>{med.instructions}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <MedicationTimingDisplay medication={med} period="morning" />
              </TableCell>
              <TableCell>
                <MedicationTimingDisplay medication={med} period="afternoon" />
              </TableCell>
              <TableCell>
                <MedicationTimingDisplay medication={med} period="evening" />
              </TableCell>
              <TableCell>
                <div className="flex items-start">
                  <span className="text-sm font-medium">{getDosingPatternText(med)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <MedicationStatus 
                  medication={med} 
                  onMarkAsTaken={onMarkAsTaken}
                  onMarkAsMissed={onMarkAsMissed}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => onEdit(med)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(med.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
