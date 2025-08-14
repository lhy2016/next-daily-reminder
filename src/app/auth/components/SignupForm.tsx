import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { FC, useState } from "react";

export const SignupForm: FC<{}> = ({}) => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        router.push('/auth/signin?message=registered')
      } else {
        const data = await response.json()
        setError(data.error ?? 'Sign up failed.')
      }
    } catch (error) {
      setError('Error. Please try again.')
    } finally {
      setLoading(false)
    }
  }
    return <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Name (optional)</label>
            <Input type="text" placeholder="Your name" value={name} onChange={(e: FormEvent) => {setName(e.currentTarget.value)}} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" required value={email} onChange={(e: FormEvent) => setEmail(e.currentTarget.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Your password" required />
          </div>
          <div className="text-sm">
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Already have an account? Login now
            </Link>
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>;
}