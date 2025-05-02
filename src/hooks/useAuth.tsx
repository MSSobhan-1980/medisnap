
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  primary_user_id: string;
  created_at: string;
  avatar_url?: string | null;
}

interface AuthContextProps {
  session: any;
  user: any;
  profile: any;
  loading: boolean;
  familyMembers: FamilyMember[];
  activeMember: FamilyMember | null;
  setActiveMember: (member: FamilyMember | null) => void;
  fetchFamilyMembers: () => Promise<void>;
  addFamilyMember: (name: string, relationship: string, avatarUrl?: string) => Promise<{ error?: string }>;
  updateFamilyMember: (id: string, data: Partial<Omit<FamilyMember, "id" | "primary_user_id" | "created_at">>) => Promise<{ error?: string }>;
  deleteFamilyMember: (id: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeMember, setActiveMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
          fetchFamilyMembers();
        }, 0);
      } else {
        setProfile(null);
        setFamilyMembers([]);
        setActiveMember(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFamilyMembers();
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast.error("Error fetching profile", { description: error.message });
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (err) {
      toast.error("Unexpected error", { description: String(err) });
      setProfile(null);
    }
  };

  const fetchFamilyMembers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("primary_user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Error fetching family members", { description: error.message });
        return;
      }

      setFamilyMembers(data || []);
      
      // If we have family members but no active member, set the first one as active
      if (data && data.length > 0 && !activeMember) {
        setActiveMember(data[0]);
      }
    } catch (err) {
      toast.error("Unexpected error", { description: String(err) });
    }
  };

  const addFamilyMember = async (name: string, relationship: string, avatarUrl?: string) => {
    if (!user) return { error: "Not authenticated" };
    
    try {
      const { data, error } = await supabase
        .from("family_members")
        .insert({
          name,
          relationship,
          primary_user_id: user.id,
          avatar_url: avatarUrl
        })
        .select()
        .single();
      
      if (error) {
        toast.error("Error adding family member", { description: error.message });
        return { error: error.message };
      }

      toast.success(`Added ${name} to your family`);
      await fetchFamilyMembers();
      return {};
    } catch (err) {
      toast.error("Unexpected error", { description: String(err) });
      return { error: String(err) };
    }
  };

  const updateFamilyMember = async (id: string, data: Partial<Omit<FamilyMember, "id" | "primary_user_id" | "created_at">>) => {
    if (!user) return { error: "Not authenticated" };
    
    try {
      const { error } = await supabase
        .from("family_members")
        .update(data)
        .eq("id", id)
        .eq("primary_user_id", user.id);
      
      if (error) {
        toast.error("Error updating family member", { description: error.message });
        return { error: error.message };
      }

      toast.success("Family member updated");
      await fetchFamilyMembers();
      
      // If we updated the active member, update the active member state
      if (activeMember && activeMember.id === id) {
        const updatedMember = familyMembers.find(m => m.id === id);
        if (updatedMember) {
          setActiveMember({...updatedMember, ...data});
        }
      }
      
      return {};
    } catch (err) {
      toast.error("Unexpected error", { description: String(err) });
      return { error: String(err) };
    }
  };

  const deleteFamilyMember = async (id: string) => {
    if (!user) return { error: "Not authenticated" };
    
    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id)
        .eq("primary_user_id", user.id);
      
      if (error) {
        toast.error("Error deleting family member", { description: error.message });
        return { error: error.message };
      }

      toast.success("Family member removed");
      
      // If we deleted the active member, set the active member to null
      if (activeMember && activeMember.id === id) {
        setActiveMember(null);
      }
      
      await fetchFamilyMembers();
      return {};
    } catch (err) {
      toast.error("Unexpected error", { description: String(err) });
      return { error: String(err) };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email, 
        password,
        options: { 
          data: metadata 
        }
      });

      if (error) {
        toast.error("Sign Up Error", { description: error.message });
        return { error: error.message };
      }

      toast.success("Signed up successfully!");
      return {};
    } catch (err) {
      toast.error("Unexpected sign up error", { description: String(err) });
      return { error: String(err) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        toast.error("Sign In Error", { description: error.message });
        return { error: error.message };
      }

      toast.success("Signed in successfully!");
      return {};
    } catch (err) {
      toast.error("Unexpected sign in error", { description: String(err) });
      return { error: String(err) };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Sign out error", { description: String(err) });
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setFamilyMembers([]);
      setActiveMember(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      profile, 
      familyMembers,
      activeMember,
      setActiveMember,
      fetchFamilyMembers,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
