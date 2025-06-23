import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { useAddProperty } from "@/hooks/useMutations";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  propertySchema,
  type PropertyFormValues,
  addToArray,
  removeFromArray,
} from "@/utils/propertyHelpers";
import type z from "zod";

function AddPropertyDialog() {
  const [open, setOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      location: "",
      price: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      description: "",
      keyFeatures: [],
      amenities: [],
      images: [],
    },
  });

  const { mutateAsync: addProperty, isPending } = useAddProperty();

  const onSubmit = async (values: z.infer<typeof propertySchema>) => {
    const doc = {
      _type: "property",
      name: values.name,
      location: values.location,
      price: values.price,
      area: values.area,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      description: values.description,
      keyFeatures: values.keyFeatures,
      amenities: values.amenities,
      images: values.images,
    };

    form.reset();
    setOpen(false);
    setPreviews([]);

    await toast.promise(addProperty(doc), {
      loading: "Uploading property...",
      success: "Property added!",
      error: "Failed to upload.",
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isPending} className="dialog-button">
        {isPending ? (
          <>
            <Home />
            Uploading Property...
          </>
        ) : (
          <>
            <Home />
            New Property
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] px-0">
        <DialogHeader className="px-6">
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Provide detailed information about the property.
          </DialogDescription>
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
                      <Input placeholder="e.g. Palm Villa" {...field} />
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
                      <Input placeholder="e.g. Los Angeles, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 250000"
                        {...field}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="area"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sq ft)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 1800"
                        {...field}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bedrooms"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 3"
                        {...field}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bathrooms"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 2"
                        {...field}
                        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief property description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Features array */}
              <FormItem>
                <FormLabel>Features</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Pool"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      addToArray(
                        form,
                        featureInput,
                        setFeatureInput,
                        "keyFeatures",
                        setPreviews
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("keyFeatures").map((item, idx) => (
                    <Badge
                      key={idx}
                      variant={"secondary"}
                      onClick={() =>
                        removeFromArray(form, idx, "keyFeatures", setPreviews)
                      }
                      className="cursor-pointer"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g. Wi-Fi"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      addToArray(
                        form,
                        amenityInput,
                        setAmenityInput,
                        "amenities",
                        setPreviews
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("amenities").map((item, idx) => (
                    <Badge
                      key={idx}
                      variant={"secondary"}
                      onClick={() =>
                        removeFromArray(form, idx, "amenities", setPreviews)
                      }
                      className="cursor-pointer"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>

              <FormField
                name="images"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Images (3–8)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const selectedFiles = Array.from(
                            e.target.files ?? []
                          );
                          const currentFiles = field.value ?? [];

                          const combinedFiles = [
                            ...currentFiles,
                            ...selectedFiles,
                          ].slice(0, 8);
                          field.onChange(combinedFiles);

                          const newPreviews = selectedFiles.map((file) =>
                            URL.createObjectURL(file)
                          );
                          setPreviews((prev) =>
                            [...prev, ...newPreviews].slice(0, 8)
                          );
                        }}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex flex-wrap gap-2 mt-4">
                      {previews.map((src, i) => (
                        <Avatar key={i} className="w-12 h-12">
                          <AvatarImage
                            src={src}
                            alt={`preview-${i}`}
                            className="object-cover object-top"
                          />
                          <AvatarFallback>IMG</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Add Property
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddPropertyDialog;
