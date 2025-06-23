import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { User } from "lucide-react";

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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, slugify } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useAddClient } from "@/hooks/useMutations";
import { toast } from "react-hot-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  joinDate: z
    .union([z.date(), z.null()])
    .refine(
      (date) =>
        date instanceof Date &&
        date < new Date(new Date().setHours(0, 0, 0, 0)),
      {
        message: "Join date must be before today!",
      }
    ),

  herf: z.string().url("Enter a valid URL"),
  domin: z.string().min(1, "Domain is required"),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters long")
    .max(50, "Category must be under 50 characters"),
  message: z
    .string()
    .min(25, "Message must be at least 25 characters long")
    .max(1000, "Message must be under 1000 characters"),
});

function AddClientDialog() {
  const { mutate: addClientMutation } = useAddClient();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      joinDate: null,
      herf: "",
      domin: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const slug = slugify(values.name);

    const newDoc = {
      _type: "clients",
      title: values.name,
      publishedAt: values.joinDate?.getFullYear(),
      domin: values.domin,
      herf: values.herf,
      category: values.category,
      message: values.message,
      slug: {
        _type: "slug",
        current: slug,
      },
    };

    toast.promise(
      new Promise<void>((resolve, reject) => {
        addClientMutation(newDoc, {
          onSuccess: () => {
            form.reset();
            setOpen(false);
            resolve();
          },
          onError: (err) => reject(err),
        });
      }),
      {
        loading: "Adding client...",
        success: "Client added successfully!",
        error: "Failed to add client.",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="dialog-button">
        <User />
        New Client
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Let's add new client!</DialogTitle>
          <DialogDescription>
            Please fill in the client's information below. You can update these
            details later if needed.
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
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Join Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
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
                          startMonth={new Date(2000, 0)}
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date >= new Date(new Date().setHours(0, 0, 0, 0))
                          }
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
                      <Input placeholder="https://example.com" {...field} />
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
                    <FormLabel>Domain (Business area)</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
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
                      <Input placeholder="e.g. SaaS, E-commerce" {...field} />
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
                      <Textarea
                        placeholder="Optional notes or message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Add Client</Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddClientDialog;
