import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowDownNarrowWide, ChevronDown, Goal } from "lucide-react";

const TicketsHeadTab = () => {
  return (
      <Tabs defaultValue="account" className="w-full p-1 border border-gray-50 bg-gray-200 rounded">
        <TabsList className="">
          <TabsTrigger value="goal" className="px-3 cursor-pointer" ><Goal/> <ChevronDown/></TabsTrigger>
          <TabsTrigger value="all" className="px-3 cursor-pointer">All</TabsTrigger>
          <TabsTrigger value="notSet" className="px-3 cursor-pointer">Not set</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent> */}
      </Tabs>
  );
};
export default TicketsHeadTab;
