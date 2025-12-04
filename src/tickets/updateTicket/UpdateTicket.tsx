import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSearch } from "@/components/ui/SelectSearch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Bold,
  ChevronDownIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseTickets } from "../hooks/UseTickets";
import { toast } from "sonner";
import type { TicketDetails } from "../ticketInterfaces/TicketInterfaces";

export interface TicketUpdateFormDataType {
  ticket_status: string;
  ticket_state: string;
  ticket_severity: string;
  summary: string;
  description: string;
  file_attachment: string[];
  comment: string;
  start_date: string | null;
  end_date: string | null;
  assignee_id: string|null;
  reporter_id: string|null;
  update_id?: string;
  merge_status?: boolean;
  parent_ticket_id? : string|number
}

const UpdateTicket = () => {
  const [sdopen, setsdOpen] = useState<boolean>(false);
  const [edopen, setedOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [currentTicketDetails, setCurrentTicketDetails] =
    useState<TicketDetails | null>(null);
  const params = useParams();
  const [keyval, setKeyval] = useState<number>(0);
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
  const [strikethrough, setStrikethrough] = useState<boolean>(false);
  const [numbering, setNumbering] = useState<boolean>(false);
  const [pointing, setPointing] = useState<boolean>(false);
  const [update_id, setUpdate_id] = useState<string>("");
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [tktId, setTktId] = useState<string>("");
  const [previews, setPreviews] = useState<string | null>("");
  const [ticketHistoryData, setTicketHistoryData] = useState({
    ticket_id: "",
    changed_by: "",
    field_name: "",
    old_value: "",
    new_value: "",
  });
  const [formData, setFormData] = useState<TicketUpdateFormDataType>({
    ticket_status: "",
    ticket_state: "",
    ticket_severity: "",
    summary: "",
    description: "",
    file_attachment: [],
    comment: "",
    start_date: null,
    end_date: null,
    assignee_id: "",
    reporter_id: "",
  });
  const { EditTicket, GetTicket,UpdateTicketHistory } = UseTickets();
  const navigate = useNavigate();
  const ticketStatusData = ["Open", "Close", "Pending"];
  const ticketStateData = [
    "ToDo",
    "In Progress",
    "Cancelled",
    "Resolved",
    "On Hold",
    "Re Open",
  ];
  const ticketSeverityData = ["Low", "Medium", "High", "Critical"];
  const assigneeData = ["Charan", "shiva", "Ram", "Hari"];

  useEffect(() => {
    if (!params.id) return;
    const fetchTicket = async () => {
      try {
        const res = await GetTicket(params.id!);
        console.log("res", res);
        setCurrentTicketDetails(res);
        setFormData({
          ticket_status: res.ticket_status,
          ticket_state: res.ticket_state,
          ticket_severity: res.ticket_severity,
          summary: res.summary,
          description: res.description,
          file_attachment: res.file_attachment ?? [""],
          comment: res.comment,
          start_date: res.start_date,
          end_date: res.end_date,
          assignee_id: res.assignee_id,
          reporter_id: res.reporter_id,
          merge_status: false,
        });
        setUpdate_id(String(res.id));
        setTktId(String(res.id));
        setPreviews(String(res.file_attachment_name));
        setTicketHistoryData((prev)=>({...prev,ticket_id : res.id,}))
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchTicket();
  }, [params.id]);
  // console.log("ticketdetails", currentTicketDetails);
  // console.log(formData);

  // function getImageSrc(url: string) {
  //   return url.replace("\\", "/");
  // }

  // console.log(
  //   getImageSrc("D:/algofusion/ticketing_backend/fileFileds\\lion.webp")
  // );

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // console.log(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files
        ? Array.from(files).map((file) => URL.createObjectURL(file))
        : value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement> | FileList
  ) => {
    const files = e instanceof FileList ? e : e.target.files;
    if (!files) return;

    const fileList = Array.from(files);

    setFileObjects((prev) => [...prev, ...fileList]);
    // setFormData((prev)=>({...prev,'file_attach' : fileList}))
  };
  // console.log("fileobjects", fileObjects);

  // console.log("file", formData.file_attachment);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("data", formData);
    const updatedData = {
      ...formData,
      ["update_id"]: update_id,
    };

    

    const res = await EditTicket(updatedData, fileObjects, tktId);
    console.log("res", res);
    if (currentTicketDetails?.ticket_severity !== updatedData.ticket_severity) {
      const updatedTicketHistoryData = {
        ...ticketHistoryData,'old_value': currentTicketDetails?.ticket_severity || "","new_value": updatedData.ticket_severity
      }
      
      console.log('updated',updatedTicketHistoryData)

      const res = await UpdateTicketHistory(updatedTicketHistoryData)
      console.log('res',res)

      console.log("tickete severity chagned");
    }
    if (currentTicketDetails?.ticket_state !== updatedData.ticket_state) {
      const updatedTicketHistoryData = {
        ...ticketHistoryData,'old_value': currentTicketDetails?.ticket_state || "","new_value": updatedData.ticket_state
      }
      console.log('updated',updatedTicketHistoryData)
      const res = await UpdateTicketHistory(updatedTicketHistoryData)
      console.log('res',res)
      console.log("ticketstate is alos changed");
      
    }
    res?.data.message
      ? toast.success(res.data.message)
      : toast.warning(res?.data.error);
    window.dispatchEvent(new Event("ticketsUpdated"));
    navigate("/tickets");

    // await CreateTicket({data:formData,fileStr:formData.file_attachment[0]??""})
    // navigate("/tickets")
  };
  // console.log('formdata', formData)

  // console.log("preview", previews);
  return (
    <div>
      <Dialog
        open
        defaultOpen={true}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) navigate("/tickets"); //  navigate when closed
        }}
      >
        <DialogContent className="h-[95%] min-w-[70%] overflow-y-auto p-2 ">
          <DialogHeader>
            <DialogTitle className="uppercase">Update Ticket </DialogTitle>
            <DialogDescription asChild>
              <div className="w-full h-full">
                <form
                  className="w-full h-full text-black dark:text-white grid gap-5"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full h-full grid grid-cols-4 gap-5 pt-5">
                    <div className=" w-full h-full col-span-3 flex flex-col gap-4 ">
                      <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
                        <div className="w-full h-full flex gap-10">
                          {/* <strong className="">Tickets Details</strong> */}
                          <div className="grid gap-2">
                            <Label>Ticket status</Label>
                            <SelectSearch
                              SelectSearchData={ticketStatusData}
                              title={"Select Status"}
                              size={"md"}
                              value={formData.ticket_status}
                              onChange={handleSelectChange("ticket_status")}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Ticket State</Label>
                            <SelectSearch
                              SelectSearchData={ticketStateData}
                              title={"Select State"}
                              size={"md"}
                              value={formData.ticket_state}
                              onChange={handleSelectChange("ticket_state")}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Ticket Severity</Label>
                            <SelectSearch
                              SelectSearchData={ticketSeverityData}
                              title={"Select Severity"}
                              size={"md"}
                              value={formData.ticket_severity}
                              onChange={handleSelectChange("ticket_severity")}
                            />
                          </div>
                        </div>
                        {/* subject and descr */}
                        <div className=" w-full h-full grid gap-2">
                          <Label htmlFor="summary">Summary(Subject)</Label>
                          <Input
                            id="summary"
                            name="summary"
                            placeholder="Enter Ticket Summary"
                            className="text-sm"
                            value={formData.summary}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="w-full h-full grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Provide Ticket Description"
                            className="h-20 text-sm resize-none"
                            rows={2}
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
                        {/* attachments */}
                        <div className=" w-full h-full grid gap-2">
                          <Label htmlFor="file_attachment">Attachments</Label>

                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleImageChange(e.dataTransfer.files);
                            }}
                            className="border-2 border-dashed p-4 cursor-pointer  rounded hover:bg-gray-50"
                            onClick={() => {
                              document
                                .getElementById("file_attachment")
                                ?.click();
                            }}
                          >
                            <p className="text-center text-sm text-gray-600">
                              Drag & Drop files here
                              <br />
                              or click to browse
                            </p>
                          </div>

                          <Input
                            type="file"
                            hidden
                            id="file_attachment"
                            name="file_attachment"
                            className="text-sm"
                            key={keyval}
                            onChange={handleImageChange}
                          />
                        </div>
                        <div>
                          {/* <>
                          {
                            formData.file_attachment.length > 0 &&
                            formData.file_attachment.some(
                              (path) => path.trim() !== ""
                            ) && ( 
                              <div className="w-[200px] h-[200px] grid gap-2">
                              
                                {formData.file_attachment.map((url, idx) =>
                                  url ? (
                                    <div
                                      className="relative w-full h-full  "
                                      key={idx}
                                    >
                                      <img
                                        src={`http://127.0.0.1:9002/fileFileds/${previews}`}
                                        alt={`Attachment ${idx}`}
                                        className="w-32 h-32 object-cover rounded"
                                      />
                                      <span className="absolute right-20 top-1 z-0 hover:z-10 ">
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="text-red-500 cursor-pointer"
                                          onClick={() =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              file_attachment: [],
                                            }))
                                          }
                                        />
                                      </span>
                                    </div>
                                  ) : null
                                )}}
                               
                                
                                
                                  
                                    
                                 
                                
                              
                           
                        </>  */}
                        </div>

                        <div className="flex gap-3">
                          {fileObjects.length > 0 &&
                            fileObjects.map((file, idx) => {
                              const url = URL.createObjectURL(file);
                              return (
                                <div className="relative w-fit " key={idx}>
                                  <img
                                    src={url}
                                    alt={`Attachment ${idx}`}
                                    className="w-32 h-32 object-cover rounded"
                                  />
                                  <span className="absolute right-0 top-1 z-0 hover:z-10 ">
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="text-red-500 cursor-pointer"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          file_attachment: [],
                                        }));
                                        setFileObjects([]);
                                      }}
                                    />
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
                        {/* comments */}
                        <div className="w-full h-full grid  p-0">
                          <div className="border border-gray-200 rounded">
                            <ToggleGroup type="multiple">
                              <ToggleGroupItem
                                value="bold"
                                aria-label="Toggle bold"
                                onClick={() => setBold(!bold)}
                              >
                                <Bold className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="italic"
                                aria-label="Toggle italic"
                                onClick={() => setItalic(!italic)}
                              >
                                <Italic className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="underline"
                                aria-label="Toggle underline"
                                onClick={() => setUnderline(!underline)}
                              >
                                <Underline className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="strikethrough"
                                aria-label="Toggle strikethrough"
                                onClick={() => setStrikethrough(!strikethrough)}
                              >
                                <Strikethrough className="h-4 w-4" />
                              </ToggleGroupItem>

                              <ToggleGroupItem
                                value="numbering"
                                aria-label="Toggle numbering"
                                onClick={() => setNumbering(!numbering)}
                              >
                                <ListOrdered className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="pointing"
                                aria-label="Toggle pointing"
                                onClick={() => setPointing(!pointing)}
                              >
                                <List className="h-4 w-4" />
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          <div className="border-x border-b border-gray-200 rounded">
                            <Textarea
                              placeholder="Add Comment..."
                              className={cn(
                                "h-20 text-sm resize-none  border-0  outline-0",
                                bold && "font-bold!",
                                italic && "italic",
                                underline && "underline",
                                strikethrough && "line-through"
                              )}
                              rows={1}
                              name="comment_text"
                              value={formData.comment}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-full grid gap-0">
                      <div className="w-full h-full grid gap-0 ">
                        <div className="flex flex-col gap-3">
                          <Label htmlFor="date" className="px-1">
                            Start Date
                          </Label>
                          <Popover onOpenChange={setsdOpen} open={sdopen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-52 justify-between font-normal"
                              >
                                {formData.start_date
                                  ? new Date(
                                      formData?.start_date
                                    ).toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  formData.start_date
                                    ? new Date(formData.start_date)
                                    : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  if (!date) return;
                                  setFormData((prev) => ({
                                    ...prev,
                                    start_date: date.toISOString(),
                                  }));
                                  setsdOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label htmlFor="date" className="px-1">
                            End Date
                          </Label>
                          <Popover onOpenChange={setedOpen} open={edopen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-52 justify-between font-normal"
                              >
                                {formData.end_date
                                  ? new Date(
                                      formData.end_date
                                    ).toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  formData.end_date
                                    ? new Date(formData.end_date)
                                    : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  if (!date) return;
                                  setFormData((prev) => ({
                                    ...prev,
                                    end_date: date.toISOString(),
                                  }));
                                  setedOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label>Assignee</Label>
                          <SelectSearch
                            SelectSearchData={assigneeData}
                            title={"Select Assignee"}
                            size={"md"}
                            value={formData.assignee_id ?? ""}
                            onChange={handleSelectChange("assignee_id")}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reporter_id">Reporter</Label>
                          <Input
                            placeholder="ex: John Doe"
                            className="text-sm w-[90%]"
                            id="reporter_id"
                            name="reporter_id"
                            value={formData.reporter_id?? ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5 w-full h-full">
                    <div className="w-full h-full"></div>
                    <div className="w-full h-full grid grid-cols-2">
                      <div className="w-full h-full">
                        <span
                          className="cursor-pointer px-5 w-[70%] hover:bg-gray-50 uppercase font-bold inline-flex items-center justify-center rounded-md border border-input  py-2 text-sm transition-colorshover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
                          onClick={() => {
                            navigate("/tickets");
                          }}
                        >
                          close
                        </span>
                      </div>
                      <div className="w-full h-full">
                        <Button
                          className=" font-bold w-[70%]  uppercase"
                          variant={"outline"}
                        >
                          Update Ticket
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UpdateTicket;

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogOverlay,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { SelectSearch } from "@/components/ui/SelectSearch";
// import { Textarea } from "@/components/ui/textarea";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { cn } from "@/lib/utils";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   Bold,
//   ChevronDownIcon,
//   Italic,
//   List,
//   ListOrdered,
//   Strikethrough,
//   Underline,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { UseTickets } from "../hooks/UseTickets";
// import { toast } from "sonner";

// export interface TicketFormDataType {
//   ticket_status: string;
//   ticket_state: string;
//   ticket_severity: string;
//   summary: string;
//   description: string;
//   file_attachment: string[];
//   comment_text: string;
//   start_date: string | null;
//   end_date: string | null;
//   assignee: string;
//   created_by: string;
//   update_id?: string;
// }

// const UpdateTicket = () => {
//   const [open, setOpen] = useState<Boolean>(false);
//   const params = useParams();
//   const [keyval, setKeyval] = useState<number>(0);
//   const [bold, setBold] = useState<boolean>(false);
//   const [italic, setItalic] = useState<boolean>(false);
//   const [underline, setUnderline] = useState<boolean>(false);
//   const [strikethrough, setStrikethrough] = useState<boolean>(false);
//   const [numbering, setNumbering] = useState<boolean>(false);
//   const [pointing, setPointing] = useState<boolean>(false);
//   const [update_id, setUpdate_id] = useState<string>("");
//   const [fileObjects, setFileObjects] = useState<File[]>([]);
//   const [tktId, setTktId] = useState<string>("");
//   // Separate state for existing images (from server) and new images (blob URLs)
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

//   const [formData, setFormData] = useState<TicketFormDataType>({
//     ticket_status: "",
//     ticket_state: "",
//     ticket_severity: "",
//     summary: "",
//     description: "",
//     file_attachment: [],
//     comment_text: "",
//     start_date: null,
//     end_date: null,
//     assignee: "",
//     created_by: "",
//   });
//   const { CreateTicket, EditTicket, GetTicket } = UseTickets();
//   const navigate = useNavigate();
//   const ticketStatusData = [
//     { label: "Open", value: "Open" },
//     { label: "Close", value: "Close" },
//     { label: "Pending", value: "Pending" },
//   ];
//   const ticketStateData = [
//     { label: "ToDo", value: "ToDo" },
//     { label: "InProgress", value: "InProgress" },
//     { label: "Cancelled", value: "Cancelled" },
//     { label: "Resolved", value: "Resolved" },
//     { label: "OnHold", value: "OnHold" },
//   ];
//   const ticketSeverityData = [
//     { label: "Low", value: "Low" },
//     { label: "Medium", value: "Medium" },
//     { label: "High", value: "High" },
//     { label: "Critical", value: "Critical" },
//   ];

//   // Helper function to get image URL for display
//   const getImageUrl = (path: string) => {
//     // If it's already a blob URL, return as is
//     if (path.startsWith('blob:')) {
//       return path;
//     }

//     // Extract filename from the full path
//     const filename = path.split(/[/\\]/).pop();

//     return `http://localhost:8000/uploads/${filename}`;
//   };

//   useEffect(() => {
//     if (!params.id) return;
//     const fetchTicket = async () => {
//       try {
//         const res = await GetTicket(params.id!);
//         console.log("res", res);
//         setFormData({
//           ticket_status: res.ticket_status,
//           ticket_state: res.ticket_state,
//           ticket_severity: res.ticket_severity,
//           summary: res.summary,
//           description: res.description,
//           file_attachment: res.file_attachment ?? [""],
//           comment_text: res.comment_text,
//           start_date: res.start_date,
//           end_date: res.end_date,
//           assignee: res.assignee,
//           created_by: res.created_by,
//         });
//         // Store existing images separately
//         setExistingImages(res.file_attachment ?? []);
//         setUpdate_id(String(res.id));
//         setTktId(String(res.ticket_id));
//       } catch (err) {
//         console.log("err", err);
//       }
//     };
//     fetchTicket();
//   }, [params.id]);

//   const handleSelectChange = (name: string) => (value: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target as HTMLInputElement;

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const fileList = Array.from(files);

//     // Create blob URLs for preview
//     const newPreviews = fileList.map((file) => URL.createObjectURL(file));

//     setFileObjects((prev) => [...prev, ...fileList]);
//     setNewImagePreviews((prev) => [...prev, ...newPreviews]);
//   };

//   const handleRemoveExistingImage = (index: number) => {
//     setExistingImages((prev) => prev.filter((_, i) => i !== index));
//     setFormData((prev) => ({
//       ...prev,
//       file_attachment: prev.file_attachment.filter((_, i) => i !== index),
//     }));
//   };

//   const handleRemoveNewImage = (index: number) => {
//     // Revoke the blob URL to free memory
//     URL.revokeObjectURL(newImagePreviews[index]);

//     setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     setFileObjects((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log("data", formData);
//     const updatedData = {
//       ...formData,
//       ["update_id"]: update_id,
//       // Send the remaining existing images
//       file_attachment: existingImages,
//     };

//     const res = await EditTicket(updatedData, fileObjects, tktId);
//     res?.status === 200
//       ? toast.success(res.data.message || "Ticket Updated Successfully!")
//       : toast.warning("Not Updated!");
//     window.dispatchEvent(new Event("ticketsUpdated"));
//     navigate("/tickets");
//   };

//   return (
//     <div>
//       <Dialog
//         open
//         defaultOpen={true}
//         onOpenChange={(value) => {
//           setOpen(value);
//           if (!value) navigate("/tickets");
//         }}
//       >
//         <DialogContent className="h-[95%] min-w-[80%] overflow-y-auto  ">
//           <DialogHeader>
//             <DialogTitle>Update Ticket </DialogTitle>
//             <DialogDescription asChild>
//               <div className="w-full h-full">
//                 <form
//                   className="w-full h-full text-black dark:text-white grid gap-10"
//                   onSubmit={handleSubmit}
//                 >
//                   <div className="w-full h-full grid grid-cols-4 gap-5 pt-5">
//                     <div className=" w-full h-full col-span-3 flex flex-col gap-4 ">
//                       <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
//                         <div className="w-full h-full flex gap-10">
//                           <div className="grid gap-2">
//                             <Label>Ticket status</Label>
//                             <SelectSearch
//                               SelectSearchData={ticketStatusData}
//                               title={"Select Status"}
//                               size={"md"}
//                               value={formData.ticket_status}
//                               onChange={handleSelectChange("ticket_status")}
//                             />
//                           </div>
//                           <div className="grid gap-2">
//                             <Label>Ticket State</Label>
//                             <SelectSearch
//                               SelectSearchData={ticketStateData}
//                               title={"Select State"}
//                               size={"md"}
//                               value={formData.ticket_state}
//                               onChange={handleSelectChange("ticket_state")}
//                             />
//                           </div>
//                           <div className="grid gap-2">
//                             <Label>Ticket Severity</Label>
//                             <SelectSearch
//                               SelectSearchData={ticketSeverityData}
//                               title={"Select Severity"}
//                               size={"md"}
//                               value={formData.ticket_severity}
//                               onChange={handleSelectChange("ticket_severity")}
//                             />
//                           </div>
//                         </div>
//                         <div className=" w-full h-full grid gap-2">
//                           <Label htmlFor="summary">Summary(Subject)</Label>
//                           <Input
//                             id="summary"
//                             name="summary"
//                             placeholder="Enter Ticket Summary"
//                             className="text-sm"
//                             value={formData.summary}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div className="w-full h-full grid gap-2">
//                           <Label htmlFor="description">Description</Label>
//                           <Textarea
//                             id="description"
//                             name="description"
//                             placeholder="Provide Ticket Description"
//                             className="h-16 text-sm resize-none"
//                             rows={2}
//                             value={formData.description}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                       </div>
//                       <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
//                         <div className=" w-full h-full grid gap-2">
//                           <Label htmlFor="file_attachment">Attachments</Label>
//                           <Input
//                             type="file"
//                             id="file_attachment"
//                             name="file_attachment"
//                             className="text-sm"
//                             key={keyval}
//                             multiple
//                             onChange={handleImageChange}
//                           />
//                         </div>

//                         {/* Display existing images from server */}
//                         {existingImages.length > 0 && existingImages.some((path) => path.trim() !== "") && (
//                           <div className="w-full">
//                             <Label className="mb-2 block">Existing Attachments</Label>
//                             <div className="flex flex-wrap gap-4">
//                               {existingImages.map((url, idx) =>
//                                 url ? (
//                                   <div
//                                     className="relative w-32 h-32"
//                                     key={`existing-${idx}`}
//                                   >
//                                     <img
//                                       src={getImageUrl(url)}
//                                       alt={`Existing Attachment ${idx}`}
//                                       className="w-full h-full object-cover rounded border"
//                                       onError={(e) => {
//                                         // Fallback if image fails to load
//                                         e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">No Image</text></svg>';
//                                       }}
//                                     />
//                                     <button
//                                       type="button"
//                                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//                                       onClick={() => handleRemoveExistingImage(idx)}
//                                     >
//                                       <FontAwesomeIcon icon={faTrash} className="text-xs" />
//                                     </button>
//                                   </div>
//                                 ) : null
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Display newly added images */}
//                         {newImagePreviews.length > 0 && (
//                           <div className="w-full">
//                             <Label className="mb-2 block">New Attachments</Label>
//                             <div className="flex flex-wrap gap-4">
//                               {newImagePreviews.map((url, idx) => (
//                                 <div
//                                   className="relative w-32 h-32"
//                                   key={`new-${idx}`}
//                                 >
//                                   <img
//                                     src={url}
//                                     alt={`New Attachment ${idx}`}
//                                     className="w-full h-full object-cover rounded border"
//                                   />
//                                   <button
//                                     type="button"
//                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//                                     onClick={() => handleRemoveNewImage(idx)}
//                                   >
//                                     <FontAwesomeIcon icon={faTrash} className="text-xs" />
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <div className=" w-full h-full col-span-2 flex flex-col gap-4 ">
//                         <div className="w-full h-full grid  p-0">
//                           <div className="border-1 border-gray-200 rounded">
//                             <ToggleGroup type="multiple">
//                               <ToggleGroupItem
//                                 value="bold"
//                                 aria-label="Toggle bold"
//                                 onClick={() => setBold(!bold)}
//                               >
//                                 <Bold className="h-4 w-4" />
//                               </ToggleGroupItem>
//                               <ToggleGroupItem
//                                 value="italic"
//                                 aria-label="Toggle italic"
//                                 onClick={() => setItalic(!italic)}
//                               >
//                                 <Italic className="h-4 w-4" />
//                               </ToggleGroupItem>
//                               <ToggleGroupItem
//                                 value="underline"
//                                 aria-label="Toggle underline"
//                                 onClick={() => setUnderline(!underline)}
//                               >
//                                 <Underline className="h-4 w-4" />
//                               </ToggleGroupItem>
//                               <ToggleGroupItem
//                                 value="strikethrough"
//                                 aria-label="Toggle strikethrough"
//                                 onClick={() => setStrikethrough(!strikethrough)}
//                               >
//                                 <Strikethrough className="h-4 w-4" />
//                               </ToggleGroupItem>
//                               <ToggleGroupItem
//                                 value="numbering"
//                                 aria-label="Toggle numbering"
//                                 onClick={() => setNumbering(!numbering)}
//                               >
//                                 <ListOrdered className="h-4 w-4" />
//                               </ToggleGroupItem>
//                               <ToggleGroupItem
//                                 value="pointing"
//                                 aria-label="Toggle pointing"
//                                 onClick={() => setPointing(!pointing)}
//                               >
//                                 <List className="h-4 w-4" />
//                               </ToggleGroupItem>
//                             </ToggleGroup>
//                           </div>
//                           <div className="border-x-1 border-b-1 border-gray-200 rounded">
//                             <Textarea
//                               placeholder="Add Comment..."
//                               className={cn(
//                                 "h-10 text-sm resize-none  border-0  outline-0",
//                                 bold && "font-bold!",
//                                 italic && "italic",
//                                 underline && "underline",
//                                 strikethrough && "line-through"
//                               )}
//                               rows={1}
//                               name="comment_text"
//                               value={formData.comment_text}
//                               onChange={handleInputChange}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="w-full h-full grid gap-0">
//                       <div className="w-full h-full grid gap-0 ">
//                         <div className="flex flex-col gap-3">
//                           <Label htmlFor="date" className="px-1">
//                             Start Date
//                           </Label>
//                           <Popover onOpenChange={setOpen}>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 id="date"
//                                 className="w-48 justify-between font-normal"
//                               >
//                                 {formData.start_date
//                                   ? new Date(
//                                       formData?.start_date
//                                     ).toLocaleDateString()
//                                   : "Select date"}
//                                 <ChevronDownIcon />
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent
//                               className="w-auto overflow-hidden p-0"
//                               align="start"
//                             >
//                               <Calendar
//                                 mode="single"
//                                 selected={
//                                   formData.start_date
//                                     ? new Date(formData.start_date)
//                                     : undefined
//                                 }
//                                 captionLayout="dropdown"
//                                 onSelect={(date) => {
//                                   if (!date) return;
//                                   setFormData((prev) => ({
//                                     ...prev,
//                                     start_date: date.toISOString(),
//                                   }));
//                                 }}
//                               />
//                             </PopoverContent>
//                           </Popover>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                           <Label htmlFor="date" className="px-1">
//                             End Date
//                           </Label>
//                           <Popover onOpenChange={setOpen}>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 id="date"
//                                 className="w-48 justify-between font-normal"
//                               >
//                                 {formData.end_date
//                                   ? new Date(
//                                       formData.end_date
//                                     ).toLocaleDateString()
//                                   : "Select date"}
//                                 <ChevronDownIcon />
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent
//                               className="w-auto overflow-hidden p-0"
//                               align="start"
//                             >
//                               <Calendar
//                                 mode="single"
//                                 selected={
//                                   formData.end_date
//                                     ? new Date(formData.end_date)
//                                     : undefined
//                                 }
//                                 captionLayout="dropdown"
//                                 onSelect={(date) => {
//                                   if (!date) return;
//                                   setFormData((prev) => ({
//                                     ...prev,
//                                     end_date: date.toISOString(),
//                                   }));
//                                 }}
//                               />
//                             </PopoverContent>
//                           </Popover>
//                         </div>
//                         <div className="grid gap-2">
//                           <Label>Assignee</Label>
//                           <SelectSearch
//                             SelectSearchData={ticketStatusData}
//                             title={"Select Assignee"}
//                             size={"md"}
//                             value={formData.assignee}
//                             onChange={handleSelectChange("assignee")}
//                           />
//                         </div>
//                         <div className="grid gap-2">
//                           <Label htmlFor="created_by">Created by</Label>
//                           <Input
//                             placeholder="ex: John Doe"
//                             className="text-sm w-[85%]"
//                             id="created_by"
//                             name="created_by"
//                             value={formData.created_by}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-5 w-full h-full">
//                     <div className="w-full h-full"></div>
//                     <div className="w-full h-full grid grid-cols-2">
//                       <div className="w-full h-full">
//                         <span
//                           className="cursor-pointer px-5 w-[70%] hover:bg-gray-50 uppercase font-bold inline-flex items-center justify-center rounded-md border border-input  py-2 text-sm transition-colorshover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
//                           onClick={() => {
//                             navigate("/tickets");
//                           }}
//                         >
//                           close
//                         </span>
//                       </div>
//                       <div className="w-full h-full">
//                         <Button
//                           className=" font-bold w-[70%]  uppercase"
//                           variant={"outline"}
//                         >
//                           Update Ticket
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };
// export default UpdateTicket;
