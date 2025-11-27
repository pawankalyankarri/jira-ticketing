import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectSearch } from "@/components/ui/SelectSearch";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BoardWorkflowAPI } from "../boardWorkflowAPI/BoardWorkflowAPI";
import { toast } from "sonner";
const AddUserPage = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [email,setEmail] = useState<string>("")
  const [userDetails, setUserDetails] = useState({
    email: "",
    role: "",
  });

  const rolesData = ["admin", "manager", "developer", "tester", "viewer"];
  const navigate = useNavigate()

  const {AddUser} = BoardWorkflowAPI()

  const handleSelectChange = (name: string) => (value: string) => {
    setUserDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const data = {email:[email],role:userDetails.role}
    // console.log("userDetails", userDetails);
    console.log(data)
    try{
      const res = await AddUser(data)
      console.log(res)
      if(res?.data.status){
        toast.success(res.data.message)
        setEmail("")
        setUserDetails((prev)=>({...prev,role:""}))
      }
      else{
        toast.error(res?.data.message)
      }
      
    }
    catch(err){
      console.log('adduserpage',err)
    }

    
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="mail">Enter Gmail</Label>
                <Input
                  id="mail"
                  name="name"
                  type="email"
                  placeholder="Sample@gmail.com"
                  value={email}
                  onChange={(e) =>
                   setEmail(e.target.value)
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="role">Select Role</Label>
                <SelectSearch
                  SelectSearchData={rolesData}
                  title={"Select role"}
                  size={"lg"}
                  value={userDetails.role}
                  onChange={handleSelectChange("role")}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-3 mt-3">
              
                <DialogClose asChild>
                  <Button variant="outline" onClick={()=>navigate("/tickets")}>Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-blue-500 font-bold w-fit text-white hover:bg-blue-600 hover:text-white"
                  variant="outline"
                >
                  Create User
                </Button>
              
            </DialogFooter>
            
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUserPage;
