import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: IconDefinition;
    isActive?: boolean;
    navigate?: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.navigate ? (
                    <NavLink
                      to={item?.navigate ? item.navigate : ""}
                      className={({ isActive }) =>
                        cn(
                          "w-full flex gap-2 items-center p-1 rounded ",
                          isActive ? "bg-blue-200" : ""
                        )
                      }
                    >
                      {item.icon && <FontAwesomeIcon icon={item.icon} />}
                      <span className="font-bold uppercase">{item.title}</span>
                    </NavLink>
                  ) : (
                    <div className="w-full flex gap-2 items-center p-1 rounded cursor-pointer">
                      {item.icon && <FontAwesomeIcon icon={item.icon} />}
                      <span className="font-bold uppercase">{item.title}</span>
                    </div>
                  )}
                  {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* <SidebarMenuSub>
                  {item.items && item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub> */}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
