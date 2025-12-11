import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  TicketCollaboratorsDataType,
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

interface AddCollaboratorsProps {
  collabDialog: boolean;
  setCollabDialog: Dispatch<SetStateAction<boolean>>;
  collaborators: TicketCollaboratorsDataType[];
  setCollaborators: Dispatch<SetStateAction<TicketCollaboratorsDataType[]>>;
  usersData: UsersDataType[];
}

const AddCollaborators = ({
  collabDialog,
  setCollabDialog,
  setCollaborators,
  collaborators,
  usersData,
}: AddCollaboratorsProps) => {
  const [collabsOpen, setCollabsOpen] = useState<boolean>(false);
  return (
    <Dialog open={collabDialog} defaultOpen={true}>
      <DialogContent className="max-w-[500px] p-0 mb-3">
        <DialogHeader className="flex flex-row! justify-between p-3 bg-blue-50 rounded-sm">
          <DialogTitle className="text-blue-950">Add collaborator</DialogTitle>
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

              <PopoverContent className={cn("p-0 w-full")}>
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
                            // onSelect={() => handleSelect(item)}
                          >
                            <Check
                              className={cn(
                                "mr-2",
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
            className="bg-blue-950  hover:bg-blue-900 font-bold text-lg px-10 py-6"
          >
            Add
          </Button>
          <Button
            type="submit"
            className="font-bold text-lg px-10 py-6"
            variant={"outline"}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddCollaborators;
