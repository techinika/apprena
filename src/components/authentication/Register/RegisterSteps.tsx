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
import Link from "next/link";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  AuthError,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, googleProvider } from "@/db/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { APP } from "@/variables/globals";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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
      const userData = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userData?.user;
      const userRef = doc(db, "profile", user?.uid ?? "");

      const userProfile = {
        uid: user?.uid,
        displayName: user.displayName || "Anonymous User",
        email: user.email,
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: null,
        gender: null,
        bio: "",
        score: 0,
        scoreInLastHour: 0,
        referrals: 0,
        referralsInLastMonth: 0,
        badges: 0,
        badgesInLastMonth: 0,
        communityContributions: 0,
        communityContributionsInLastMonth: 0,
        institutionMemberships: 0,
        institutionMembershipsInLastMonth: 0,
        coursesTaken: 0,
        coursesTakenInLastMonth: 0,
        blogsRead: 0,
        blogsReadInLastMonth: 0,
        mostActiveTimes: "NA",
        nationality: "",
        preferredLanguage: "English",

        // Account Details
        role: "user",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        status: "active",

        // Contact & Address
        address: {
          country: "",
          city: "",
          state: "",
          zipCode: "",
          physicalAddress: "",
        },

        // Social & Online Presence
        socialLinks: {
          linkedin: "",
          github: "",
          twitter: "",
          website: "",
        },

        // Preferences & Interests
        interests: [],
        preferredNotificationMethod: "email",

        // Security & Authentication
        twoFactorAuthEnabled: false,

        // Subscription & Financials (if applicable)
        subscriptionPlan: "free",
        billingInfo: {
          address: "",
          paymentMethod: "",
          transactionHistory: [],
        },
      };

      setDoc(userRef, userProfile)
        .then(async () => {
          console.log("User profile created with ID: ", user?.uid);
        })
        .catch((error) => {
          console.error("Error creating user profile:", error);
        });

      router.push("/login");
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

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          const userRef = doc(db, "profile", uid);
          getDoc(userRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                console.log("User profile exists with ID: ", uid);
              } else {
                const userProfile = {
                  uid,
                  displayName: user.displayName ?? "Anonymous User",
                  email: user.email,
                  photoURL: user.photoURL ?? "",
                  phoneNumber: user.phoneNumber ?? "",
                  dateOfBirth: null,
                  gender: null,
                  bio: "",
                  nationality: "",
                  score: 0,
                  scoreInLastHour: 0,
                  referrals: 0,
                  referralsInLastMonth: 0,
                  badges: 0,
                  badgesInLastMonth: 0,
                  communityContributions: 0,
                  communityContributionsInLastMonth: 0,
                  institutionMemberships: 0,
                  institutionMembershipsInLastMonth: 0,
                  coursesTaken: 0,
                  coursesTakenInLastMonth: 0,
                  blogsRead: 0,
                  blogsReadInLastMonth: 0,
                  mostActiveTimes: "NA",
                  preferredLanguage: "English",

                  role: "user",
                  createdAt: serverTimestamp(),
                  lastLogin: serverTimestamp(),
                  status: "active",
                  address: {
                    country: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    physicalAddress: "",
                  },
                  socialLinks: {
                    linkedin: "",
                    github: "",
                    twitter: "",
                    website: "",
                  },
                  interests: [],
                  preferredNotificationMethod: "email",
                  twoFactorAuthEnabled: false,
                  subscriptionPlan: "free",
                  billingInfo: {
                    address: "",
                    paymentMethod: "",
                    transactionHistory: [],
                  },
                };

                setDoc(userRef, userProfile)
                  .then(() => {
                    console.log("User profile created with ID: ", uid);
                  })
                  .catch((error) => {
                    console.error("Error creating user profile:", error);
                  });
              }
            })
            .catch((err) => {
              console.error("Error checking for user profile", err);
            });
        }
      });
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
