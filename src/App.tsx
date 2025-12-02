import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import UserProfilePage from "./UserProfile/UserProfilePage"
import { useEffect, useState } from "react"
import { BoardWorkflowAPI } from "./UserProfile/boardWorkflowAPI/BoardWorkflowAPI"
import { Card } from "./components/ui/card"
import "wx-react-gantt/dist/gantt.css";

export default function Page() {
  

  return (
    <SidebarProvider className="bg-gray-50"  >
      <AppSidebar  />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-fit py-0.5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-fit border-b-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
          <div className="w-full flex justify-end items-end mr-2"><UserProfilePage/></div>
          
        </header>
        {/* here everyting  will be rendered */}
        
          <Outlet/>
        
      </SidebarInset>
    </SidebarProvider>
  )
}
