import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { urlFor } from "@/lib/sanityClient";
import { Star, StarHalf, StarOff } from "lucide-react";

export type Rating = {
  _id: string;
  name: string;
  message: string;
  location: string;
  rating: number;
  title: string;
  avatar: {
    asset: { _ref: string };
  };
};

export const columns: ColumnDef<Rating>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as { asset: { _ref: string } };

      return (
        <div className="flex flex-col gap-y-1">
          <div className="flex">
            <Avatar className="h-16 w-16 border">
              <AvatarImage
                className="object-cover object-top"
                src={urlFor(avatar).width(64).height(64).format("webp").url()}
              />
              <AvatarFallback>IMG</AvatarFallback>
            </Avatar>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const desc = row.getValue("message") as string;
      return desc.length > 100 ? desc.slice(0, 50) + "..." : desc;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5 ? 1 : 0;
      const empty = 5 - full - half;

      return (
        <div className="flex items-center gap-1">
          <span className="font-medium text-base">{rating.toFixed(1)}</span>
          <div className="flex gap-0.5">
            {[...Array(full)].map((_, i) => (
              <Star
                key={`full-${i}`}
                className="w-4 h-4 text-yellow-500 fill-yellow-500"
              />
            ))}
            {[...Array(half)].map((_, i) => (
              <StarHalf key={`half-${i}`} className="w-4 h-4 text-yellow-500" />
            ))}
            {[...Array(empty)].map((_, i) => (
              <StarOff key={`off-${i}`} className="w-4 h-4 text-gray-400" />
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
];
