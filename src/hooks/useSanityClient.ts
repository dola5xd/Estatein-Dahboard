import { useMemo } from "react";
import { getSanityClient } from "@/lib/sanityClient";
import { useCurrentUser } from "@/hooks/useQueries";

export const useSanityClient = () => {
  const { data: user } = useCurrentUser();

  const client = useMemo(() => {
    return getSanityClient(user?.token ?? null);
  }, [user?.token]);

  return client;
};
