"use client";

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
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/db/firebase";
import {
  AuthError,
  checkActionCode,
  confirmPasswordReset,
} from "firebase/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function ResetForm({
  className,
  token,
}: {
  className?: string;
  token: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleReset = async (data: LoginFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast("Passwords do not match.");
      return;
    }

    try {
      const info = await checkActionCode(auth, token);

      if (info.data.email) {
        await confirmPasswordReset(auth, token, data.newPassword);
        router.push("/login");
      } else {
        toast("Invalid token or link. Please request a new password reset.");
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as AuthError;

        toast(firebaseError?.message);
        console.error("Password reset error:", error);
      } else {
        toast("An unexpected error occurred.");
      }
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset your Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your account credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="new-password">New Password</Label>
                </div>
                <Input
                  id="new-password"
                  type="password"
                  {...register("newPassword")}
                  required
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("confirmPassword")}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit(handleReset)}
              >
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
