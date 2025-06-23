import { useMutation } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { queryClient } from "@/lib/queryClient";

const provider = new GoogleAuthProvider();

type formData = {
  name?: string;
  email: string;
  password: string;
};

export function generateAvatar(name: string) {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
}

export function useAuthMutation(type: "login" | "register") {
  const navigate = useNavigate();

  const createUserDocument = async (
    uid: string,
    email: string,
    name: string,
    photoURL?: string
  ) => {
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      displayName: name,
      admin: false,
      token: null,
      avatar: photoURL || generateAvatar(name),
      createdAt: new Date(),
    });
  };

  const mutation = useMutation({
    mutationFn: async (data: formData) => {
      if (type === "login") {
        return await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      } else {
        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        const avatar = generateAvatar(data.name!);
        await updateProfile(res.user, {
          displayName: data.name,
          photoURL: avatar,
        });

        await createUserDocument(
          res.user.uid,
          res.user.email!,
          data.name!,
          avatar
        );
        return res;
      }
    },
    onSuccess: () => {
      toast.success(
        type === "login" ? "Logged in successfully!" : "Account created!"
      );
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/");
    },
    onError: () => {
      toast.error(
        type === "login" ? "Invalid credentials" : "Failed to create account"
      );
    },
  });

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (type === "register") {
        await createUserDocument(
          result.user.uid,
          result.user.email!,
          result.user.displayName || "User",
          result.user.photoURL || undefined
        );
      }
      toast.success("Signed in with Google!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed");
    }
  };

  return { mutation, googleSignIn };
}

export const useUserLogout = function () {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
      navigate("/login");
    },
    onSuccess: () => toast.success("User log out sucessfully!"),
    onError: () => toast.error("Google sign-in failed"),
  });
};

export function useUserUpdate() {
  return useMutation({
    mutationFn: async ({
      uid,
      updates,
    }: {
      uid: string;
      updates: Partial<{ displayName: string; avatar: string }>;
    }) => {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, updates);
      return updates;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log("error: ", error);
      toast.error("Failed to update profile");
    },
  });
}
