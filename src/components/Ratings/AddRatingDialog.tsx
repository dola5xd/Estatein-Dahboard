import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAddRating } from "@/hooks/useMutations";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Star } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  message: z.string().min(10).max(1000),
  location: z.string().min(2),
  rating: z.coerce.number().min(1).max(5),
  avatar: z.custom<File>(
    (file) => file instanceof File && file.type.startsWith("image/"),
    {
      message: "Avatar must be an image file.",
    }
  ),
});

type RatingFormValues = z.infer<typeof schema>;

function AddRatingDialog() {
  const [open, setOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const form = useForm<RatingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      title: "",
      message: "",
      location: "",
      rating: 5,
      avatar: undefined as unknown as File,
    },
  });

  const { mutateAsync: addRating, isPending } = useAddRating();

  const onSubmit = async (values: RatingFormValues) => {
    const data = {
      _type: "rating",
      ...values,
    };

    form.reset();
    setAvatarPreview(null);
    setOpen(false);

    await toast.promise(addRating(data), {
      loading: "Submitting rating...",
      success: "Rating submitted!",
      error: "Failed to submit rating",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isPending} className="dialog-button">
        {isPending ? (
          <>
            <Star />
            Uploading Rating...
          </>
        ) : (
          <>
            <Star />
            New Rating
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] px-0">
        <DialogHeader className="px-6">
          <DialogTitle>Add a New Rating</DialogTitle>
          <DialogDescription>Share your experience with us.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="location"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
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
                      <Textarea placeholder="Your message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        step={0.5}
                        placeholder="e.g. 4.5"
                        {...field}
                      />
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
                          if (file) {
                            field.onChange(file);
                            const previewUrl = URL.createObjectURL(file);
                            setAvatarPreview(previewUrl);
                          }
                        }}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                    {avatarPreview && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="object-cover object-top"
                          />
                          <AvatarFallback>IMG</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Submitting..." : "Submit Rating"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddRatingDialog;
