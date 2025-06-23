import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Rating } from "./RatingColumns";
import { useEditRating } from "@/hooks/useMutations";
import { urlFor } from "@/lib/sanityClient";

const schema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  message: z.string().min(10).max(1000),
  rating: z.coerce.number().min(1).max(5),
  avatar: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditRatingDialog({
  open,
  onOpenChange,
  rating,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: Rating;
}) {
  const { mutate: editRating } = useEditRating();
  const [preview, setPreview] = useState<string | null>(
    rating.avatar ? urlFor(rating.avatar).format("webp").url() : null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: rating.name,
      title: rating.title,
      location: rating.location,
      message: rating.message,
      rating: rating.rating,
      avatar: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        editRating(
          {
            ...values,
            _id: rating._id,
            _type: "rating",
            avatar: values.avatar || rating.avatar,
          },
          {
            onSuccess: () => {
              form.reset();
              setPreview(null);
              onOpenChange(false);
              resolve();
            },
            onError: reject,
          }
        );
      }),
      {
        loading: "Updating rating...",
        success: "Rating updated!",
        error: "Update failed.",
      }
    );
  };

  const handleFileChange = useCallback(
    (file?: File) => {
      if (file) {
        form.setValue("avatar", file);
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Rating</DialogTitle>
          <DialogDescription>
            Modify rating details. Avatar will update if a new image is chosen.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(["name", "title", "location"] as const).map((field) => (
              <FormField
                key={field}
                name={field}
                control={form.control}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{field}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${field}`} {...f} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              name="rating"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1–5)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} max={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="avatar"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleFileChange(file);
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {preview && (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={preview} className="object-cover " />
                      <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
