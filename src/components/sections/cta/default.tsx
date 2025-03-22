import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Glow from "@/components/ui/glow";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/db/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import React from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function CTA() {
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
    }, 10000);
  }, [success]);

  const handleSubscribe = async (data: LoginFormValues) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, "password");
      setSuccess(true);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as AuthError;
        if (firebaseError.message === "auth/email-already-in-use") {
          toast("Email already in use.");
        } else if (firebaseError.message === "auth/weak-password") {
          toast("Password is too weak.");
        } else {
          toast("An error occurred. Please try again later.");
          console.error("Registration error:", error);
        }
      } else {
        toast("An unexpected error occurred.");
      }
    }
  };

  return (
    <Section className="relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-6 text-center sm:gap-10">
        <h2 className="text-3xl font-semibold sm:text-5xl">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-muted-foreground">
          You will get to hear from us every day, with latest features and news.
        </p>
        <div className="flex flex-col items-center gap-4 self-stretch">
          {!success && (
            <div className="flex w-full max-w-[420px] gap-2 items-center">
              <Input
                type="email"
                placeholder="Email address"
                className="grow border-brand/20 bg-foreground/10 z-50"
                {...register("email")}
              />

              <Button
                variant="default"
                size="default"
                className="z-50"
                onClick={handleSubmit(handleSubscribe)}
                asChild
              >
                <Link href="/">Subscribe</Link>
              </Button>
            </div>
          )}
          {success && (
            <div>
              <p className="text-green-500">
                Thank you for subscribing! We will reach out to you on your
                email!
              </p>
            </div>
          )}
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            We will never spam you, only send you relevant content.
          </p>
        </div>
        <Glow
          variant="center"
          className="scale-y-[10%] w-1/2 opacity-30 sm:scale-y-[15%] md:scale-y-[25%]"
        />
      </div>
    </Section>
  );
}
