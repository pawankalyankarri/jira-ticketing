"use client";

import {
  ChevronRight,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";

export function NavProjects({
  boards,
}: {
  boards: {
    board_name: string;
    board_owner: string;
    created_at: LucideIcon;
    entity_id : string|null;
    id : string;
    updated_at : string;
    workflow_id : string;
    workflow_status_list : string[]
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    // <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    //   <SidebarGroupLabel className="font-bold">Boards</SidebarGroupLabel>
    //   <SidebarMenu>
    //     {boards.map((item) => (
    //       <SidebarMenuItem key={item.board_name}>
    //         <SidebarMenuButton asChild>
    //           {/* <a href={item.url}>
    //             <item.icon />
    //             <span>{item.name}</span>
    //           </a> */}
    //           <span>{item.board_name}</span>
    //         </SidebarMenuButton>
    //         {/* <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <SidebarMenuAction showOnHover>
    //               <MoreHorizontal />
    //               <span className="sr-only">More</span>
    //             </SidebarMenuAction>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent
    //             className="w-48 rounded-lg"
    //             side={isMobile ? "bottom" : "right"}
    //             align={isMobile ? "end" : "start"}
    //           >
    //             <DropdownMenuItem>
    //               <Folder className="text-muted-foreground" />
    //               <span>View Project</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuItem>
    //               <Forward className="text-muted-foreground" />
    //               <span>Share Project</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem>
    //               <Trash2 className="text-muted-foreground" />
    //               <span>Delete Project</span>
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu> */}
    //       </SidebarMenuItem>
    //     ))}
    //     {/* <SidebarMenuItem>
    //       <SidebarMenuButton className="text-sidebar-foreground/70">
    //         <MoreHorizontal className="text-sidebar-foreground/70" />
    //         <span>More</span>
    //       </SidebarMenuButton>
    //     </SidebarMenuItem> */}
    //   </SidebarMenu>
    // </SidebarGroup>
     <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        
          <Collapsible
            
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="boards" className="font-bold capitalize">
                  {/* {item.icon && <FontAwesomeIcon icon={item.icon} />} */}
                  
                    <FontAwesomeIcon icon={faTableColumns} />
                    Boards
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  { boards?.map((item) => (
                    <SidebarMenuSubItem key={item.id}>
                      <SidebarMenuSubButton asChild>
                        
                        <span className="font-bold capitalize text-gray-800">{item.board_name}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        
      </SidebarMenu>
    </SidebarGroup>
  );
}
