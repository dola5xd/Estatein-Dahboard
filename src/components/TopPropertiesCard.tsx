"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePropertiesShorts } from "@/hooks/useQueries";
import Loading from "./loading";
import { urlFor } from "@/lib/sanityClient";

import { DollarSign, Ruler, Bed, Bath, MapPin } from "lucide-react";

export function TopPropertiesCard() {
  const { data, isLoading } = usePropertiesShorts();
  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      {data!.map((prop) => (
        <Card
          key={prop._id}
          className="flex flex-col py-0 overflow-hidden md:flex-row"
        >
          {prop.images?.[0] && (
            <div className="w-full h-48 md:w-1/2 md:h-auto">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage
                  src={urlFor(prop.images[0]).format("webp").url()}
                  alt={prop.name}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className="px-4 py-4 md:space-y-2 md:w-1/2 md:px-0 md:self-center">
            <CardHeader className="p-0 pb-2">
              <CardTitle>{prop.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {prop.location}
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />${prop.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                {prop.area} sqft
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4" />
                {prop.bedrooms} beds
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4" />
                {prop.bathrooms} baths
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
