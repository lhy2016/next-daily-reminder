import { Input } from "@/components/ui/input";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { debounce } from "@/util/_";
import { Loader2Icon } from "lucide-react"

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export type AuthFormError = {
  error: string,
  type: 'client' | 'server'
} | null;


export const LoginForm: FC<{}> = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AuthFormError>(null);

    const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError({error: 'Email or password failed', type: 'server'})
            } else {
                router.push('/dashboard')
            }
        } catch (error) {
            setError({error: 'Error. Please try again', type: 'server'})
        } finally {
            setLoading(false)
        }
  }

  useEffect(() => {
    setEmail(email.replace(/\s+/g, ''));
    
  }, [email]);

  const validateEmail = useCallback((emailToValidate: string) => {
    const isEmailValid = emailRegex.test(emailToValidate);  
    if (emailToValidate?.length > 0 && !isEmailValid) {
      setError({
        error: 'Not a valid email format', 
        type: 'client'
      });
    } else {
      setError(null);
    }
  }, []); 

  const hasClientError = () => {
    if (error?.type === 'client') {
      return true;
    }
    return false;
  }

  const debouncedValidateEmail = useMemo(() => {
   return debounce((emailToValidate: string) => {
      validateEmail(emailToValidate);
  }, 1500);
  } , []);

  // delay email validation on email change
  useEffect(() => {
    debouncedValidateEmail(email);
  }, [email, debouncedValidateEmail]);

  useEffect(() => {
    setPassword(password.replace(/\s+/g, ''));
  }, [password])

    return <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="text-red-700">
            {error?.error}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input type="email" id="email" placeholder="Your email" required value={email} onChange={(e) => setEmail(e.target?.value)} disabled={loading} onBlur={() => validateEmail(email)} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input type="password" id="password" placeholder="Your password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          </div>
          <div className="flex flex-col tablet:flex-row justify-between text-sm">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
            <span>Haven&apos;t got an account? <Link href="/auth/signup" className="text-blue-500 hover:underline"> Sign up </Link> now</span>
            
          </div>
          <Button type="submit" className="w-full cursor-pointer" disabled={loading || hasClientError()} > 
           {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
          </Button>
        </form>
}

