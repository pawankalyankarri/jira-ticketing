"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  FileKey,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { useEffect, useState, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { faEye, faGears, faTableColumns, faTicket, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

import { BoardWorkflowAPI } from "@/UserProfile/boardWorkflowAPI/BoardWorkflowAPI";

// This is sample data.

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "tickets",
      url: "#",
      icon: faTicket,
      navigate: "/tickets",
      isActive: true,
    },
    {
      title : "my tasks",
      url: "#",
      icon: faUser,
      // navigate: "",
      isActive: true,
    },
    {
      title : "watching",
      url: "#",
      icon: faEye,
      // navigate: "",
      isActive: true,
    },
    {
      title : "task assignment",
      url: "#",
      icon: faUsers,
      // navigate: "",
      isActive: true,
    },
    {
      title : "worklogs",
      url: "#",
      icon: faGears,
      // navigate: "",
      isActive: true,
    },
    // {
    //   title : "Board",
    //   url : "#",
    //   icon : faTableColumns,
    //   navigate : "/tickets",
    //   items : [
    //     {
    //       title : "b1",
    //       url : "#"
    //     }
    //   ]

    // }
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [allBoards, setAllBoards] = useState([]);
  const { FetchAllBoardsWithWorkflows } = BoardWorkflowAPI();
  const mountRef = useRef<boolean>(false);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    const GetAllBoards = async () => {
      const response = await FetchAllBoardsWithWorkflows();
      console.log('bordes',response);
      if (response?.data.status) {
        // console.log("boardsres", response.data);
        if (response.data.data) {
          setAllBoards(response.data.data);
        }
      }
    };
    GetAllBoards();
  }, []);
  // console.log('boards',allBoards)

  if (!allBoards) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props} className="text-gray-800 grid gap-1">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects boards={allBoards} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
