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
  signInWithEmailAndPassword,
  AuthError,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, googleProvider } from "@/db/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function UserAuthForm({
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

  const handleLogin = async (data: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
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
                  displayName: user.displayName || "Anonymous User",
                  email: user.email,
                  photoURL: user.photoURL || "",
                  phoneNumber: user.phoneNumber || "",
                  dateOfBirth: null,
                  gender: null,
                  bio: "",
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
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as AuthError;

        if (firebaseError.message === "auth/user-not-found") {
          toast("User not found");
        } else if (firebaseError.message === "INVALID_LOGIN_CREDENTIALS") {
          toast("Incorrect credentials");
        } else {
          toast("An error occurred. Please try again later.");
          console.error("Login error:", error);
        }
      } else {
        toast("An unexpected error occurred.");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = result.user;
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
                  displayName: user.displayName || "Anonymous User",
                  email: user.email,
                  photoURL: user.photoURL || "",
                  phoneNumber: user.phoneNumber || "",
                  dateOfBirth: null,
                  gender: null,
                  bio: "",
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
      console.log("User signed in:", userData);
      router.push("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
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
                onClick={handleSubmit(handleLogin)}
              >
                Login
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
                Login with Google
              </Button>
            </div>
            <div className="text-center text-sm py-3">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
