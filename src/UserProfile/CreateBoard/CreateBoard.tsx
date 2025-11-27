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
import { MultiSelectCom } from "@/components/ui/MultiSelectCom";
import { useEffect, useState } from "react";
import { DropdownSearch } from "@/components/ui/dropdownSearch";
import { BoardWorkflowAPI } from "../boardWorkflowAPI/BoardWorkflowAPI";
import { toast } from "sonner";

interface BoardFormDataType {
  board_name: string;
  board_owner: string;
  workflow_id: string;
  access?: string[];
}
const CreateBoard = () => {
  const [formdata, setFormdata] = useState<BoardFormDataType>({
    board_name: "",
    board_owner: "",
    workflow_id: "",
    
  });

  const [workflowOptions, setWorkflowOptions] = useState([]);

  const navigate = useNavigate();
  const { FetchWorkflows,CreateBoard } = BoardWorkflowAPI();

  // const workflowOptions = [
  //   { value: "1", label: "w1" },
  //   { value: "2", label: "w2" },
  //   { value: "3", label: "w3" },
  // ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log(formdata)
    if(formdata.workflow_id.trim() === ""){
      toast.warning("Please Select Workflow! ")
      return
    }
    console.log("formdata", formdata);
    const res = await CreateBoard(formdata)
    console.log('res',res)
    if(res?.status){
      toast.success(res.data.message||"Board created successfully")
      navigate("/tickets")
    }
   

  }

  useEffect(() => {
    const GetWorkflows = async () => {
      const response = await FetchWorkflows();
      if (response?.status === 200) {
        console.log("resp", response.data.data);
        const formatted = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.workflow_name,
        }));

        setWorkflowOptions(formatted);
      }
    };
    GetWorkflows();
  }, []);

  // console.log('workflows',workflowOptions)
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto  ">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
          </DialogDescription>
        </DialogHeader>
        <form className=" w-full max-h-[75vh] " onSubmit={handleSubmit}>
          <div className="grid gap-4 overflow-y-auto">
            <div className="grid gap-3">
              <Label htmlFor="bn">Board Name</Label>
              <Input
                id="bn"
                name="bn"
                required
                value={formdata.board_name}
                onChange={(e) =>
                  setFormdata((prev) => ({
                    ...prev,
                    board_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="adm">Board Owner</Label>
              <Input id="adm" name="adm" required value={formdata.board_owner} onChange={(e)=>setFormdata((prev)=>({...prev,board_owner:e.target.value}))} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="wn">Workflow Name</Label>
              {/* <Input id="wn" name="wn"  /> */}
              {/* <MultiSelectCom
                options={workflowOptions}
                value={formdata.workflowName}
                onValueChange={(val) =>
                  setFormdata({ ...formdata, workflowName: val })
                }
              /> */}

              <DropdownSearch
                
                dropdownData={workflowOptions}
                title="Workflow"
                value={formdata.workflow_id}
                size="370"
                onChange={(val) =>
                  setFormdata({ ...formdata, workflow_id: String(val) })
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="acc">Access</Label>
              <Input id="acc" name="acc" />
            </div>
          </div>
          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => navigate("/tickets")}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateBoard;
