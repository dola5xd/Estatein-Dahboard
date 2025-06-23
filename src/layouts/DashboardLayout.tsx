import { Link, Outlet, useLocation } from "react-router";
import { useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import leaf from "@/assets/leaf.svg";
import { useUserLogout } from "@/hooks/useAuthMutation";
import { useCurrentUser } from "@/hooks/useQueries";
import Loading from "@/components/loading";

function DashboardLayout() {
  const location = useLocation();
  const { open } = useSidebar();
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: handleLogout } = useUserLogout();

  if (isLoading)
    return (
      <div className="fixed inset-0 w-screen h-screen">
        <Loading />
      </div>
    );
  return (
    <>
      {!user?.admin && (
        <div className="fixed top-0 left-0 z-50 w-screen py-2 text-lg text-center rounded-b-full bg-muted">
          Sorry 😢 You’re not allowed to perform create, read, update, or delete
          actions.
        </div>
      )}
      <AppSidebar />
      <main
        className={`min-h-[calc(100vh_-_28px_-_40px)] duration-500 text-white pt-10 pb-7 gap-y-7 pr-5 flex flex-col ${
          !open ? "w-full" : "min-w-[calc(100%_*_5_/_6_-_28px_*_2)]"
        }`}
      >
        <div className="flex items-center justify-between w-full h-auto">
          <h1 className="text-3xl flex items-center gap-x-1.5 text-white capitalize">
            <img src={leaf} alt="leaf Estatein logo" />
            {location.pathname.replace("/", "") || "Dashboard"}
          </h1>

          <div className="flex items-center gap-x-7">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-center cursor-pointer">
                <Avatar
                  className="w-12 h-12 border rounded-full"
                  title="Profile Avatar"
                >
                  <AvatarImage
                    className="w-12 rounded-full aspect-square"
                    src={user!.avatar}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="flex items-center self-center justify-center w-12 text-lg rounded-full">
                    {user?.displayName?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-accent *:cursor-pointer">
                <DropdownMenuLabel>
                  {isLoading ? "Loading..." : user?.displayName || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={"/settings"} className="cursor-pointer">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default DashboardLayout;
