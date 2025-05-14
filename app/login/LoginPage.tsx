"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AtSign,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage({
  registered,
  error,
  callbackUrl,
}: {
  registered: string | null;
  error: string | null;
  callbackUrl: string | "/profile";
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is authenticated, redirecting to profile page");
      router.push("/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (registered === "true") {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }

    if (error) {
      setLoginError("Invalid email or password");
    }
  }, [registered, error]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      console.log("Attempting to sign in with:", {
        email: formData.email,
        password: "***",
      });
      console.log("Callback URL:", callbackUrl);

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        if (result.error === "AccountNotVerified") {
          setLoginError(
            "Your account has not been verified yet. Please check your email."
          );
        } else {
          setLoginError("Invalid email or password");
        }
        setIsSubmitting(false);
        return;
      }

      if (result?.ok) {
        console.log("Login successful, redirecting to:", callbackUrl);
        // Force a hard redirect to ensure the page is fully reloaded
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login");
      setIsSubmitting(false);
    }
  };

  // If already logged in, don't show the login form
  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              You are already logged in
            </h1>
            <p className="mb-4">Redirecting to your profile page...</p>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container grid md:grid-cols-2 gap-6 px-4 md:px-6">
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
            <Image
              src="/images/banner6.png"
              alt="Login Background"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            {showSuccessMessage && (
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Account created successfully! Verify Email
                </AlertDescription>
              </Alert>
            )}

            {loginError && (
              <Alert className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-primary">
                Login to Your Account
              </h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your Twelsky Valhalla account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full fire-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
