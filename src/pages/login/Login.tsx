import { Helmet } from "react-helmet";
import { useAuthMutation } from "@/hooks/useAuthMutation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function Login() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const { mutation, googleSignIn } = useAuthMutation("login");

  return (
    <>
      <Helmet>
        <title>Login — Estatein Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Secure login to access your Estatein real estate dashboard."
        />
        <link
          rel="canonical"
          href="https://estatein-dahboard.vercel.app/login"
        />
      </Helmet>
      <main className="flex min-h-screen bg-background text-foreground">
        <section className="hidden w-1/2 h-screen md:block">
          <img
            src="https://estatein-nu.vercel.app/_next/image?url=%2Fimages%2FHero-img.png&w=1080&q=75"
            alt="signup visual"
            className="object-cover w-full h-full opacity-90 brightness-95 dark:brightness-75"
          />
        </section>

        <section className="flex flex-col items-center justify-center w-full px-6 gap-y-7 md:w-1/2">
          <img src={logo} alt="logo" />

          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your dashboard</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    mutation.mutate(values)
                  )}
                  autoComplete="off"
                  className="space-y-5"
                >
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
                            type="password"
                            placeholder="********"
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
                    Sign In
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={googleSignIn}
                    className="flex items-center justify-center w-full gap-2"
                  >
                    Sign in with Google
                  </Button>

                  <p className="mt-4 text-sm text-center">
                    Don’t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </main>{" "}
    </>
  );
}

export default Login;
