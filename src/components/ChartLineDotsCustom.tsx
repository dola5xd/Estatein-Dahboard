import { useMemo } from "react";
import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useClientsDates } from "@/hooks/useQueries";

const chartConfig = {
  desktop: {
    label: "Clients",
    color: "var(--color-primary-800)",
  },
} satisfies ChartConfig;

function getLast10YearsStats(clients: { publishedAt: number }[]) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 9;

  const stats = Array.from({ length: 10 }, (_, i) => {
    const year = startYear + i;
    return { year: year.toString(), desktop: 0 };
  });

  for (const client of clients) {
    const year = client.publishedAt;
    const index = year - startYear;
    if (!isNaN(index) && index >= 0 && index < 10) {
      stats[index].desktop += 1;
    }
  }

  return stats;
}

export function ChartLineDotsCustom() {
  const { data: clients = [] } = useClientsDates();

  const chartData = useMemo(() => getLast10YearsStats(clients), [clients]);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => (
                <GitCommitVertical
                  key={payload.year}
                  x={cx - 12}
                  y={cy - 12}
                  width={24}
                  height={24}
                  fill="hsl(var(--background))"
                  stroke="var(--color-desktop)"
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">Signups over a decade</div>
        <div className="text-muted-foreground">
          Client count from {new Date().getFullYear() - 9} to{" "}
          {new Date().getFullYear()}
        </div>
      </CardFooter>
    </Card>
  );
}
