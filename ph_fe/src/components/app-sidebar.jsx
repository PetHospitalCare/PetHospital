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
  CalendarCheck,
  User
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
  setNavItems, setNavTitle, setProject, ...props
}) {
  const { user } = useContext(UserContext)
  const [service, setService] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Services.getAllService("http://localhost:9999/service/get-all");
        if (response.data.success) {


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
            url: "/Product_Management",

          },
          {
            title: "Kho Thuốc",
            url: "/Medicine_Management",
          },
          {
            title: "Bảng Tin",
            url: "/News_Management",
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
          url: `/Service_Management/${item._id}`,
        })),
      },
    ],
    projects: [
      {
        name: "Thông số & Doanh thu",
        url: "#",
        icon: Map,
      },
      {
        name: "Lịch khám",
        url: "/Schedule",
        icon: CalendarCheck,
      },
      {
        name: "Quản lí lịch hẹn & Hồ sơ",
        url: "/Booking_Management",
        icon: PieChart,
      },
      {
        name: "Tài Khoản",
        url: "/Account_Management",
        icon: User,
      },

    ],
  }

  // send data navMain to Page.jsx
  useEffect(() => {
    if (setNavItems) {
      const allTitle = data.navMain
      const project = data.projects
      const allItems = data.navMain.flatMap((nav) => nav.items);
      setNavTitle(allTitle)
      setNavItems(allItems);
      setProject(data.projects)
    }
  }, [service]);
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>

        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
