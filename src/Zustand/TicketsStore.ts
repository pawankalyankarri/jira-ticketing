import axios from "axios";
import { create } from "zustand";





// interface TicketState {
//   tickets: TicketType[];
//   setTickets : (tickets:TicketType[])=>void
//   loading: boolean;
//   setLoading : (value:boolean)=>void;
//   error: string | null;
//   setError : (value:string)=>void;
//   getTickets: () => void;
//   refreshTickets: () => void;
// }

// export const TicketsStore = create<TicketState>((set, get) => ({
//   tickets: [],
//   setTickets : (tickets)=>set({tickets}),
//   loading: false,
//   setLoading : (value)=>set({loading:value}),
//   error: null,
//   setError : (value)=>set({error: value}),
//   getTickets: async () => {
//     set({ loading: true, error: null });

//     await axios
//       .get("/api/ticketing")
//       .then((res) => set({ tickets: res.data.data, loading: false }))
//       .catch((err) => set({ error: err.message, loading: false }));
//   },
//   refreshTickets: async () => {
//     await get().getTickets();
//   },
// }));
