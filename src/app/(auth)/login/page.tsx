"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Diamond } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
      // @ts-ignore
      if (result.error.includes("register")) {
        // @ts-ignore
        setError("root", { type: "manual", message: result.error });
      } else {
        // @ts-ignore
        setError("root", { type: "manual", message: result.error });
      }
    } else {
      toast.success("Logged in successfully!");
      router.push("/account");
      router.refresh();
    }
  };

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/account" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 fog-bg">
      <div className="w-full max-w-md bg-background/80 backdrop-blur-xl border border-border rounded-xl p-8 shadow-2xl glow-border">
        <div className="flex flex-col items-center mb-8">
          <Diamond className="w-12 h-12 text-primary mb-4" />
          <h1 className="font-serif text-3xl tracking-widest text-white mb-1">OBSYDIAN</h1>
          <p className="text-[10px] tracking-[0.3em] text-gray-400">CLOTHING</p>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          {errors.root && (
            <div className="bg-red-500/10 border border-red-500/50 rounded p-3 mt-4 text-center">
              <p className="text-red-500 text-sm font-medium">{errors.root.message}</p>
              {errors.root.message?.includes("register first") && (
                <Link href="/register" className="inline-block mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                  Go to Register
                </Link>
              )}
            </div>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-border w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-400 uppercase">or continue with</span>
          <span className="border-b border-border w-1/5 lg:w-1/4"></span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-6"
          onClick={loginWithGoogle}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:text-primary-glow font-medium">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
