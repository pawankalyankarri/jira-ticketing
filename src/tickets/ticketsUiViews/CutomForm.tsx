import { useState, useEffect } from "react";
import type { ITask } from "@svar-ui/react-gantt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Calendar22 } from "@/components/ui/calendar22";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface TaskTypeOption {
  id: string;
  label: string;
}

export interface FormEvent {
  action: "update-task" | "delete-task" | "close-form" | "add-task";
  data: ITask | null;
}

export interface FormProps {
  task: ITask;
  taskTypes: TaskTypeOption[];
  taskState : string[]
  onAction: (event: FormEvent) => void;
}

export function Form({ task, taskTypes, onAction,taskState }: FormProps) {
  const [localTask, setLocalTask] = useState<ITask>(task);

  useEffect(() => {
    setLocalTask(task);
    console.log("localtask", task);
  }, [task]);
  console.log('local',localTask)

  if (!localTask) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-105 bg-gray-50 p-5 border-l border-gray-200 shadow-lg overflow-y-auto z-50 box-border">
      <div className="flex justify-between pb-2">
        <button
          onClick={() => onAction({ action: "close-form", data: null })}
          className="px-2 py-0.5  text-white rounded-md bg-gray-400 cursor-pointer font-bold"
        >
          <XIcon size={"18"} />
        </button>

        <button
          onClick={() => onAction({ action: "delete-task", data: localTask })}
          className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-400 font-bold shadow  cursor-pointer"
        >
          Delete
        </button>
      </div>

      {/* Task Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Task Name</label>
        <input
          type="text"
          value={localTask.text}
          onChange={(e) => setLocalTask({ ...localTask, text: e.target.value })}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <Label htmlFor="start-date" className="block mb-1 font-medium">
          Start Date
        </Label>
        <Calendar22
          date={localTask.start}
          onChange={(date: Date) => setLocalTask({ ...localTask, start: date })}
        />
      </div>

      {/* End Date */}

      <div className="mb-4 w-full">
        <Label htmlFor="start-date" className="block mb-1 font-medium">
          End Date
        </Label>
        <Calendar22
          date={localTask.end}
          onChange={(date: Date) => setLocalTask({ ...localTask, end: date })}
        />
      </div>

      {/* Task Type */}
      <div className="mb-4">
        <Label className="block mb-1 font-medium">Task Type</Label>
        <Select
          value={localTask.type}
          onValueChange={(value: string) =>
            setLocalTask({ ...localTask, type: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            {taskTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div className="mb-4">
        <Label className="block mb-1 font-medium">Task State</Label>
        <Select
          value={localTask.state}
          onValueChange={(value: string) =>
            setLocalTask({ ...localTask, state: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select task State" />
          </SelectTrigger>
          <SelectContent>
            {taskState.map((t,idx) => (
              <SelectItem key={idx} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Progress */}

      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Progress ({localTask.progress || 0}%)
        </label>
        <Slider
          value={[localTask.progress || 0]}
          onValueChange={(val: number[]) =>
            setLocalTask({ ...localTask, progress: val[0] })
          }
          min={0}
          max={100}
          className="cursor-pointer"
        />
      </div>

      {/* Details */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Details</label>
        <Textarea
          value={localTask.details}
          onChange={(e) =>{
            setLocalTask({ ...localTask, details: e.target.value })
            console.log(e.target.value)}
          }
          rows={6}
          cols={6}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none h-32 "
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end">
        <button
          // onClick={() => onAction({ action: "update-task", data: localTask })}
          onClick={() =>
            onAction({
              action:
      typeof localTask.id === "string" && localTask.id.startsWith("temp://")
        ? "add-task"
        : "update-task",
              data: localTask,
            })
          }
          className="px-4 py-2 bg-green-400 text-white font-bold rounded-md cursor-pointer hover:bg-green-400"
        >
          Save
        </button>

        {/* <button
          onClick={() => onAction({ action: "delete-task", data: localTask })}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>

        <button
          onClick={() => onAction({ action: "close-form", data: null })}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Close
        </button> */}
      </div>
    </div>
  );
}
