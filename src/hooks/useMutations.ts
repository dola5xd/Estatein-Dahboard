import { useMutation } from "@tanstack/react-query";
import { useSanityClient } from "@/hooks/useSanityClient";
import type {
  SanityDocumentStub,
  SanityImageAssetDocument,
} from "@sanity/client";
import { nanoid } from "nanoid";
import type { SanityAsset } from "@sanity/image-url/lib/types/types";
import { queryClient } from "@/lib/queryClient";

// Client mutations
export const useAddClient = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (newDoc: SanityDocumentStub) => {
      return sanity.create(newDoc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["latestClients"] });
      queryClient.invalidateQueries({ queryKey: ["clientsDates"] });
    },
    onError: (error) => {
      console.error("Sanity error:", error);
    },
  });
};

export const useDeleteClient = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (clientID: string) => {
      return sanity.delete(clientID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["latestClients"] });
      queryClient.invalidateQueries({ queryKey: ["clientsDates"] });
    },
    onError: (error) => {
      console.error("Sanity error:", error);
    },
  });
};

export const useEditClient = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (updatedDoc: SanityDocumentStub & { _id: string }) => {
      return sanity.patch(updatedDoc._id).set(updatedDoc).commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["latestClients"] });
      queryClient.invalidateQueries({ queryKey: ["clientsDates"] });
    },
    onError: (error) => {
      console.error("Edit client error:", error);
    },
  });
};

// Property mutations
export const useAddProperty = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (data: SanityDocumentStub) => {
      const images = await Promise.all(
        data.images.map(async (file: File) => {
          const asset = await sanity.assets.upload("image", file, {
            filename: file.name,
          });
          return {
            _type: "image",
            _key: nanoid(),
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          };
        })
      );

      return sanity.create({ ...data, images });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", "propertiesShorts", "propertiesPrice"],
      });
    },
  });
};

export const useDeleteProperty = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const property = await sanity.getDocument(propertyId);

      const imageRefs =
        property?.images
          ?.map((img: SanityImageAssetDocument) => img.asset?._ref)
          .filter(Boolean) || [];

      await sanity.delete(propertyId);

      await Promise.allSettled(
        imageRefs.map((ref: string) => sanity.delete(ref))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", "propertiesShorts", "propertiesPrice"],
      });
    },
    onError: (error) => {
      console.error("Sanity delete error:", error);
    },
  });
};

export const useEditProperty = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (
      doc: SanityDocumentStub & { images: (File | SanityAsset)[] }
    ) => {
      const uploadedImages = await Promise.all(
        doc.images.map(async (img) => {
          if (img instanceof File) {
            const asset = await sanity.assets.upload("image", img, {
              filename: img.name,
            });

            return {
              _type: "image",
              _key: asset._id,
              asset: {
                _type: "reference",
                _ref: asset._id,
              },
            };
          }

          return img;
        })
      );

      return sanity
        .patch(doc._id)
        .set({ ...doc, images: uploadedImages })
        .commit();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["propertiesShorts"] });
      queryClient.invalidateQueries({ queryKey: ["propertiesPrice"] });
    },

    onError: (error) => {
      console.error("Edit property error:", error);
    },
  });
};

// Rating mutations
export const useAddRating = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (data: SanityDocumentStub) => {
      const avatarAsset = await sanity.assets.upload("image", data.avatar, {
        filename: data.avatar.name,
      });

      const doc = {
        ...data,
        avatar: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: avatarAsset._id,
          },
        },
      };

      return sanity.create(doc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
  });
};

export const useDeleteRating = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (ratingId: string) => {
      const rating = await sanity.getDocument(ratingId);
      const avatarRef: string | undefined = rating?.avatar?.asset?._ref;

      await sanity.delete(ratingId);

      if (avatarRef) {
        await sanity.delete(avatarRef);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: (error) => {
      console.error("Sanity delete error:", error);
    },
  });
};

export const useEditRating = () => {
  const sanity = useSanityClient();

  return useMutation({
    mutationFn: async (
      data: SanityDocumentStub & { avatar?: File | SanityAsset }
    ) => {
      let avatarRef = data.avatar;

      if (data.avatar instanceof File) {
        const uploaded = await sanity.assets.upload("image", data.avatar, {
          filename: data.avatar.name,
        });

        avatarRef = {
          _type: "image",
          _key: uploaded._id,
          asset: {
            _type: "reference",
            _ref: uploaded._id,
          },
        };
      }

      const updateDoc = {
        ...data,
        avatar: avatarRef,
      };

      return sanity.patch(data._id).set(updateDoc).commit();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },

    onError: (err) => {
      console.error("Failed to edit rating:", err);
    },
  });
};
