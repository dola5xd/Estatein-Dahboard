import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export type clients = {
  _id: string;
  title: string;
  joinDate: string;
  herf: string;
  domin: string;
  category: string;
  message: string;
  publishedAt: number;
};

export const columns: ColumnDef<clients>[] = [
  {
    accessorKey: "title",
    header: "Client name",
  },
  {
    accessorKey: "publishedAt",
    header: "Join date",
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt") as string;
      return <Badge variant="secondary">{publishedAt}</Badge>;
    },
  },
  {
    accessorKey: "herf",
    header: "Herf",
    cell: ({ row }) => {
      const herf = row.getValue("herf") as string;
      return <Badge variant={"secondary"}>{herf}</Badge>;
    },
  },
  {
    accessorKey: "domin",
    header: "Domin",
    cell: ({ row }) => {
      const domin = row.getValue("domin") as string;
      return <Badge variant={"secondary"}>{domin}</Badge>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <Badge variant={"secondary"}>{category}</Badge>;
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return message.length > 50 ? message.slice(0, 50) + "..." : message;
    },
  },
];
