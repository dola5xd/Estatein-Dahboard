import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useUserUpdate } from "@/hooks/useAuthMutation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useCurrentUser } from "@/hooks/useQueries";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  displayName: z.string().min(2, "Name is too short"),
  avatar: z.string().url("Must be a valid URL"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .or(z.literal("")) // allow empty string to skip update
    .optional(),
});

function Settings() {
  const { data: user } = useCurrentUser();
  const updateUser = useUserUpdate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      avatar: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        avatar: user.avatar || "",
        password: "",
      });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    updateUser.mutate({
      uid: user.uid,
      updates: {
        displayName: values.displayName,
        avatar: values.avatar,
        ...(values.password &&
          values.password.length >= 8 && {
            password: values.password,
          }),
      },
    });
  };

  if (!user) return null;

  return (
    <section className="max-w-2xl px-4 py-5 mx-auto">
      <Card className="shadow-md p-7">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Email (read-only)</FormLabel>
                <FormControl>
                  <Input value={user.email} disabled />
                </FormControl>
              </FormItem>

              <FormField
                name="displayName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="avatar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <div className="flex items-center gap-x-4">
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <Avatar className="w-16 border rounded-full">
                        <AvatarImage
                          className="w-16 rounded-full aspect-square"
                          src={field.value}
                        />
                        <AvatarFallback className="w-16 text-sm rounded-full aspect-square">
                          No Img
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={updateUser.isPending}
                className="w-full"
              >
                {updateUser.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

export default Settings;
