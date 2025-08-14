"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, FC} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";


export const AuthTabs: FC<{}> = () => {
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
        <LoginForm />
      </TabsContent>

      {/* Sign Up Form */}
      <TabsContent value="signup">
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
}