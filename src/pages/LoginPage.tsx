
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Mail, Lock } from "lucide-react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const LoginPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login handler with Firebase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  // Signup handler with Firebase
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!signupName.trim()) {
      setError("Name is required.");
      return;
    }
    if (!signupEmail.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      await updateProfile(userCredential.user, { displayName: signupName });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: signupName,
        email: signupEmail
      });
      setSuccess("Account created! You can now log in.");
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.code ? `${err.code}: ${err.message}` : err.message || "Signup failed.");
    }
  };

  // Matrix-style background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Character set for matrix rain
    const characters = "アイウエオカキクケコサシスセソタチツテト0123456789";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the Y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    const draw = () => {
      // Semi-transparent overlay to create fade effect
      ctx.fillStyle = "rgba(34, 31, 38, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text color and font
      ctx.fillStyle = "#0FA0CE";
      ctx.font = `${fontSize}px 'JetBrains Mono'`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset if it's at the bottom of the screen or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 50);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Login Form */}
      <div className="z-10 w-full max-w-md">
        <div className="glass-panel p-8 border border-cyber-blue/30 shadow-lg animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-cyber-blue/20 border border-cyber-blue/40 flex items-center justify-center animate-pulse-glow">
              <Shield size={32} className="text-cyber-blue" />
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold font-mono tracking-tight text-cyber-blue mb-2">
            SentinelAI
          </h1>
          <p className="text-center text-sm text-gray-400 mb-6">
            Advanced Penetration Testing Platform
          </p>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              {error && (
  <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
)}
{success && (
  <div className="mb-4 text-green-500 text-center text-sm">{success}</div>
)}
<form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10 cyber-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-10 cyber-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-cyber-blue focus:ring-cyber-blue"
                      />
                      <label htmlFor="remember" className="text-sm text-gray-400">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-cyber-blue hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full text-black bg-cyber-blue hover:bg-cyber-blue/90"
                  >
                    Log In
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
  <div className="space-y-2">
    <Label htmlFor="signup-name">Name</Label>
    <div className="relative">
      <Input
        id="signup-name"
        type="text"
        className="pl-4 cyber-input"
        placeholder="Your Name"
        value={signupName}
        onChange={(e) => setSignupName(e.target.value)}
        autoComplete="name"
        required
      />
    </div>
  </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        className="pl-10 cyber-input"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        className="pl-10 cyber-input"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        className="pl-10 cyber-input"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full text-black bg-cyber-blue hover:bg-cyber-blue/90">
                    Create Account
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <p className="text-center text-xs text-gray-400 mt-6">
            Protected by advanced encryption & multi-factor authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
