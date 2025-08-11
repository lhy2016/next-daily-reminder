"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const getInitialTab = () => {
    if (pathname.includes("signup")) return "signup";
    return "signin";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/auth/${value}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      {/* Login Form */}
      <TabsContent value="signin">
        <form className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Your password" required />
          </div>
          <div className="flex justify-between text-sm">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
            <button
              type="button"
              onClick={() => handleTabChange("signup")}
              className="text-blue-500 hover:underline"
            >
              Haven&apos;t got an account? Sign up now
            </button>
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </TabsContent>

      {/* Sign Up Form */}
      <TabsContent value="signup">
        <form className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Name (optional)</label>
            <Input type="text" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Your password" required />
          </div>
          <div className="text-sm">
            <button
              type="button"
              onClick={() => handleTabChange("signin")}
              className="text-blue-500 hover:underline"
            >
              Already have an account? Login now
            </button>
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}