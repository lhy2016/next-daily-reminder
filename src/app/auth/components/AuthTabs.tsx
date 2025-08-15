"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, FC, Fragment} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    <Fragment>
    <h1 className="text-4xl mb-6"> {activeTab === "signup" ? "We're glad to have you here" : "Welcome back" } </h1>
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin" className="cursor-pointer">Login</TabsTrigger>
        <TabsTrigger value="signup" className="cursor-pointer">Sign Up</TabsTrigger>
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
    </Fragment>
  );
}