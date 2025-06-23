import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { urlFor } from "@/lib/sanityClient";
import { Badge } from "../ui/badge";

export type Property = {
  _id: string;
  name: string;
  location: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  keyFeatures: string[];
  amenities: string[];
  images: {
    asset: { _ref: string };
  }[];
};

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "images",
    header: "",
    cell: ({ row }) => {
      const images = row.getValue("images") as { asset: { _ref: string } }[];

      return (
        <div className="flex flex-col gap-y-1">
          <div className="flex">
            {images.slice(0, 4).map((img, i) => (
              <Avatar key={i} className="h-8 w-8 border">
                <AvatarImage
                  src={urlFor(img).width(64).height(64).format("webp").url()}
                />
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>
            ))}
          </div>
          {images.length > 4 && (
            <div className="flex">
              {images.slice(4, 8)?.map((img, i) => (
                <Avatar key={i} className="h-8 w-8 border">
                  <AvatarImage
                    src={urlFor(img).width(64).height(64).format("webp").url()}
                  />
                  <AvatarFallback>IMG</AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Property Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      return desc.length > 100 ? desc.slice(0, 50) + "..." : desc;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    },
  },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ row }) => {
      const area = row.getValue("area") as number;
      return `${area.toLocaleString()} sqft`;
    },
  },
  {
    accessorKey: "bedrooms",
    header: "Bedrooms",
  },
  {
    accessorKey: "bathrooms",
    header: "Bathrooms",
  },

  {
    accessorKey: "keyFeatures",
    header: "Key Features",
    cell: ({ row }) => {
      const features = row.getValue("keyFeatures") as string[];
      return (
        <div className="flex space-x-2">
          {features?.map((feature, i) => (
            <Badge key={i} variant={"outline"}>
              {feature}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "amenities",
    header: "Amenities",
    cell: ({ row }) => {
      const amenities = row.getValue("amenities") as string[];
      return (
        <div className="flex space-x-2">
          {amenities.map((amenity, i) => (
            <Badge key={i} className="bg-primary-900 text-white">
              {amenity}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
