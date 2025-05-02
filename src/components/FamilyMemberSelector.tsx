
import { useState } from "react";
import { useAuth, FamilyMember } from "@/hooks/useAuth";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserRound, Plus, Users, UserPlus, ChevronDown, User, Edit, Trash } from "lucide-react";

const addMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(1, "Please select a relationship"),
});

export default function FamilyMemberSelector() {
  const { 
    profile, 
    familyMembers, 
    activeMember, 
    setActiveMember, 
    addFamilyMember,
    deleteFamilyMember
  } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      relationship: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addMemberSchema>) => {
    const result = await addFamilyMember(values.name, values.relationship);
    if (!result.error) {
      form.reset();
      setAddDialogOpen(false);
    }
  };
  
  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    const result = await deleteFamilyMember(memberToDelete.id);
    if (!result.error) {
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map((n) => n[0]).join('');
  };
  
  const handleSelectSelf = () => {
    setActiveMember(null);
  };

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {activeMember ? (
                <AvatarImage src={activeMember.avatar_url || ""} alt={activeMember.name} />
              ) : (
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name} />
              )}
              <AvatarFallback className="text-xs">
                {activeMember ? 
                  getInitials(activeMember.name) : 
                  getInitials(profile?.full_name || "")}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate">
              {activeMember ? activeMember.name : profile?.full_name || "You"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="end">
          <div className="p-2">
            <div className="text-sm font-medium px-2 py-1.5">Switch profile</div>
            <div className="mt-1 space-y-1">
              <Button 
                variant={!activeMember ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={handleSelectSelf}
              >
                <User className="mr-2 h-4 w-4" />
                <span className="truncate">{profile?.full_name || "You"} (Primary)</span>
              </Button>
              
              {familyMembers.map(member => (
                <Button 
                  key={member.id}
                  variant={activeMember?.id === member.id ? "secondary" : "ghost"}
                  className="w-full justify-start group"
                  onClick={() => setActiveMember(member)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate flex-1">{member.name}</span>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMemberToDelete(member);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </Button>
              ))}
            </div>
          </div>
          <div className="border-t p-2">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add family member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Family Member</DialogTitle>
                  <DialogDescription>
                    Add a family member to manage their medications
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Family member's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="grandparent">Grandparent</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Member</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Family Member</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {memberToDelete?.name}? This will also delete all their medication records and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setDeleteDialogOpen(false);
                      setMemberToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
