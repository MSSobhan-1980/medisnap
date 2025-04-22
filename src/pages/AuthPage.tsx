import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const [view, setView] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (view === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        navigate("/profile-setup");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-center mb-2">{view === "login" ? "Sign In" : "Sign Up"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={view === "login" ? "current-password" : "new-password"}
              minLength={6}
            />
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {view === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="text-center mt-4 text-sm">
            {view === "login" ? (
              <>
                Don't have an account?{" "}
                <button type="button" className="text-blue-500 hover:underline" onClick={() => setView("signup")}>
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button type="button" className="text-blue-500 hover:underline" onClick={() => setView("login")}>
                  Log In
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
