import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "motion/react";

import { useEffect, useState, type SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardWorkflowAPI } from "../boardWorkflowAPI/BoardWorkflowAPI";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectItemIndicator } from "@radix-ui/react-select";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StateStatusDataType{
  ticket_state: string,
  ticket_status: string,
}
interface idtype {
  ticket_state: string;
  ticket_status: string;
}
interface SortableItemProps {
  status: string[];
  id: string;
  setStateStatusData : React.Dispatch<SetStateAction<StateStatusDataType[]>>
}

function SortableItem({ id, status,setStateStatusData }: SortableItemProps) {
  const [value, setValue] = useState<string>(status[0] ?? "");
  const [open, setOpen] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: "white",
  };

  function handleValueChange(key:string,value:string){
      console.log('key,val',key,value)
      setStateStatusData((prev)=>prev.map(item=>item.ticket_state === key ? {...item,ticket_status:value} : item))
  }
  return (
    <motion.div
      whileDrag={{rotate :2}}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="capitalize flex gap-5 items-center cursor-grab w-full justify-center border-0 outline-0"
    >
      <div className="border-2 border-black p-2 w-[200px] rounded flex gap-2 items-center ">
        <FontAwesomeIcon icon={faGripVertical} />
        {id}
      </div>
      <div className="border-2  border-black p-2 w-[200px] rounded flex gap-2 items-center">
        <FontAwesomeIcon icon={faGripVertical} />
        <div className="w-full">
          {/* <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">{value || "Select Status"}</div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
                {status.map((item) => (
                  <DropdownMenuRadioItem key={item} value={item}>
                    {item}
                    <SelectItemIndicator>
                      <Check className="h-4 w-4 ml-2" />
                    </SelectItemIndicator>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Select onValueChange={(val)=>{
            handleValueChange(id,val)
          }}>
            <SelectTrigger className=" border-0 w-full p-1">
              <SelectValue
                placeholder={status[0]}
                className="text-black font-bold"
              />
            </SelectTrigger>
            <SelectContent>
              {status.map((item, idx) => {
                return (
                  <SelectItem value={item} key={idx}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}

const WorkflowStatusSelect = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [stateData, setStateData] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<string>("");
  const [stateStatusData, setStateStatusData] = useState<StateStatusDataType[]>([]);
  const params = useParams();
  const [data, setData] = useState({
    workflow_id: params.wfId ?? "",
    workflow_order: [] as StateStatusDataType[],
  });

  const navigate = useNavigate();

  const { GetWorkflowStatus, CreateWorkflowStatus } = BoardWorkflowAPI();

  useEffect(() => {
    const getStatus = async () => {
      const response = await GetWorkflowStatus();
      if (response?.status === 200) {
        console.log("response", response);
        const workflow = response.data.workflow ?? [];
        setStateData(workflow);
        setStatus(response.data.status ?? []);
        const initialStatusData = workflow.map((item: any) => ({
          ticket_state: item,
          ticket_status: "open",
        }));
        setStateStatusData(initialStatusData);
      }
    };
    getStatus();
  }, []);

  // console.log("statusstatedata", stateStatusData);
  useEffect(() => {
    setData((prev) => ({ ...prev, workflow_order: stateStatusData }));
  }, [stateStatusData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) {
      // setStatusData((items) => items.filter((item) => item !== active.id));
      return;
    }
    if (active.id !== over.id) {
      console.log("active", active);
      console.log("over", over);
      const oldIndex = stateStatusData.findIndex(
        (item:any) => item.ticket_state === active.id
      );
      const newIndex = stateStatusData.findIndex(
        (item:any) => item.ticket_state === over.id
      );

      const updated = arrayMove(stateStatusData, oldIndex, newIndex);
      setStateStatusData(updated);
      
      // setData((prev) => ({ ...prev, name: updateStatus }));
    }
  };

  function AddNewStatus() {
    // setStateData((prev) => {
    //   const updated = [...prev, newStatus];
    //   // setData((prevData) => ({ ...prevData, name: updated }));
    //   return updated;
    // });
    if(newStatus.trim()!== ""){
      setStateStatusData((prev)=>[...prev,{ticket_state:newStatus,ticket_status:"open"}])

    }
    else{
        toast.warning("Enter Proper State name!")
    }
    

    setNewStatus("");
  }

  async function handleCrateWorkflow() {
    console.log("dta", data);
    const res = await CreateWorkflowStatus(data);
    console.log("response created workflowstatus", res);
    toast.success(res?.data.message);
    navigate("/tickets");
  }
  // console.log(stateData);
  return (
    <Dialog
      open={open}
      // onOpenChange={(isOpen) => {
      //   setOpen(isOpen);
      //   ;
      // }}
    >
      <DialogContent className="  min-w-[60%] h-[80%] overflow-hidden overflow-y-auto p-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.5,
          }}
        >
          <DialogHeader className="w-full ">
            <div className="w-full float-right">
              <FontAwesomeIcon
                onClick={() => toast.warning("Create Workflow status !")}
                icon={faXmark}
                className="cursor-pointer float-right p-1"
              />
            </div>

            <DialogTitle>Choose Workflow Order</DialogTitle>

            <DialogDescription></DialogDescription>
          </DialogHeader>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => {
              handleDragEnd(e);
              // setActiveId(null)
            }}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            // onDragCancel={() => setActiveId(null)}
          >
            <SortableContext
              items={stateStatusData.map((item: any) => item.ticket_state)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3 justify-start items-center mt-4 h-[300px] overflow-y-auto overflow-x-hidden ">
                {stateStatusData
                  ? stateStatusData.map((item: any) => (
                      <SortableItem
                        key={item.ticket_state}
                        id={item.ticket_state}
                        status={status}
                        setStateStatusData = {setStateStatusData}

                      />
                    ))
                  : ""}
              </div>
            </SortableContext>
            {/* <DragOverlay>
              {activeId ? <SortableItem id={activeId} /> : null}
            </DragOverlay> */}
          </DndContext>

          <DialogFooter className="flex sm:flex-col mt-4 ">
            <div className="flex w-full items-center gap-2 mt-5 justify-center ">
              <Input
                type="text"
                placeholder="Enter Status"
                className="w-[50%] py-5"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
              <Button
                type="submit"
                variant="outline"
                onClick={AddNewStatus}
                className="cursor-pointer"
              >
                Add
              </Button>
            </div>
            <div className="w-full flex justify-end">
              <Button
                className="bg-gray-500 hover:bg-gray-500 cursor-pointer "
                onClick={handleCrateWorkflow}
              >
                Create Workflow
              </Button>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowStatusSelect;
