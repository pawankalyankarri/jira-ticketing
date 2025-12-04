// import { TicketsStore } from "@/Zustand/TicketsStore";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { TicketFormDataType } from "../ticketCreate/TicketCreate";
import type { TicketUpdateFormDataType } from "../updateTicket/UpdateTicket";
import type { TicketHistoryUpdateType } from "../ticketInterfaces/TicketInterfaces";

interface UpdateTicketStatusProps {
  ticket_id: string;
  ticket_state: string;
}

export type TicketType = {
  assignee_id: string;
  board_id: string;
  due_date: any;
  estimated_hours: any;
  milestone_id: string;
  parent_ticket_id: string;
  project_id: string;
  status_id: string;
  total_hours_spent: any;
  workflow_id: string;
  comment_attachment_path: string;
  comment_id: string;
  comment: string;
  created_at: string;
  reporter_id: string;
  description: string;
  end_date: string;
  entity_id: string | null;
  file_attachment: string[];
  file_attachment_id: string;
  file_attachment_name: string;
  id: string;
  merge_history: any | null;
  merge_status: boolean;
  start_date: string;
  summary: string;
  ticket_history: TicketHistory[];
  ticket_id: string;
  ticket_name: string;
  ticket_severity: string;
  ticket_state: string;
  ticket_status: string;
  updated_at: string;
};

export type TicketHistory = {
  action?: string;
  updated_by?: string;
  updated_at?: string;
  [key: string]: any;
};

interface CreateTicketDataProps {
  data: TicketFormDataType;
  fileStr: File[];
}
interface CreateTicketCommentType {
  ticket_id: number;
  commented_by: number;
  comment_text: string;
  attachment_path: string;
}
interface EditTicketCommentType {
  comment_id: number,
  commented_by: number,
  comment_text: string,
  attachment_path:string ,
  edited: boolean
}

interface TicketCollaboratorsType {
  ticket_id: string;
  user_id: string[];
}

export const UseTickets = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // const { setTickets, setLoading, setError } = TicketsStore();
  const mountRef = useRef<boolean>(false);

  const fetchAllTickets = useCallback(async () => {
    // if(mountRef.current)return
    setLoading(true);
    try {
      const res = await axios.get("/api/ticketing");
      console.log(res);
      if (res.status === 200) {
        setTickets(res.data.data);
        return res.data.data;
      }
    } catch (err: any) {
      setError(err?.message || "fetchalltickets error");
      console.log("err in fetchallTickets", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTicket = useCallback(async (ticketStrId: string) => {
    try {
      const response = await axios.post("/api/ticketing/delete-ticket", {
        delete_id: ticketStrId,
      });
      console.log("delete", response);
      // fetchAllTickets();
      toast.error(response.data.message || "Ticket deleted succefully!");
    } catch (err) {
      console.log("err deleteTicket", err);
    }
  }, []);

  const UpdateTicketStatus = useCallback(
    async (data: TicketUpdateFormDataType) => {
      console.log("data", data);
      setLoading(true);
      try {
        data.file_attachment.length === 0 ? data.file_attachment.push("") : "";
        const response = await axios.post("/api/ticketing/update-ticket", data);
        console.log("edittkt", response);

        return response;
      } catch (err) {
        console.log("edittkt", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllTickets]
  );

  // const CreateTicket = useCallback(
  //   async ({ data, fileStr }: CreateTicketDataProps) => {
  //     setLoading(true);
  //     console.log(data,fileStr)
  //     try {
  //       const response = await axios.post(
  //         "/api/ticketing/create-ticket",
  //         data,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       console.log("resp", response.data);
  //       const tktId = response.data.Ticket.ticket_id;
  //       const res = await axios.post(
  //         "/api/ticketing/attach-file",
  //         {
  //           ticket_id: tktId,
  //           file_path: fileStr,
  //         },
  //         {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         }
  //       );
  //       console.log("res", res);
  //       toast.success(response.data.Message || "Ticket Created successfully!");
  //       await fetchAllTickets();
  //       return res
  //     } catch (error) {
  //       console.error("Error creating ticket:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [fetchAllTickets]
  // );

  const CreateTicket = useCallback(
    async ({ data, files }: { data: any; files: File[] }) => {
      setLoading(true);
      console.log("data,files", data, files);
      // console.log(files[0]);

      try {
        //  Create Ticket (JSON)
        const response = await axios.post(
          "/api/ticketing/create-ticket",
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("response", response);
        const tktId = response.data.id;
        console.log("tktid", tktId);

        // console.log("filefiled", files);

        //attach file calling
        const res = await axios.post(
          "/api/ticketing/attach-file",
          { ticket_id: tktId, uploadfile: files[0] },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // ticket histroy is calling

        const ticket_history_res = await axios.post(
          "/api/ticket-history/create-history ",
          {
            ticket_id: tktId,
            changed_by: "",
            field_name: "",
            old_value: "",
            new_value: data.ticket_state,
          }
        );
        console.log("tkthistoryres", ticket_history_res);

        console.log("fileres", res);
        toast.success("Ticket created successfully");
        await fetchAllTickets();

        return response;
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllTickets]
  );

  const EditTicket = useCallback(
    async (
      data: TicketUpdateFormDataType,
      fileObject: File[],
      tktId: string
    ) => {
      console.log("data from usetickets", data);
      setLoading(true);
      try {
        data.file_attachment.length === 0 ? data.file_attachment.push("") : "";
        const response = await axios.post("/api/ticketing/update-ticket", data);
        console.log("edittkt", response);
        // await fetchAllTickets()

        console.log("data from usetickets", data);
        console.log("tktid", tktId, fileObject);
        if (fileObject.length !== 0) {
          const res = await axios.post(
            "/api/ticketing/attach-file",
            { ticket_id: tktId, uploadfile: fileObject[0] },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          console.log("fileres", res);
        }
        return response;
      } catch (err) {
        console.log("edittkt", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllTickets]
  );

  const GetTicket = useCallback(
    async (tktId: string) => {
      if (mountRef.current) return;
      mountRef.current = true;
      setLoading(true);
      try {
        const response = await axios.get(`/api/ticketing/${tktId}`);
        console.log("getticket", response);
        return response.data;
      } catch (err) {
        console.log("getticket", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllTickets]
  );

  const UpdateTicketHistory = useCallback(
    async (updatedTicketHistoryData: TicketHistoryUpdateType) => {
      try {
        const response = await axios.post(
          "/api/ticket-history/create-history",
          updatedTicketHistoryData
        );
        if (response.data.status) {
          return response.data.message;
        } else {
          return response;
        }
      } catch (err) {
        console.log("updateTicketHistory in", err);
      }
    },
    []
  );

  const GetTicketHistory = useCallback(async (data: { ticket_id: string }) => {
    try {
      const res = await axios.post("/api/ticket-history/get-ticket-id", data);
      // console.log(res)
      return res.data;
    } catch (err) {
      console.log("GetTicketHistroy", err);
    }
  }, []);

  const GetTicketComments = useCallback(async (data: { ticket_id: string }) => {
    try {
      const res = await axios.post("/api/ticket-comment/get-comments", data);
      console.log(res);
      return res.data;
    } catch (err) {
      console.log("GetTicketcomments", err);
    }
  }, []);

  const CreateTicketComment = useCallback(
    async (data: CreateTicketCommentType) => {
      
      try {
        const res = await axios.post(
          "/api/ticket-comment/create-comment",
          data
        );
        // console.log('res',res)
        return res.data;
      } catch (err) {
        console.log("CreateTicketComment", err);
      }
    },
    []
  );

  const EditTicketComment = useCallback(async(data:EditTicketCommentType)=>{
    try{
      const res = await axios.post("/api/ticket-comment/update-comment",data)
      console.log(res)
      return res.data
    }
    catch(err){
      console.log("EditTicketComment",err)
    }
  },[GetTicketComments])

  const DeleteTicketComment = useCallback(
    async (data: { comment_id: string }) => {
      try {
        const res = await axios.post(
          "/api/ticket-comment/delete-comment",
          data
        );
        console.log("res", res);
        return res.data;
      } catch (err) {
        console.log("DeleteTicketComment", err);
      }
    },
    [GetTicketComments]
  );

  const GetTicketAllCollaborators = useCallback(
    async (data: { ticket_id: string }) => {
      try {
        const res = await axios.post(
          "/api/ticket-collaborators/get-collabs",
          data
        );
        if (res.data.status) {
          return res.data.data;
        } else {
          console.log("getTicketcollaborators", res);
        }
      } catch (err) {
        console.log("GetTicketAllCollaborators", err);
      }
    },
    []
  );

  const CreateTicketCollaborators = useCallback(
    async (data: TicketCollaboratorsType) => {
      try {
        const res = await axios.post(
          "/api/ticket-collaborators/create-collabs",
          data
        );
        return res.data;
      } catch (err) {
        console.log("TicketCollaborators", err);
      }
    },
    []
  );

  const RemoveTicketCollaborator = useCallback(async(data:TicketCollaboratorsType)=>{
    try{
      const res = await axios.post("/api/ticket-collaborators/delete-collabss",data)
      console.log('res',res)
      return res.data
    }
    catch(err){
      console.log("UpdateTicketCollaborators",err)
    }
  },[])

  return {
    tickets,
    error,
    loading,
    fetchAllTickets,
    deleteTicket,
    UpdateTicketStatus,
    CreateTicket,
    EditTicket,
    GetTicket,
    UpdateTicketHistory,
    GetTicketHistory,
    GetTicketComments,
    CreateTicketComment,
    EditTicketComment,
    DeleteTicketComment,
    GetTicketAllCollaborators,
    CreateTicketCollaborators,
    RemoveTicketCollaborator,
  };
};
