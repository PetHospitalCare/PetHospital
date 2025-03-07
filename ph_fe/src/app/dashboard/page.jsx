import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../../App"
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
export default function Page({ children }) {
  const [navTitle, setNavTitle] = useState([]);
  const [navItems, setNavItems] = useState([]);
  const [project, setProject] = useState([]);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Số thông báo chưa đọc
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true); // Trạng thái có thông báo chưa đọc

  const navigate = useNavigate();
  const handleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0); // Khi mở, đánh dấu là đã đọc
      return !prev;
    });
  };

  useEffect(() => {
    socket.on("newBooking", (newBooking) => {
      setNotifications((prevNotifications) => [
        {
          message: `${newBooking.guest_name} có đặt lịch hẹn mới!`,
          time: newBooking.createdAt, // Lấy thời gian từ server
        },
        ...prevNotifications,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("newBooking");
    };
  }, []);
  const formatTime = (timestamp) => {
    return format(new Date(timestamp), "HH:mm - dd/MM/yyyy", { locale: vi });
  };
  // Find breadcrumb that matches with url
  const currentBreadcrumb = navItems.find((item) => item.url === location.pathname);
  const findSectionTitleByItemTitle = (data, itemTitle) => {
    for (const section of data) {
      if (section.items.some((item) => item.title === itemTitle)) {
        return section.title;
      }
    }
    return null; // Trả về null nếu không tìm thấy
  };
  const parentTitle = findSectionTitleByItemTitle(navTitle, currentBreadcrumb?.title);
  const projecttilte = project.find((item) => item.url === location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar setNavItems={setNavItems} setNavTitle={setNavTitle} setProject={setProject} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {parentTitle && (
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink>{parentTitle} </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {projecttilte && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{projecttilte.name} </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
                {parentTitle && <BreadcrumbSeparator className="hidden md:block" />}
                {currentBreadcrumb && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentBreadcrumb.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Chuông thông báo */}
          <div className="relative">
            <div className="cursor-pointer relative" onClick={handleOpen}>
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Dropdown thông báo */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
                <div className="p-3">
                  <p className="font-semibold text-gray-700 text-lg">🔔 Thông báo</p>
                  <Separator className="my-2" />
                  {notifications.length > 0 ? (
                    <ul className="max-h-64 overflow-auto">
                      {notifications.map((notif, index) => (
                        <li
                          key={index}
                          className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg mb-2 cursor-pointer transition"
                          onClick={() => navigate("/Booking_Management")}
                        >
                          <p className="font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(notif.time)}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 py-3">Không có thông báo</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
