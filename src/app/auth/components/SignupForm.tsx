import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";


const FormFieldValidationPopOver: FC<{display: boolean, messages: {label: string, met: boolean, [key: string]: any}[]}> = ({display, messages}) => {
  if (!display || messages.length === 0) {
    return null;
  }
  console.log(messages);
  return (
    <div className="absolute w-full bg-white border border-gray-300 rounded-md p-2 shadow-md">
      <ul className="list-disc pl-4">
        {messages.map((msg, index) => (
          <li key={index} className={"text-sm " +(msg.met ? "text-green-700" : "text-red-700")}>{msg.label}</li>
        ))}
      </ul>
    </div>
  );
}


export const passwordRequirements = () => {
    
    const specialChars = "!@#$%^&_\\-+={}|<>.~?";
    return [
      {
        "label": "at least 8 characters",
        "check": (pw: string) => pw.length >= 8
      }, 
      {
        "label": "at least one uppercase letter",
        "check": (pw: string) => /[A-Z]/.test(pw)
      },
      {
        "label": "at least one number",
        "check": (pw: string) => /\d/.test(pw)
      },
      { 
        "label": `at least one special character in: ${specialChars?.replaceAll(/\\/g, '')}`,
        "check": (pw: string) => new RegExp(`[${specialChars}]`).test(pw)
      }]
}


export const SignupForm: FC<{}> = ({}) => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRequirementMets, setPasswordRequirementMets] = useState(passwordRequirements().map(req => ({ ...req, met: true })));
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    const requirements = passwordRequirements();
    const requirementsMet = requirements.map(req => ({
      ...req,
      met: req.check(password)
    }));
    setPasswordRequirementMets(requirementsMet);
  }, [password])

    return <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium" htmlFor="name">Name (optional)</label>
            <Input type="text" placeholder="Your name" id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input type="email" placeholder="Your Email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="relative">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input type="password" placeholder="Your password" id="password" required  value={password} onChange={(e) => setPassword(e.target.value?.replaceAll(/\s+/g, ''))} />
            <FormFieldValidationPopOver display={password?.length > 0 && passwordRequirementMets.some(req => !req.met)} 
                                        messages={passwordRequirementMets} />
          </div>
          <div className="text-sm">Already have an account? <Link href="/auth/signin" className="text-blue-500 hover:underline"> Login </Link> now
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>;
}