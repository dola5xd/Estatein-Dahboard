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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Property } from "./PropertyColumns";
import { urlFor } from "@/lib/sanityClient";
import { useEditProperty } from "@/hooks/useMutations";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  price: z.coerce.number().min(1000).max(100_000_000),
  area: z.coerce.number().min(100).max(100_000),
  bedrooms: z.coerce.number().min(1).max(100),
  bathrooms: z.coerce.number().min(1).max(100),
  description: z.string().min(25).max(1000).optional(),
  newImages: z.array(z.instanceof(File)).max(8),
});

type FormValues = z.infer<typeof formSchema>;

function EditPropertyDialog({
  open,
  onOpenChange,
  property,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
}) {
  const { mutate: editProperty } = useEditProperty();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property.name,
      location: property.location,
      price: property.price,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      description: property.description || "",
      newImages: [],
    },
  });

  const [existingImages, setExistingImages] = useState(property.images || []);
  const [previews, setPreviews] = useState<string[]>([]);

  const removeExistingImage = useCallback((ref: string) => {
    setExistingImages((prev) => prev.filter((img) => img.asset._ref !== ref));
  }, []);

  const removeNewImage = useCallback(
    (index: number) => {
      const files = form.getValues("newImages");
      form.setValue(
        "newImages",
        files.filter((_, i) => i !== index)
      );
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [form]
  );

  const onSubmit = (values: FormValues) => {
    const updatedDoc = {
      _id: property._id,
      _type: "property",
      name: values.name,
      location: values.location,
      price: values.price,
      area: values.area,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      description: values.description,
      images: [...existingImages, ...values.newImages],
    };

    toast.promise(
      new Promise<void>((resolve, reject) => {
        editProperty(updatedDoc, {
          onSuccess: () => {
            form.reset();
            setPreviews([]);
            onOpenChange(false);
            resolve();
          },
          onError: reject,
        });
      }),
      {
        loading: "Saving changes...",
        success: "Property updated!",
        error: "Update failed.",
      }
    );
  };

  const fields = useMemo(
    () =>
      ["name", "location", "price", "area", "bedrooms", "bathrooms"] as const,
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>Update property details below.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] py-2 px-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {fields.map((field) => (
                <FormField
                  key={field}
                  name={field}
                  control={form.control}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field}</FormLabel>
                      <FormControl>
                        <Input
                          {...f}
                          type={
                            ["price", "area", "bedrooms", "bathrooms"].includes(
                              field
                            )
                              ? "number"
                              : "text"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="newImages"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload New Images</FormLabel>
                    <FormControl>
                      <Input
                        disabled={existingImages.length === 8}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          const current = field.value ?? [];
                          const next = [...current, ...files].slice(0, 8);
                          form.setValue("newImages", next);

                          const newPreviews = files.map((file) =>
                            URL.createObjectURL(file)
                          );
                          setPreviews((prev) =>
                            [...prev, ...newPreviews].slice(0, 8)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex flex-wrap mt-2 gap-2">
                      {existingImages.map((img) => (
                        <Badge
                          key={img.asset._ref}
                          onClick={() => removeExistingImage(img.asset._ref)}
                          className="cursor-pointer bg-muted rounded-full p-0.5"
                        >
                          <img
                            src={urlFor(img).width(100).url()}
                            alt="existing"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </Badge>
                      ))}

                      {previews.map((src, i) => (
                        <Badge
                          key={i}
                          onClick={() => removeNewImage(i)}
                          className="cursor-pointer bg-muted rounded-full p-0.5"
                        >
                          <img
                            src={src}
                            alt="preview"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </Badge>
                      ))}
                    </div>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default EditPropertyDialog;
