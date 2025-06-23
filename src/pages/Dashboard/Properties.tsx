import {
  columns,
  type Property,
} from "@/components/Properties/PropertyColumns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, SquarePen, UserRoundXIcon } from "lucide-react";

import AddPropertyDialog from "@/components/Properties/AddPropertyDialog";
import Loading from "@/components/loading";
import { useState } from "react";
import DeletePropertyDialog from "@/components/Properties/DeletePropertyDialog";
import EditPropertyDialog from "@/components/Properties/EditPropertyDialog";
import { DataTable } from "@/components/data-table";
import { useProperties } from "@/hooks/useQueries";

type StateType = {
  openDialog: boolean;
  property?: Property;
  propertyID?: string;
};

function Properties() {
  const { data, isLoading } = useProperties();
  const [deletePropertyState, setDeletePropertyState] =
    useState<StateType | null>(null);

  const [editPropertyState, setEditPropertyState] = useState<StateType | null>(
    null
  );

  if (isLoading) return <Loading />;

  return (
    <section className="h-[70vh] flex flex-col gap-y-4">
      <AddPropertyDialog />

      {deletePropertyState?.openDialog && (
        <DeletePropertyDialog
          id={deletePropertyState.propertyID!}
          open={deletePropertyState.openDialog}
          onOpenChange={(open) => !open && setDeletePropertyState(null)}
        />
      )}

      {editPropertyState?.openDialog && (
        <EditPropertyDialog
          property={editPropertyState.property!}
          open={editPropertyState.openDialog}
          onOpenChange={(open) => !open && setEditPropertyState(null)}
        />
      )}

      <ScrollArea className="w-full h-full rounded-md bg-accent/25">
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
                    setEditPropertyState({
                      openDialog: true,
                      property: row.original,
                    })
                  }
                >
                  <SquarePen size={20} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    setDeletePropertyState({
                      openDialog: true,
                      propertyID: row.original._id,
                    })
                  }
                >
                  <UserRoundXIcon size={20} className="mr-2 text-red-500" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default Properties;
