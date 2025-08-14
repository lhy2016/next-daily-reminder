import { Input } from "@/components/ui/input";

import { FC, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";



export const LoginForm: FC<{}> = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('')
        

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email or password failed')
            } else {
                router.push('/dashboard')
            }
        } catch (error) {
            setError('Error. Please try again')
        } finally {
            setLoading(false)
        }
  }

    return <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="Your email" required value={email} onChange={(e) => setEmail(e.currentTarget.value?.replace(/\s+/g, ''))} disabled={loading} />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Your password" required value={password} onChange={(e) => setPassword(e.currentTarget.value?.replace(/\s+/g, ''))} disabled={loading} />
          </div>
          <div className="flex justify-between text-sm">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
            <Link href="/auth/signup">
                Haven&apos;t got an account? Sign up now
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading} >Login</Button>
        </form>
}

