"use client";

import { User, MessageSquareText, Link2, CalendarDays } from "lucide-react";
import { useLatestClientsQuery } from "@/hooks/useQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Loading from "./loading";

export function LatestClientsCard() {
  const { data, isLoading } = useLatestClientsQuery();
  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      {data!.map((client) => (
        <Card key={client._id} className="p-4">
          <div className="flex gap-4 items-start">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage
                src=""
                alt={client.title}
                className="object-cover object-top"
              />
              <AvatarFallback>
                {client.domin?.charAt(0).toUpperCase() ?? "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <CardHeader className="p-0">
                <CardTitle className="text-base">{client.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {client.category}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {client.publishedAt}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <a
                    href={client.herf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {client.domin}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquareText className="h-4 w-4 mt-0.5" />
                  <span>{client.message}</span>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
