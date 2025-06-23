import Loading from "@/components/loading";
import { useState } from "react";
import { columns, type Rating } from "@/components/Ratings/RatingColumns";
import { useRatings } from "@/hooks/useQueries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, SquarePen, UserRoundXIcon } from "lucide-react";
import AddRatingDialog from "@/components/Ratings/AddRatingDialog";
import DeleteRatingDialog from "@/components/Ratings/DeleteRatingDialog";
import EditRatingDialog from "@/components/Ratings/EditRatingDialog";

type dialogStateType = {
  openDialog: boolean;
  id: string;
};
type editDialogType = {
  openDialog: boolean;
  rating: Rating;
};

function Ratings() {
  const { data, isLoading } = useRatings();
  const [editDialogState, setEditDialogState] = useState<editDialogType | null>(
    null
  );
  const [deleteDialogState, setDeleteDialog] =
    useState<dialogStateType | null>();

  if (isLoading) return <Loading />;

  return (
    <>
      <title>Client Ratings – Estatein Dashboard</title>
      <meta
        name="description"
        content="View and manage client feedback and ratings on properties through the Estatein dashboard."
      />
      <link
        rel="canonical"
        href="https://estatein-dahboard.vercel.app/ratings"
      />
      <meta property="og:title" content="Client Ratings – Estatein Dashboard" />
      <meta
        property="og:description"
        content="Stay informed with the latest client opinions and ratings for your real estate listings."
      />
      <meta
        property="og:url"
        content="https://estatein-dahboard.vercel.app/ratings"
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <section className="max-h-[70vh] flex flex-col gap-y-4">
        <AddRatingDialog />
        {deleteDialogState?.openDialog && (
          <DeleteRatingDialog
            id={deleteDialogState.id}
            open={deleteDialogState.openDialog}
            onOpenChange={(open) => !open && setDeleteDialog(null)}
          />
        )}
        {editDialogState?.openDialog && (
          <EditRatingDialog
            rating={editDialogState.rating}
            open={editDialogState.openDialog}
            onOpenChange={(open) => !open && setEditDialogState(null)}
          />
        )}

        <ScrollArea className="h-full rounded bg-accent/25">
          <DataTable
            columns={columns}
            data={data!}
            textCenter={false}
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
                        rating: row.original,
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
        </ScrollArea>
      </section>{" "}
    </>
  );
}

export default Ratings;
