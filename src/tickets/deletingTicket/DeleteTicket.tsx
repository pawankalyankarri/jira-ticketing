import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { TicketsStore } from "@/Zustand/TicketsStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { UseTickets } from "../hooks/UseTickets";

const DeleteTicket = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {deleteTicket} = UseTickets()
  const { id } = params;


  return (
    <AlertDialog open>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure want to delete Ticket?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            ticket.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          onClick={()=>navigate("/tickets")}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async() => {
              if(id){
                await deleteTicket(id)
                navigate("/tickets")
              }
              else{
                toast.warning("ticket id is undefined")
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteTicket;
