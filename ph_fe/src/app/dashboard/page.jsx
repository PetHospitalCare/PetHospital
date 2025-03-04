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
import { useState } from "react";
import { useLocation } from "react-router-dom";
export default function Page({ children }) {
  const [navTitle, setNavTitle] = useState([]);
  const [navItems, setNavItems] = useState([]);
  const [project, setProject] = useState([]);
  const location = useLocation();

  // Find breadcrumb that matchs with url
  const currentBreadcrumb = navItems.find((item) => item.url === location.pathname);
  const findSectionTitleByItemTitle = (data, itemTitle) => {
    for (const section of data) {
      if (section.items.some(item => item.title === itemTitle)) {
        return section.title;
      }
    }
    return null; // Trả về null nếu không tìm thấy
  };
  const parentTitle = findSectionTitleByItemTitle(navTitle, currentBreadcrumb?.title)
  const projecttilte = project.find((item) => item.url === location.pathname)

  return (
    (<SidebarProvider>
      <AppSidebar setNavItems={setNavItems} setNavTitle={setNavTitle} setProject={setProject} />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
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
                  <BreadcrumbItem >
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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
