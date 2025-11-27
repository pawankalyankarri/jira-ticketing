import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const [loginDetails,setLoginDetails] = useState({
    email : "",
    password : ""
  })

  const {SingInUser} = BoardWorkflowAPI()

  const handleLogin = async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      console.log(loginDetails)
      const response = await SingInUser(loginDetails)
      console.log('res',response)
  } 

  return (
    <div className="overflow-hidden min-h-screen flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("max-w-sm w-full")}
      >
        <div className={cn("flex flex-col gap-6 w-full ", className)}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={loginDetails.email}
                      onChange={(e)=>setLoginDetails(prev=>({...prev,email:e.target.value}))}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required value={loginDetails.password} onChange={(e)=>setLoginDetails(prev=>({...prev,password : e.target.value}))} />
                  </Field>
                  <Field>
                    <Button type="submit">Login</Button>
                    <Button variant="outline" type="button">
                      Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="#">Sign up</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
