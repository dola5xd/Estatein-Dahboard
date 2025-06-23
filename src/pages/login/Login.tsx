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
      <title>Login — Estatein Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta
        name="description"
        content="Secure login to access your Estatein real estate dashboard."
      />
      <link
        rel="canonical"
        href="https://estatein-dashboard.vercel.app/login"
      />

      <main className="flex min-h-screen bg-background text-foreground">
        <section className="hidden md:block w-1/2 h-screen">
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
                  className="space-y-5"
                  autoComplete="off"
                >
                  {(["email", "password"] as const).map((field) => (
                    <FormField
                      key={field}
                      name={field}
                      control={form.control}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>
                            {field === "email" ? "Email" : "Password"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...f}
                              placeholder={
                                field === "email"
                                  ? "you@example.com"
                                  : "********"
                              }
                              type={field === "password" ? "password" : "text"}
                              autoComplete={
                                field === "password" ? "new-password" : "off"
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

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
                    className="w-full flex justify-center gap-2"
                  >
                    Sign in with Google
                  </Button>

                  <p className="text-sm text-center mt-4">
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
      </main>
    </>
  );
}

export default Login;
