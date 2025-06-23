import { type Dispatch, type SetStateAction } from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  price: z.coerce.number().min(1000).max(100_000_000),
  area: z.coerce.number().min(100).max(100_000),
  bedrooms: z.coerce.number().min(1).max(100),
  bathrooms: z.coerce.number().min(1).max(100),
  description: z.string().min(50).max(1000),
  keyFeatures: z.array(z.string().min(1)).max(50),
  amenities: z.array(z.string().min(1)).max(50),
  images: z.array(z.instanceof(File)).min(1).max(8),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
export type FieldKey = "keyFeatures" | "amenities" | "images";

export function addToArray(
  form: UseFormReturn<PropertyFormValues>,
  input: string | File,
  setInput: (val: string) => void,
  key: FieldKey,
  setPreviews: Dispatch<SetStateAction<string[]>>
) {
  if (key === "images") {
    if (!(input instanceof File)) return;

    const current = form.getValues("images");
    if (current.length >= 8) return;

    form.setValue("images", [...current, input]);
    setPreviews((prev) => [...prev, URL.createObjectURL(input)]);
  } else {
    if (typeof input !== "string" || input.trim() === "") return;

    const current = form.getValues(key);
    if (!current.includes(input)) {
      form.setValue(key, [...current, input]);
      setInput("");
    }
  }
}

export function removeFromArray(
  form: UseFormReturn<PropertyFormValues>,
  index: number,
  key: FieldKey,
  setPreviews: Dispatch<SetStateAction<string[]>>
) {
  if (key === "images") {
    const current = form.getValues("images");
    const updated = current.filter((_, i) => i !== index);
    form.setValue("images", updated);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  } else {
    const current = form.getValues(key);
    const updated = current.filter((_, i) => i !== index);
    form.setValue(key, updated);
  }
}
