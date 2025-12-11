import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import type { UsersDataType } from "../ticketInterfaces/TicketInterfaces";

interface TicketHistoryFormatProps {
  tdata: any;
  usersData: UsersDataType[];
}
const TicketHistoryFormat = ({
  tdata,
  usersData,
}: TicketHistoryFormatProps) => {
  console.log("tdata=====================>", tdata);
  const user = usersData.find((u) => String(u.id) === String(tdata.changed_by));
  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    // console.log(diff)
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    // console.log(seconds,minutes,hours,days)

    if (days > 50) {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (seconds >= 1) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };
  console.log("tdata.field", tdata.field_name);
  switch (tdata.field_name) {
    case "State":
      if (tdata.old_value) {
        return (
          <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                      {tdata.new_value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        );
      }

      break;
    case "Status":
      if (tdata.old_value) {
        return (
          <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                      {tdata.new_value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        );
      }

      break;

    case "Ticket":
      if (tdata.old_value) {
        return <div className="w-full">{tdata.new_value}</div>;
      }
      break;

    case "Summary":
      if(tdata.old_value){
        return(
            <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className="   px-2 py-1 text-gray-950 font-bold ">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className="  px-1.5 py-1 text-blue-950 font-bold">
                      {tdata.new_value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )
      }
      break

    case "Description" : 
      if(tdata.old_value){
        return(
            <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className="  px-2 py-1 text-gray-950 font-bold" dangerouslySetInnerHTML={{__html:tdata.old_value}} />
                      
                   
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className="  px-1.5 py-1 text-blue-950 font-bold"
                      dangerouslySetInnerHTML={{ __html: tdata.new_value }}/>
                   
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )
      }
      break
    case "Severity" : 
      if(tdata.old_value){
        return(
            <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                      {tdata.new_value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )
      }
      break
    case "Due_Date" : 
      if(tdata.old_value){
        return(
            <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                      {new Date(tdata.old_value).toLocaleDateString()}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                      {new Date(tdata.new_value).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )
      }
      break
    case "Start_Date" : 
      if(tdata.old_value){
        return(
            <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                      {new Date(tdata.old_value).toLocaleDateString()}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                      {new Date(tdata.new_value).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )
      }
      break

    case "Parent_Ticket" : 
      if(tdata.old_value === "0" && tdata.new_value){
        return(
             <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                   changed <strong>{tdata.field_name}  </strong> New Parent Ticket id is <strong>{tdata.new_value}</strong>
                  </div>

                  {/* <div className="w-full flex gap-3 items-center">
                    <span className="  px-2 py-1 text-gray-950 font-bold ">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className="  px-1.5 py-1 text-blue-950 font-bold ">
                      {tdata.new_value}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
            
        )
      }
      else if(tdata.old_value && tdata.new_value){
        return(
           <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name} </strong> 
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
                      {tdata.new_value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )

      }
      
      break

     case "Assignee":
      if(tdata.old_value){
        return(
            <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong>
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    
                    <span className="   px-2 py-1 text-gray-950 font-bold ">
                      {tdata.old_value}
                    </span>
                    <FontAwesomeIcon icon={faRightLong} />
                    <span className="  px-1.5 py-1 text-blue-950 font-bold">
                      {tdata.new_value}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div>
        )
      }
      else{
        const oldUser = usersData.find(u=>String(u.id) === String(tdata.new_value))
        return(
           <div className="flex justify-between  gap-2 w-full p-1 ">
            <div className="flex  w-full gap-2 items-center a">
              <div className="flex w-fit gap-3">
                <div className="w-fit">
                  <Avatar className="">
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {tdata.changed_by[0] || "u"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3 flex-col items-center ">
                  <div className=" w-full">
                    <strong className="capitalize">
                      {tdata.changed_by || "user"}
                    </strong>{" "}
                    changed the <strong>{tdata.field_name}</strong> to 
                  </div>

                  <div className="w-full flex gap-3 items-center">
                    <span className="   px-2 py-1 text-gray-950 font-bold ">
                      {tdata.old_value}
                    </span>
                    <div className="w-full flex items-center gap-2">
                        <div className="w-fit">
                  <Avatar className="">
                    <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
                      {oldUser?.first_name[0]}{oldUser?.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <strong className="capitalize">{`${oldUser?.first_name} ${oldUser?.last_name}`}</strong>
                    </div>

                    
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[50%] flex justify-end ">
              {formatTimeAgo(tdata.updated_at)}
            </div>
          </div> 
        )
      }
      break

    default:

    
      return null;
  }
};

export default TicketHistoryFormat;

// <div
//   className="flex justify-between  gap-2 w-full p-1 "
//   key={idx}
// >
//   <div className="flex  w-full gap-2 items-center a">
//     <div className="flex w-fit gap-3">
//       <div className="w-fit">
//         <Avatar className="">
//           {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
//           <AvatarFallback className="uppercase font-bold bg-blue-950 text-md text-white  ">
//             {obj.changed_by[0] || "u"}
//           </AvatarFallback>
//         </Avatar>
//       </div>
//       {/* {obj.old_value.trim() === "" ? (
//         <div>
//           <span>

//            {obj.new_value}
//           </span>
//         </div>
//       ) : ( */}
//       <div className="flex gap-3 flex-col items-center ">
//         <div className=" w-full">
//           <strong className="capitalize">
//             {obj.changed_by || "user"}
//           </strong>{" "}
//           changed the{" "}
//           <strong>
//             {obj.field_name}
//           </strong>
//         </div>

//         <div className="w-full flex gap-3 items-center">
//           <span className=" border border-green-200 px-2 py-1 text-gray-950 font-bold rounded">
//             {obj.old_value}
//           </span>
//           <FontAwesomeIcon
//             icon={faRightLong}
//           />
//           <span className=" border border-blue-200 px-1.5 py-1 text-blue-950 font-bold rounded">
//             {obj.new_value}
//           </span>
//         </div>
//       </div>
//       {/* )} */}
//     </div>
//   </div>

//   <div className="w-[50%] flex justify-end ">
//     {formatTimeAgo(obj.updated_at)}
//   </div>
// </div>
