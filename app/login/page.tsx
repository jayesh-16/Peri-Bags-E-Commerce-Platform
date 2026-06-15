"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
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
            alt="Leather artisan hands working"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBMHuRzb7JlqCNOQwH4Vf7x7WpbKvp4TxJGXf82WanpH4ndFRnPxmnMudNJpX9egynytXnlx3yB-cdeRwR6PPlYRFe5v0nKyxP0Sa-skaET3BXFwY1Dhi0Yu1L3pvcUcM9wokoXKKZhgLtZ1zga-ogJoj8MYFNArj7Q1Yw6c5Iq2ivd3OTTlynwjx756yYlG7g-j4eEugCMo7IEeNTmImsR-msa3PdJfuKOmAnqyXMbvJWuHXWc8maig"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-surface-bright">
          <div>
            <h2 className="font-display text-[56px] md:text-[80px] leading-[1.1] tracking-[-0.02em] font-bold max-w-md">
              The art of lasting beauty.
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

      {/* Login Form Side */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-sm">
          {/* Brand Anchor */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="font-display text-4xl font-semibold text-primary mb-2">
              <Link href="/">Peri Bags</Link>
            </h1>
            <div className="h-1 w-12 bg-secondary mx-auto md:mx-0"></div>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="font-display text-3xl font-semibold text-primary">
              Welcome Back
            </h2>
            <p className="text-on-surface-variant font-body mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className={`block font-body text-[14px] uppercase tracking-wider transition-colors ${
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className={`block font-body text-[14px] uppercase tracking-wider transition-colors ${
                    isFocused["password"] ? "text-secondary" : "text-on-surface-variant"
                  }`}
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  className="text-[14px] font-body text-secondary hover:text-on-secondary-container transition-colors"
                  href="#"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg font-body text-primary transition-all duration-200 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              className="w-full py-4 bg-primary text-on-primary font-body text-[16px] font-medium tracking-wide uppercase rounded-full hover:bg-secondary transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Create Account */}
            <div className="text-center mt-8">
              <p className="text-on-surface-variant font-body">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-secondary font-semibold hover:underline decoration-secondary/30 underline-offset-4 transition-all"
                  href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </form>

          {/* Admin Portal Access */}
          <div className="mt-24 pt-8 border-t border-border flex justify-center">
            <Link
              className="group flex items-center gap-2 text-on-surface-variant/60 hover:text-secondary transition-colors duration-200"
              href="/admin"
            >
              <span className="material-symbols-outlined text-[18px]">
                admin_panel_settings
              </span>
              <span className="font-body text-[14px] tracking-tight">
                Admin Portal
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
