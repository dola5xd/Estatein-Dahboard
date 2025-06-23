import { useQuery } from "@tanstack/react-query";
import { useSanityClient } from "@/hooks/useSanityClient";
import {
  clientsDateQuery,
  clientsQuery,
  latestClientsQuery,
  propertyPriceQuery,
  propertyQuery,
  ratingQuery,
  shortPropertyQuery,
} from "@/lib/Queries";
import type { Property } from "@/components/Properties/PropertyColumns";
import type { clients } from "@/components/clients/ClientColumns";
import type { Rating } from "@/components/Ratings/RatingColumns";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateAvatar } from "./useAuthMutation";
import toast from "react-hot-toast";

export const useProperties = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["properties"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () => sanity.fetch(propertyQuery) as Promise<Property[]>,
  });
};

export const usePropertiesPrice = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["propertiesPrice"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () =>
      sanity.fetch(propertyPriceQuery) as Promise<Property[]>,
  });
};

export const usePropertiesShorts = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["propertiesShorts"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () =>
      sanity.fetch(shortPropertyQuery) as Promise<Property[]>,
  });
};

export const useClients = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["clients"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () => sanity.fetch(clientsQuery) as Promise<clients[]>,
  });
};

export const useClientsDates = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["clientsDates"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () => sanity.fetch(clientsDateQuery) as Promise<clients[]>,
  });
};

export const useLatestClientsQuery = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["latestClients"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () => sanity.fetch(latestClientsQuery) as Promise<clients[]>,
  });
};

export const useRatings = () => {
  const sanity = useSanityClient();
  return useQuery({
    queryKey: ["ratings"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () => sanity.fetch(ratingQuery) as Promise<Rating[]>,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    staleTime: 2 * 60 * 60 * 1000,
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("No user");

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          admin: false,
          token: null,
          avatar: user.photoURL || generateAvatar(user.displayName!),
          createdAt: serverTimestamp(),
        });

        const docSnap = await getDoc(userRef);
        if (!docSnap.exists())
          toast.error("Try another email please we will fix it soon!");
        return docSnap.data();
      }

      return docSnap.data();
    },
  });
};
