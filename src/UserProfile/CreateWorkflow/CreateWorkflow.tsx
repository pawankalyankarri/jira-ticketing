import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { DropdownSearch } from "@/components/ui/dropdownSearch";
import { useState } from "react";
import { BoardWorkflowAPI } from "../boardWorkflowAPI/BoardWorkflowAPI";
import { toast } from "sonner";

const CreateWorkflow = () => {
  const [formdata, setFormdata] = useState({
    workflow_name: "",
    created_by: "",
  });
  const navigate = useNavigate();
  const { CreateWorkflow } = BoardWorkflowAPI();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log("form", formdata);
    const res = await CreateWorkflow(formdata)
    if(res?.status === 200){
      console.log('res',res)
    if(!res?.data.status){
      toast.warning(res.data.message)
      return
    }
    const wfId = res.data.workflow_id
    console.log('res workflow created',res)
    navigate(`/tickets/statusSelect/${wfId} `);
    }
    
  }

  return (
    <Dialog open={true}>
      {/* <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger> */}
      <DialogContent className="overflow-y-auto">
        <div className="">
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="grid gap-4">
              <div className="grid gap-3">
                {/* <Label htmlFor="wn">Workflow Name</Label> */}
                <Input
                  id="wn"
                  name="wn"
                  required
                  placeholder="Workflow Name"
                  value={formdata.workflow_name}
                  onChange={(e) =>
                    setFormdata((prev) => ({
                      ...prev,
                      workflow_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-3">
                <Input
                  id="cb"
                  name="cb"
                  placeholder="Created by"
                  required
                  value={formdata.created_by}
                  onChange={(e) =>
                    setFormdata((prev) => ({
                      ...prev,
                      created_by: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end w-full gap-5">
                <DialogFooter className="w-auto">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/tickets")}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
                <div className="w-auto flex gap-5 justify-end">
                  <Button type="submit" className="cursor-pointer">
                    Create workflow
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateWorkflow;
