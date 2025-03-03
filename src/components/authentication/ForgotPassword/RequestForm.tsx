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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthError, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/db/firebase";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function RequestForm({
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

  const handleRequest = async (data: LoginFormValues) => {
    try {
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?mode=resetPassword`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
      toast("Password reset email sent. Check your inbox.");
      // Optionally, redirect to login after sending the email:
      router.push("/login");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as AuthError;

        if (firebaseError.message === "auth/invalid-email") {
          toast("Invalid email address.");
        } else if (firebaseError.message === "auth/user-not-found") {
          toast("User not found.");
        } else {
          toast("An error occurred. Please try again later.");
          console.error("Forgot Password error:", error);
        }
      } else {
        toast("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot your Password?</CardTitle>
          <CardDescription>
            Enter your email to request reset link
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
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit(handleRequest)}
              >
                Request to Reset
              </Button>
              <Link
                href="/login"
                type="submit"
                className="w-full text-center text-xs underline-offset-4 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
