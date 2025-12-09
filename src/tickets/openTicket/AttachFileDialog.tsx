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
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { XIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { UseTickets } from "../hooks/UseTickets";

interface AttachFileDialogProps {
  attachDialog: boolean;
  setAttachDialog: Dispatch<SetStateAction<boolean>>;
  ticket_id:Number
}

export function AttachFileDialog({
  attachDialog,
  setAttachDialog,
  ticket_id
}: AttachFileDialogProps) {
  const [files, setfiles] = useState<File>();


  const {AttachFile} = UseTickets()

  const handleSubmitAttachment = async(e:React.FormEvent) => {
    e.preventDefault()
    console.log(files)
    if(files){
        const res = await AttachFile({ticket_id,files})
        console.log('res',res)

    }
  }

  return (
    <Dialog open={attachDialog} defaultOpen={true}>
     
        <DialogContent className="sm:max-w-[500px] p-0 mb-3">
          <DialogHeader className="flex flex-row! justify-between p-3 bg-blue-50 rounded-sm">
            <DialogTitle className="text-blue-950">AttachFile</DialogTitle>
            <div
              className="cursor-pointer"
              onClick={() => setAttachDialog(false)}
            >
              <XIcon />
            </div>
          </DialogHeader>
           <form onSubmit={handleSubmitAttachment} className="w-full h-full mb-5 ">
          <div>
            <div className="flex gap-4 w-full h-full p-3">
              <Input className="w-full h-14 border-gray-500 text-xl" placeholder="Name" />
              <div className=" w-full h-full grid gap-2">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                  }}
                  className="border-2  cursor-pointer border-gray-400  rounded-md hover:bg-gray-50 flex justify-center items-center"
                  onClick={() => {
                    document.getElementById("file_attachment")?.click();
                  }}
                >
                  <div className=" text-blue-950 capitalize font-bold flex gap-1 h-14 items-center">
                   {files? files.name : (
                     <div><FontAwesomeIcon icon={faCloudArrowUp} />
                    <span> Upload file </span></div>
                   )}
                  </div>
                </div>

                <Input
                  type="file"
                  hidden
                  id="file_attachment"
                  name="file_attachment"
                  className="text-sm"
                  onChange={(e) => e.target.files ? setfiles(e.target.files[0]):""}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="w-full ">
            <Button type="submit" disabled={!files}  className=" bg-gray-400 w-[30%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed! mx-3 h-14 font-bold text-xl hover:bg-gray-400">Save</Button>
          </DialogFooter>
           </form>
        </DialogContent>
     
    </Dialog>
  );
}
