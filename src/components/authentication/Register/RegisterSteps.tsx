import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/db/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { APP } from "@/variables/globals";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function RegisterSteps({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleRegister = async (data: LoginFormValues) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      router.push("/login");
    } catch (error: { message: string; code: number }) {
      if (error.code === "auth/email-already-in-use") {
        toast("Email already in use.");
      } else if (error.code === "auth/weak-password") {
        toast("Password is too weak.");
      } else {
        toast("An error occurred. Please try again later.");
        console.error("Registration error:", error);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in:", user);
      router.push("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register your account</CardTitle>
          <CardDescription>
            Enter your email and password to register a new user account on{" "}
            {APP?.NAME}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit(handleRegister)}
              >
                Register
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border py-3">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(process.env);
                  signInWithGoogle();
                }}
                className="w-full"
              >
                Sign up with Google
              </Button>
            </div>
            <div className="text-center text-sm py-3">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
