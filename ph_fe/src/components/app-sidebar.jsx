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
  HeartPulse
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



export function AppSidebar({
  ...props
}) {
  const { user } = useContext(UserContext)
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
            title: "Dịch vụ",
            url: "/Service_Managerment",
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
        items: [
          {
            title: "Siêu âm, Chụp X quang",
            url: "",
          },
          {
            title: "Khám sức khỏe và điều trị bệnh",
            url: "",
          },
          {
            title: "Xét nghiệm máu",
            url: "",
          },
          {
            title: "Khám điều trị tại nhà",
            url: "",
          },
          {
            title: "Phẫu thuật mổ để",
            url: "",
          },
          {
            title: "Phẫu thuật phức tạp",
            url: "",
          },
          {
            title: "Phẫu thuật xương",
            url: "",
          },
          {
            title: "Lưu chuồng điều trị",
            url: "",
          },
          {
            title: "Spa & Grooming",
            url: "",
          },
          {
            title: "Tiêm vaccine chó & mèo",
            url: "",
          },
          {
            title: "Triệt sản chó & mèo",
            url: "",
          },


        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }
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
