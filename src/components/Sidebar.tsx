import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Home, Users, Building2, Settings, Star } from "lucide-react";
import { NavLink } from "react-router";
import logo from "@/assets/logo.svg";
const mainNavItems = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Clients", path: "/clients", icon: Users },
  { title: "Properties", path: "/properties", icon: Building2 },
  { title: "Ratings", path: "/Ratings", icon: Star },
];

const settingsItem = { title: "Settings", path: "/settings", icon: Settings };

export function AppSidebar() {
  return (
    <Sidebar className="w-1/6">
      <SidebarContent className="flex flex-col justify-between w-full h-full px-4 pt-10 pb-7">
        <SidebarGroup>
          <SidebarGroupLabel className="self-center mb-7 min-h-[48px] scale-75">
            <img src={logo} alt="estatian logo" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-y-5 ">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 px-4 py-2 rounded-md transition-colors ",
                          isActive
                            ? "text-primary-800 font-semibold"
                            : "text-gray-300",
                        ].join(" ")
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <NavLink
                to={settingsItem.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-4 py-2 rounded-md transition-colors ",
                    isActive
                      ? "text-primary-800 font-semibold"
                      : "text-gray-300",
                  ].join(" ")
                }
              >
                <settingsItem.icon size={20} />
                <span>{settingsItem.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
