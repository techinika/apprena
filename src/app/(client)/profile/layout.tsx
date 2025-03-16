import AuthNav from "@/components/client/navigation/AuthNav";
import { SidebarNav } from "@/components/client/profile/sidebar-nav";
import FooterSection from "@/components/sections/footer/default";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and Edit Profile.",
};

const sidebarNavItems = [
  {
    title: "Personal Info",
    href: "/profile",
  },
  {
    title: "Preferences & Interests",
    href: "/profile/preferences",
  },
  {
    title: "Entitlements",
    href: "/profile/entitlements",
  },
  {
    title: "Organizations",
    href: "/profile/organizations",
  },
  {
    title: "Appearance Settings",
    href: "/profile/appearance",
  },
  {
    title: "Billing Settings",
    href: "/profile/billing",
  },
  {
    title: "Securitu Settings",
    href: "/profile/security",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 pb-16 md:block">
        <AuthNav />
        <div className="space-y-0.5 size">
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6 size" />
        <div className="size flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 w-full">{children}</div>
        </div>
        <FooterSection />
      </div>
    </ProtectedRoute>
  );
}
