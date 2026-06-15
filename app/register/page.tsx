"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

import { Suspense } from "react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both password fields match exactly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Registration successful, now automatically sign them in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Fallback if auto-login fails for some reason
        toast({
          title: "Registration Successful",
          description: "Your account was created. Please sign in.",
        });
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else {
        toast({
          title: "Welcome to Peri Bags",
          description: "Your account has been created successfully.",
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleFocus = (field: string) => setIsFocused({ ...isFocused, [field]: true });
  const handleBlur = (field: string) => setIsFocused({ ...isFocused, [field]: false });

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Brand Visual Side */}
      <section className="hidden md:flex w-1/2 relative bg-surface-container overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Leather artisanal craft"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK4m6Ilm0kVPCxd0H1vniAs-eP6DzoW-vIQP6yJZyWabn-G-0Fa5dGuKx2oz5l2XmzdJ0-X2mdRQFD1YxXIkCDYkJVXJUXKucXijc58ODt2sO0zxc-QnrKJy37D_f8OlAEcpHc2GkSTdP9zH23bKnhSyc5U-JdcVVNSpd6o1oGfhOolQNzozXU96TmBmPOXbN1ihBd0Z5pnDyxQzzpJgzPbGwcxFhoAYwF2HK3ZcAHu1-Hc1o6FsKC1w"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-surface-bright">
          <div>
            <h2 className="font-display text-[56px] md:text-[80px] leading-[1.1] tracking-[-0.02em] font-bold max-w-md italic">
              Become part of the story.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-surface-bright/60"></div>
            <span className="font-body text-[14px] tracking-widest-plus uppercase">
              Est. 2024
            </span>
          </div>
        </div>
      </section>

      {/* Register Form Side */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-surface-container-lowest overflow-y-auto">
        <div className="w-full max-w-sm my-auto py-8">
          {/* Brand Anchor */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-display text-4xl font-semibold text-primary mb-2">
              <Link href="/">Peri Bags</Link>
            </h1>
            <div className="h-1 w-12 bg-secondary mx-auto md:mx-0"></div>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h2 className="font-display text-3xl font-semibold text-primary">
              Create an Account
            </h2>
            <p className="text-on-surface-variant font-body mt-2">
              Join us to track orders and save details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label
                className={`block font-body text-[13px] uppercase tracking-wider transition-colors ${
                  isFocused["name"] ? "text-secondary" : "text-on-surface-variant"
                }`}
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body text-primary transition-all duration-200 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                className={`block font-body text-[13px] uppercase tracking-wider transition-colors ${
                  isFocused["email"] ? "text-secondary" : "text-on-surface-variant"
                }`}
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body text-primary transition-all duration-200 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                className={`block font-body text-[13px] uppercase tracking-wider transition-colors ${
                  isFocused["password"] ? "text-secondary" : "text-on-surface-variant"
                }`}
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body text-primary transition-all duration-200 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                className={`block font-body text-[13px] uppercase tracking-wider transition-colors ${
                  isFocused["confirmPassword"] ? "text-secondary" : "text-on-surface-variant"
                }`}
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body text-primary transition-all duration-200 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  type="password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              className="w-full py-4 bg-primary text-on-primary font-body text-[16px] font-medium tracking-wide uppercase rounded-full hover:bg-secondary transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Already have an account */}
            <div className="text-center mt-6">
              <p className="text-on-surface-variant font-body">
                Already have an account?{" "}
                <Link
                  className="text-secondary font-semibold hover:underline decoration-secondary/30 underline-offset-4 transition-all"
                  href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
