import { columns, type clients } from "@/components/clients/ClientColumns";
import { DataTable } from "@/components/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, SquarePen, UserRoundXIcon } from "lucide-react";
import AddDialog from "@/components/clients/AddClientsDialog";
import Loading from "@/components/loading";
import { useState } from "react";
import DeleteDialog from "@/components/clients/DeleteDialog";
import EditClientDialog from "@/components/clients/EditClientDialog";
import { useClients } from "@/hooks/useQueries";

type dialogStateType = {
  openDialog: boolean;
  id: string;
};
type editDialogType = {
  openDialog: boolean;
  client: clients;
};

function Clients() {
  const { data, isLoading } = useClients();
  const [editDialogState, setEditDialogState] = useState<editDialogType | null>(
    null
  );
  const [deleteDialogState, setDeleteDialog] =
    useState<dialogStateType | null>();

  if (isLoading) return <Loading />;

  return (
    <>
      <title>Clients – Estatein Dashboard</title>
      <meta
        name="description"
        content="View, add, edit, and manage your real estate clients on the Estatein Dashboard."
      />
      <link
        rel="canonical"
        href="https://estatein-dahboard.vercel.app/clients"
      />
      <meta property="og:title" content="Clients – Estatein Dashboard" />
      <meta
        property="og:description"
        content="Easily manage all your real estate clients from the Estatein Dashboard."
      />
      <meta
        property="og:url"
        content="https://estatein-dahboard.vercel.app/clients"
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      <section className="h-[70vh] flex flex-col gap-y-4">
        <AddDialog />
        {deleteDialogState?.openDialog && (
          <DeleteDialog
            id={deleteDialogState.id}
            open={deleteDialogState.openDialog}
            onOpenChange={(open) => !open && setDeleteDialog(null)}
          />
        )}
        {editDialogState?.openDialog && (
          <EditClientDialog
            client={editDialogState.client}
            open={editDialogState.openDialog}
            onOpenChange={(open) => !open && setEditDialogState(null)}
          />
        )}

        <ScrollArea className="h-full rounded bg-accent/25">
          <DataTable
            columns={columns}
            data={data!}
            rowActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-center cursor-pointer">
                  <EllipsisVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-accent *:cursor-pointer">
                  <DropdownMenuItem
                    onClick={() =>
                      setEditDialogState({
                        openDialog: true,
                        client: row.original,
                      })
                    }
                  >
                    <SquarePen color="#fff" size={25} />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setDeleteDialog({
                        openDialog: true,
                        id: row.original._id,
                      })
                    }
                  >
                    <UserRoundXIcon color="#ff6467" size={25} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </>
  );
}

export default Clients;
