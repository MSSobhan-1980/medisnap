
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Medication } from "@/types/medication";
import { updateMedication } from "@/services/medicationService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditMedicationFormProps {
  medication: Medication;
  onComplete: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  instructions: z.string().optional(),
  timing: z.enum(["before_food", "with_food", "after_food", "morning", "afternoon", "evening"]).optional(),
  time: z.string().min(1, "Time is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

export default function EditMedicationForm({ medication, onComplete }: EditMedicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse dosing pattern from notes if available
  const getDosingPattern = () => {
    if (!medication.notes) return ["0", "0", "0"];
    
    const dosingPatternMatch = medication.notes.match(/Dosing pattern: (\d+)\+(\d+)\+(\d+)/);
    if (dosingPatternMatch) {
      console.log("Found dosing pattern in notes:", dosingPatternMatch);
      return [dosingPatternMatch[1], dosingPatternMatch[2], dosingPatternMatch[3]];
    }
    
    // Default values if no pattern found
    console.log("No dosing pattern found in notes, defaulting to 0+0+0");
    return ["0", "0", "0"];
  };

  const [morning, afternoon, evening] = getDosingPattern();
  console.log(`Parsed dosing pattern: Morning=${morning}, Afternoon=${afternoon}, Evening=${evening}`);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: medication.name || "",
      dosage: medication.dosage || "",
      morning: morning || "0",
      afternoon: afternoon || "0", 
      evening: evening || "0",
      instructions: medication.instructions || "",
      timing: medication.timing as any || undefined,
      time: medication.time || "08:00",
      startDate: medication.startDate || new Date().toISOString().split("T")[0],
      endDate: medication.endDate || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Create dosing pattern string from morning, afternoon, evening values
      const dosingPattern = `${data.morning}+${data.afternoon}+${data.evening}`;
      console.log("Setting new dosing pattern:", dosingPattern);
      
      // Prepare the medication data
      const medicationData = {
        name: data.name,
        dosage: data.dosage,
        frequency: medication.frequency, // Keep existing frequency
        time: data.time,
        instructions: data.instructions || "",
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        timing: data.timing,
        notes: `Dosing pattern: ${dosingPattern}`,
      };

      console.log("Updating medication with data:", medicationData);
      await updateMedication(medication.id, medicationData);
      toast.success("Medication updated successfully");
      onComplete();
    } catch (error: any) {
      console.error("Error updating medication:", error);
      toast.error("Failed to update medication: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter medication name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dosage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dosage</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 500mg, 2 tablets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="morning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Morning Dose</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="afternoon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Noon Dose</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="evening"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evening Dose</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When to Take</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange as (value: string) => void}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before_food">Before Food</SelectItem>
                      <SelectItem value="with_food">With Food</SelectItem>
                      <SelectItem value="after_food">After Food</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional instructions..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
