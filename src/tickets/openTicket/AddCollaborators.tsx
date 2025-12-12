import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  TicketCollaboratorsDataType,
  TicketDetails,
  UsersDataType,
} from "../ticketInterfaces/TicketInterfaces";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, ChevronDown, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";
import { UseTickets } from "../hooks/UseTickets";

interface AddCollaboratorsProps {
  collabDialog: boolean;
  setCollabDialog: Dispatch<SetStateAction<boolean>>;
  collaborators: TicketCollaboratorsDataType[];
  setCollaborators: Dispatch<SetStateAction<TicketCollaboratorsDataType[]>>;
  usersData: UsersDataType[];
  ticketDetails : TicketDetails;
}

const AddCollaborators = ({
  collabDialog,
  setCollabDialog,
  setCollaborators,
  collaborators,
  usersData,
  ticketDetails
}: AddCollaboratorsProps) => {
  const [collabsOpen, setCollabsOpen] = useState<boolean>(false);
  const {CreateTicketCollaborators,RemoveTicketCollaborator} = UseTickets()

  const handleSelect = async (item: UsersDataType) => {
    const isSelected = collaborators.some((c) => c.user_id === item.id);

    if (isSelected) {
      setCollaborators((prev) => prev.filter((c) => c.user_id !== item.id));
    } else {
      setCollaborators((prev: any) => [...prev, { user_id: item.id }]);
    }

    try {
      if (!isSelected) {
        await CreateTicketCollaborators({
          ticket_id: String(ticketDetails.id),
          user_id: Number(item.id),
        });
      } else {
        await RemoveTicketCollaborator({
          ticket_id: String(ticketDetails.id),
          user_id: Number(item.id),
        });
      }
    } catch (err) {
      console.error("selecting adding or deleting collaborators", err);

      setCollaborators((prev: any) => {
        if (isSelected) {
          return [...prev, { user_id: item.id }];
        } else {
          return prev.filter((c: any) => c.user_id !== item.id);
        }
      });
    }
    console.log("collabs after select", collaborators);
  };

  return (
    <Dialog open={collabDialog} defaultOpen={true}>
      <DialogContent className="max-w-[500px] p-0 mb-3">
        <DialogHeader className="flex flex-row! justify-between p-3 bg-blue-50 rounded-sm">
          <DialogTitle className="text-blue-950 capitalize">Add collaborator</DialogTitle>
          <div
            className="cursor-pointer"
            onClick={() => setCollabDialog(false)}
          >
            <XIcon />
          </div>
        </DialogHeader>
        <div>
          <div className="flex gap-4 w-full h-full p-3">
            <Popover open={collabsOpen} onOpenChange={setCollabsOpen}>
              <PopoverTrigger asChild>
                <div className=" w-full py-5 border border-gray-500 flex justify-between rounded-md px-3"><span>User*</span><ChevronDown/></div>
              </PopoverTrigger>

              <PopoverContent className={cn("p-0 w-[490px]")}>
                <Command className="text-xs">
                  <CommandInput
                    placeholder="Search Here..."
                    className="h-9 text-xs"
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup>
                      {usersData.map((item) => {
                        const isSelected = collaborators.some(
                          (c) => c.user_id === item.id
                        );

                        return (
                          <CommandItem
                            key={item.id}
                            className="text-xs capitalize flex items-center"
                            onSelect={() => handleSelect(item)}
                          >
                            <Check
                              className={cn(
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />

                            {item.first_name.trim() === ""
                              ? item.email
                              : `${item.first_name} ${item.last_name}`}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="w-full h-full flex p-2 ">
          <Button
            type="submit"
            onClick={()=>setCollabDialog(false)}
            className="bg-blue-950  hover:bg-blue-900 font-bold text-lg px-10 py-6"
          >
            Add
          </Button>
          <Button
            type="submit"
            className="font-bold text-lg px-10 py-6"
            variant={"outline"}
            onClick={()=>setCollabDialog(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddCollaborators;
