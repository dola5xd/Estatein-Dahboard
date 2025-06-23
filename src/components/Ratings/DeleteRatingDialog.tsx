import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteRating } from "@/hooks/useMutations";
import { toast } from "react-hot-toast";

function DeleteRatingDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: deleteRatingMutation, isPending } = useDeleteRating();

  const onConfirm = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        deleteRatingMutation(id, {
          onSuccess: () => {
            onOpenChange(false);
            resolve();
          },
          onError: (err) => reject(err),
        });
      }),
      {
        loading: "Deleting property...",
        success: "Property deleted!",
        error: "Failed to delete property.",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. It will permanently delete the
            property.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteRatingDialog;
