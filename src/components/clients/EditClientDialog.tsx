import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { cn, slugify } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useEditClient } from "@/hooks/useMutations";
import type { clients } from "./ClientColumns";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  joinDate: z
    .union([z.date(), z.null()])
    .refine(
      (date) =>
        date instanceof Date && date.getFullYear() <= new Date().getFullYear(),
      {
        message: "Join date must be this year or earlier.",
      }
    ),
  herf: z.string().url("Enter a valid URL"),
  domin: z.string().min(1, "Domain is required"),
  category: z.string().min(3).max(50),
  message: z.string().min(25).max(1000),
});

function EditClientDialog({
  client,
  open,
  onOpenChange,
}: {
  client: clients;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: editClient, isPending } = useEditClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client.title,
      joinDate: client.publishedAt ? new Date(client.publishedAt, 0) : null,
      herf: client.herf,
      domin: client.domin,
      category: client.category,
      message: client.message,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedDoc = {
      _id: client._id,
      _type: "clients",
      title: values.name,
      publishedAt: values.joinDate?.getFullYear(),
      domin: values.domin,
      herf: values.herf,
      category: values.category,
      message: values.message,
      slug: {
        _type: "slug",
        current: slugify(values.name),
      },
    };

    toast.promise(
      new Promise<void>((resolve, reject) => {
        editClient(updatedDoc, {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
            resolve();
          },
          onError: (err) => reject(err),
        });
      }),
      {
        loading: "Updating client...",
        success: "Client updated!",
        error: "Failed to update client.",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update the client details below.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] py-2 px-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="joinDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Join Year</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "yyyy")
                              : "Select a year"}
                            <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          startMonth={new Date(1999, 0)}
                          endMonth={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth()
                            )
                          }
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="herf"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="domin"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
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

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default EditClientDialog;
