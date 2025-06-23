import { Star, User, MapPin, MessageSquareText } from "lucide-react";
import { useRatings } from "@/hooks/useQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Loading from "./loading";
import { urlFor } from "@/lib/sanityClient";

export function LatestRatings() {
  const { data, isLoading } = useRatings();
  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      {data!.map((rating) => (
        <Card key={rating._id} className="p-4">
          <div className="flex gap-4 items-start">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage
                src={
                  rating.avatar
                    ? urlFor(rating.avatar).format("webp").url()
                    : ""
                }
                className="object-cover object-top"
                alt={rating.name}
              />
              <AvatarFallback>
                {rating.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <CardHeader className="p-0">
                <CardTitle className="text-base">{rating.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {rating.name}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {rating.location}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                  {Array.from({ length: 5 - rating.rating }).map((_, i) => (
                    <Star
                      key={`empty-${i}`}
                      className="h-4 w-4 text-gray-300"
                    />
                  ))}
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquareText className="h-4 w-4 mt-0.5" />
                  <span>{rating.message}</span>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
