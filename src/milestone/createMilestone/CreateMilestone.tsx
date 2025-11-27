import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { faCalendar, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Calendar as CalendarIcon,
  ChevronDownIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline as UnderlineTag,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function CreateMilestone() {
  const [open, setOpen] = useState<boolean>(true);
  const [sdopen, setsdOpen] = useState<boolean>(false);
  const [edopen, setedOpen] = useState<boolean>(false);
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
  const [strikethrough, setStrikethrough] = useState<boolean>(false);
  const [numbering, setNumbering] = useState<boolean>(false);
  const [pointing, setPointing] = useState<boolean>(false);

  const [milestoneData, setMilestoneData] = useState({
    milestone_name: "",
    // milestone_description: "",
    start_date: "",
    end_date: "",
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
  });

  function handleMilestoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    let descText = editor.getHTML();
    const data = { ...milestoneData, milestone_description: descText };

    console.log(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[40%] h-[70vh] p-0  ">
        <DialogHeader className="w-full flex flex-row! items-center justify-between bg-blue-100 p-1 rounded-t-md  ">
          <DialogTitle className="px-3">Create Milestone</DialogTitle>
          <DialogDescription>{""}</DialogDescription>

          <NavLink
            to={"/"}
            className="float-right p-1 cursor-pointer mx-1 bg-gray-300 rounded-full "
          >
            <X />
          </NavLink>
        </DialogHeader>
        <form
          className=" p-4 pb-0 overflow-y-auto "
          onSubmit={handleMilestoneSubmit}
        >
          <div className="flex flex-col gap-2 w-full">
            <div className="grid gap-3 w-full">
              <Label htmlFor="mname" className="flex gap-0">
                Milestone Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mname"
                name="name"
                className="w-full"
                required
                value={milestoneData.milestone_name}
                onChange={(e) =>
                  setMilestoneData((prev) => ({
                    ...prev,
                    milestone_name: e.target.value,
                  }))
                }
              />
            </div>
            <>
              {/* <div className=" w-full h-full col-span-2 flex flex-col gap-2 ">
              
              <Label htmlFor="description" className="flex gap-0">Description <span className="text-red-500">*</span></Label>

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
                      <UnderlineTag className="h-4 w-4" />
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
                    required
                    className={cn(
                      "h-32 text-sm resize-none border-0  outline-0",
                      bold && "font-bold!",
                      italic && "italic",
                      underline && "underline",
                      strikethrough && "line-through"
                    )}
                    rows={4}
                    name="comment_text"
                    value={milestoneData.milestone_description}
                    onChange={(e) =>
                      setMilestoneData((prev) => ({
                        ...prev,
                        milestone_description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div> */}
            </>

            <div className="flex flex-col box-border ">
              <ToggleGroup
                type="single"
                className="flex gap-2 border-t-2 border-x-2 rounded w-full"
              >
                {/* Bold */}
                <ToggleGroupItem
                  value="bold"
                  className={`p-2 rounded cursor-pointer ${
                    editor.isActive("bold") ? "bg-gray-100 text-black" : ""
                  }`}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>

                {/* Italic */}
                <ToggleGroupItem
                  value="italic"
                  className={`p-2 rounded cursor-pointer ${
                    editor.isActive("italic") ? "bg-gray-100 text-black" : ""
                  }`}
                  onClick={() => 
                    editor?.chain().focus().toggleItalic().run()
                   
                  }
                >
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>

                {/* Underline */}
                <ToggleGroupItem
                  value="underline"
                  className={`p-2 rounded cursor-pointer ${
                    editor.isActive("underline") ? "bg-gray-100 text-black" : ""
                  }`}
                  onClick={() => 
                    editor?.chain().focus().toggleUnderline().run()
                   
                  }
                >
                  <UnderlineTag className="h-4 w-4" />
                </ToggleGroupItem>

                {/* Ordered List */}
                <ToggleGroupItem
                  value="listOrdered"
                  className={`p-2 rounded cursor-pointer ${
                    editor?.isActive("orderedList")
                      ? "bg-gray-100 text-black"
                      : ""
                  }`}
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                >
                  <ListOrdered className="h-4 w-4" />
                </ToggleGroupItem>

                {/* Bullet List */}
                <ToggleGroupItem
                  value="list"
                  className={`p-2 rounded cursor-pointer ${
                    editor?.isActive("bulletList")
                      ? "bg-gray-100 text-black"
                      : ""
                  }`}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                >
                  <List className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="strikeThrough"
                  
                  className={`p-2 rounded cursor-pointer ${
                    editor?.isActive("strike")
                      ? "bg-gray-100 text-black"
                      : ""
                  }`}
                  onClick={()=>editor?.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <EditorContent
                editor={editor}
                className={cn(
                  `tiptap-editor
                  border-2 rounded-md
                  [&_p]:m-0 [&_p]:p-2 [&_p]:min-h-28
                  [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-disc [&_ul]:pl-4
                  [&_ol]:m-0 [&_ol]:p-0 [&_ol]:list-decimal [&_ol]:pl-4
                  [&_li]:m-0 [&_li]:p-0`
                )}
              />
            </div>

            <div className="flex  justify-between gap-5 w-full">
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="date" className="px-1">
                  Start Date
                </Label>
                <Popover onOpenChange={setsdOpen} open={sdopen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal cursor-pointer"
                    >
                      {milestoneData.start_date
                        ? new Date(
                            milestoneData?.start_date
                          ).toLocaleDateString()
                        : "Select date"}

                      <div className="flex">
                        <CalendarIcon />
                        <ChevronDownIcon />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={
                        milestoneData.start_date
                          ? new Date(milestoneData.start_date)
                          : undefined
                      }
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (!date) return;
                        setMilestoneData((prev) => ({
                          ...prev,
                          start_date: date.toISOString(),
                        }));
                        setsdOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="edate" className="px-1">
                  Target Date
                </Label>
                <Popover onOpenChange={setedOpen} open={edopen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="edate"
                      className=" justify-between font-normal w-full cursor-pointer"
                    >
                      {milestoneData.end_date
                        ? new Date(milestoneData.end_date).toLocaleDateString()
                        : "Select date"}
                      <div className="flex">
                        <CalendarIcon />
                        <ChevronDownIcon />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={
                        milestoneData.end_date
                          ? new Date(milestoneData.end_date)
                          : undefined
                      }
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (!date) return;
                        setMilestoneData((prev) => ({
                          ...prev,
                          end_date: date.toISOString(),
                        }));
                        setedOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter className="py-2">
            <Button
              type="submit"
              className="bg-blue-950 text-white font-bold hover:bg-blue-950"
            >
              Create Milestone
            </Button>
            <DialogClose asChild>
              <NavLink to={"/"}>
                <Button variant="outline">Cancel</Button>
              </NavLink>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
