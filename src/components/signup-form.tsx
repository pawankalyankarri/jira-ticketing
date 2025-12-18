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
import { Input } from "@/components/ui/input";
import { SelectSearch } from "./ui/SelectSearch";
import { motion } from "motion/react";
import { useState } from "react";
import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SignupForm() {
  // const [confirmPassword,setConfirmPassword] = useState<string>("")
  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const { SignUpUser } = BoardWorkflowAPI();
  const navigate = useNavigate()
  // const rolesData = ["admin", "manager", "developer", "tester", "viewer"];

  // const handleSelectChange = (name: string) => (value: string) => {
  //   setDetails((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: String(value),
    }));
    // console.log(details);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(details);

    const response = await SignUpUser(details);
    console.log("resp", response);
    if(response?.data.status){
      navigate("/")
      toast.success(response.data.message)
      
    }
    else{
      toast.error(response?.data.message)
    }
  };

  return (
    <div className="flex items-center justify-center  min-h-screen ">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="  w-full max-w-md  rounded-xl shadow-lg bg-white"
    >
      <div className="flex flex-col w-full ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="flex gap-4">
              <div>
                <FieldLabel htmlFor="fname">First Name</FieldLabel>
                <Input
                  id="fname"
                  type="text"
                  placeholder="John"
                  name="first_name"
                  required
                  value={details.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <FieldLabel htmlFor="lname">Last Name</FieldLabel>
                <Input
                  id="lname"
                  type="text"
                  placeholder="Doe"
                  required
                  name="last_name"
                  value={details.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={details.email}
                  onChange={handleInputChange}
                />
                {/* <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription> */}
              </div>
              <div>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                  value={details.password}
                  onChange={handleInputChange}
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </div>
              {/* <div>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required name="confirm_password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </div> */}
              {/* <div className="grid gap-3">
                <FieldLabel htmlFor="role">Select Role</FieldLabel>
                <SelectSearch
                  SelectSearchData={rolesData}
                  title={"Select role"}
                  size={"lg"}
                  value={details.role}
                  onChange={handleSelectChange("role")}
                  
                />
              </div> */}
              <div>
                <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
                <Input
                  id="mobile"
                  type="tel"
                  required
                  name="phone_number"
                  value={details.phone_number}
                  onChange={handleInputChange}
                />
                {/* <FieldDescription>.</FieldDescription> */}
              </div>

              <FieldGroup>
                <div className="flex gap-3 flex-col">
                  <Button type="submit">Create Account</Button>
                  {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <a href="login">Sign in</a>
                  </FieldDescription>
                </div>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      </div>
    </motion.div>
    </div>
  );
}
