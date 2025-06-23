import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartLineDotsCustom } from "@/components/ChartLineDotsCustom";
import { ChartBarHorizontal } from "@/components/ChartBarHorizontal";
import { TopPropertiesCard } from "@/components/TopPropertiesCard";
import { LatestRatings } from "@/components/LatestRatings";
import { LatestClientsCard } from "@/components/LatestClientsCard";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Dashboard – Estatein</title>
        <meta
          name="description"
          content="Visualize client signups, pricing trends, top properties, and latest activity in your Estatein real estate dashboard."
        />
        <link rel="canonical" href="https://estatein-dahboard.vercel.app/" />
        <meta property="og:title" content="Estatein Dashboard" />
        <meta
          property="og:description"
          content="Track signups, property prices, client ratings, and more from your modern real estate dashboard."
        />
        <meta
          property="og:url"
          content="https://estatein-dahboard.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <ScrollArea
        className="h-[70vh] w-full p-2 gap-y-4"
        scrollHideDelay={1000}
      >
        <div className="grid grid-cols-1 grid-rows-1 gap-4 md:grid-cols-2">
          <Card className="col-span-1 ">
            <CardHeader>
              <CardTitle>Client Signups</CardTitle>
              <CardDescription>Past 10 Years</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartLineDotsCustom />
            </CardContent>
          </Card>

          <Card className="col-span-1 row-span-1 ">
            <CardHeader>
              <CardTitle>Price Distribution</CardTitle>
              <CardDescription>Grouped by price brackets</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartBarHorizontal />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Top 3 Most Expensive Properties</CardTitle>
              <CardDescription>
                Based on current price in descending order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopPropertiesCard />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5 Latest Client Ratings</CardTitle>
              <CardDescription>
                Sorted by newest first — see what clients say
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LatestRatings />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently 5 Clients</CardTitle>
              <CardDescription>
                Most recently added clients with category and message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LatestClientsCard />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
