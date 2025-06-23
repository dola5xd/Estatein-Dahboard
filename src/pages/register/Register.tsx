import { useAuthMutation } from "@/hooks/useAuthMutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router";
import logo from "@/assets/logo.svg";
import { Helmet } from "react-helmet";

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[0-9]/, "Password must include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function Register() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const { mutation, googleSignIn } = useAuthMutation("register");

  return (
    <>
      <Helmet>
        <title>Register – Estatein Dashboard</title>
        <meta
          name="description"
          content="Create your Estatein account to manage properties, view client ratings, and access your personalized real estate dashboard."
        />
        <link
          rel="canonical"
          href="https://estatein-dahboard.vercel.app/register"
        />
        <meta property="og:title" content="Register – Estatein Dashboard" />
        <meta
          property="og:description"
          content="Join Estatein to manage your real estate listings, track client feedback, and grow your property business."
        />
        <meta
          property="og:url"
          content="https://estatein-dahboard.vercel.app/register"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main className="flex flex-row-reverse min-h-screen bg-background text-foreground">
        <section className="hidden w-1/2 h-screen md:block">
          <img
            src="https://estatein-nu.vercel.app/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg43d2dmz%2Fproduction%2F7389e1a9b220fa884f157ce12d9f7bd38f7d1fe5-1080x1350.jpg&w=1080&q=75"
            alt="signup visual"
            className="object-cover w-full h-full opacity-90 brightness-95 dark:brightness-75"
          />
        </section>

        <section className="flex flex-col items-center justify-center w-full px-6 gap-y-7 md:w-1/2">
          <img src={logo} alt="logo" />
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Sign up to get started</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    mutation.mutate(values)
                  )}
                  className="space-y-5"
                >
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="Adel Yasser"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="new-password"
                            placeholder="*********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="new-password"
                            placeholder="*********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    Sign Up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={googleSignIn}
                    className="flex items-center justify-center w-full gap-2"
                  >
                    Sign up with Google
                  </Button>

                  <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Log in
                    </Link>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}

export default Register;
