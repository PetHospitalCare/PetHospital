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
  User,
  MessageSquare,
  FolderOpen,
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
  const { user } = useContext(UserContext);
  const [service, setService] = useState([]);
  const hasRole = (userRoles, allowedRoles) => {
    return userRoles?.some(role => allowedRoles.includes(role));
  };
  const getRoleBasedNavigation = () => {
    const roles = user?.role || [];
    const baseNavigation = [];

    // Admin and Staff share management access
    if (hasRole(roles, ['admin', 'staff'])) {
      baseNavigation.push({
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
            title: "Đơn hàng",
            url: "/orders_management",
          },
        ],
      });

      // Service section for admin and staff
      baseNavigation.push({
        title: "Dịch vụ",
        url: "#",
        icon: HeartPulse,
        isActive: true,
        items: service.map((item) => ({
          title: item.name,
          url: `/Service_Management/${item._id}`,
        })),
      });
    }

    // Admin specific items
    if (hasRole(roles, ['admin'])) {
      // Add admin specific navigation items if needed
    }



    return baseNavigation;
  };

  // Define role-based projects
  const getRoleBasedProjects = () => {
    const roles = user?.role || [];
    const projects = [];

    // Admin specific projects
    if (hasRole(roles, ['admin'])) {
      projects.push(
        {
          name: "Thông số & Doanh thu",
          url: "/Dashboard",
          icon: Map,
        },
        {
          name: "Tài Khoản",
          url: "/Account_Management",
          icon: User,
        },

      );
    }

    // Staff specific projects

    // Doctor specific projects
    if (hasRole(roles, ['doctor'])) {
      projects.push({
        name: "Lịch khám",
        url: "/Schedule",
        icon: CalendarCheck,
      });
    }

    // Chat access for admin and staff
    if (hasRole(roles, ['admin', 'staff'])) {
      projects.push({
        name: "Trò chuyện",
        url: "/chat",
        icon: MessageSquare,
      },
        {
          name: "Quản lí lịch hẹn",
          url: "/Booking_Management",
          icon: PieChart,
        });
    }
    projects.push(
      {
        name: "Hồ sơ Khám",
        url: "/MedicalRecord",
        icon: FolderOpen,
      });

    return projects;
  };

  // Update service fetching to use hasRole
  useEffect(() => {
    const fetchData = async () => {
      if (hasRole(user?.role, ['admin', 'staff'])) {
        try {
          const response = await Services.getAllService();
          if (response.data.success) {
            setService(response.data.services);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
      }
    };

    fetchData();
  }, [user?.role]);

  const data = {
    user: {
      name: user.username,
      email: user.email,
      avatar: user.url || "/profile.png",
    },
    navMain: getRoleBasedNavigation(),
    projects: getRoleBasedProjects(),
  };

  // send data navMain to Page.jsx
  useEffect(() => {
    if (setNavItems) {
      const allTitle = data.navMain;
      const project = data.projects;
      const allItems = data.navMain.flatMap((nav) => nav.items);
      setNavTitle(allTitle);
      setNavItems(allItems);
      setProject(data.projects);
    }
  }, [service, user?.role]);

  return (
    <Sidebar collapsible="icon" {...props}>
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
    </Sidebar>
  );
}