import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  HeartPulse,
  CalendarCheck
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserContext } from "../contexts/UserContext"
import { useContext } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { Services } from "../../src/services/Services";


export function AppSidebar({
  setNavItems, setNavTitle,...props
}) {
  const { user } = useContext(UserContext)
  const [service, setService] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Services.getAllService("http://localhost:9999/service/get-all");
        if (response.data.success) {

          console.log("Formatted Data:", response.data.services);
          setService(response.data.services);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchData();
  }, []);
  const data = {
    user: {
      name: user.username,
      email: user.email,
      avatar: user.url || "/profile.png",
    },

    navMain: [
      {
        title: "Quản Lý",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Sản phẩm",
            url: "/Product_Managerment",

          },
          {
            title: "Thuốc",
            url: "/Medicine_Managerment",
          },
          {
            title: "Tài Khoản",
            url: "/Account_Managerment",
          },
          {
            title: "Bản Ghi Thú cưng",
            url: "/PetRecord_Management",
          },
        ],
      },
      {
        title: "Dịch vụ",
        url: "#",
        icon: HeartPulse,
        isActive: true,
        items: service.map((item) => ({
          title: item.name,
          url: `/Service_Managerment/${item._id}`,
        })),
      },
    ],
    projects: [
      {
        name: "Lịch khám",
        url: "/Schedule",
        icon: CalendarCheck,
      },
      {
        name: "Quản lí lịch hẹn",
        url: "/Booking_Management",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  // send data navMain to Page.jsx
  useEffect(() => {
    if (setNavItems) {
      const allTitle = data.navMain.flatMap((nav) => nav.title)
      const allItems = data.navMain.flatMap((nav) => nav.items);
      setNavTitle(allTitle)
      setNavItems(allItems);
    }
  }, [service]);
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
