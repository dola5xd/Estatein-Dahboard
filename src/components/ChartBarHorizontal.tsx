"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePropertiesPrice } from "@/hooks/useQueries";

const chartConfig = {
  price: {
    label: "Properties",
    color: "var(--color-primary-800)",
  },
} satisfies ChartConfig;

const priceRanges = [
  { label: "$1M–2M", min: 1_000_000, max: 2_000_000 },
  { label: "$2M–4M", min: 2_000_000, max: 4_000_000 },
  { label: "$4M–6M", min: 4_000_000, max: 6_000_000 },
  { label: "$6M–8M", min: 6_000_000, max: 8_000_000 },
  { label: "$8M+", min: 8_000_000, max: Infinity },
];

export function ChartBarHorizontal() {
  const { data: properties = [] } = usePropertiesPrice();

  const chartData = useMemo(() => {
    return priceRanges.map(({ label, min, max }) => {
      const count = properties.filter(
        (prop) => prop.price >= min && prop.price < max
      ).length;
      return { range: label, count };
    });
  }, [properties]);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 20 }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              type="category"
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-price)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Price ranges from recent listings
        </div>
        <div className="leading-none text-muted-foreground">
          Based on all available properties
        </div>
      </CardFooter>
    </Card>
  );
}
