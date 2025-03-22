export type ContactInformation = {
  name: string; // Name of the contact person
  title: string; // Job title of the contact person
  email: string; // Email address
  phone: string; // Phone number
};

export type Address = {
  street: string; // Street address
  city: string; // City
  state: string; // State or province
  postalCode: string; // Postal code or ZIP code
  country: string; // Country
};

export type SubscriptionPlanDetails = {
  featuresIncluded: string[]; // List of features in the plan
  userLimit: number; // The number of users allowed in the plan
};

export type BillingInformation = {
  billingContact: ContactInformation; // Contact details for the billing person
  billingAddress: Address; // Billing address
  paymentMethod: "credit_card" | "bank_transfer" | "paypal" | "other"; // Payment method
  accountNumber?: string; // Optional account number (if applicable)
};

export type InstitutionUser = {
  id: string; // Unique identifier for the user
  name: string; // Name of the user
  email: string; // Email address of the user
  role: "admin" | "teacher" | "student" | "support" | "manager" | "other"; // Role of the user
  joinedAt: string; // Date when the user joined the institution
  status: "active" | "inactive" | "suspended"; // User status
};

export type InstitutionRole = {
  roleName: string; // Role name (e.g., admin, teacher)
  permissions: string[]; // List of permissions for the role (e.g., "manage_users", "view_reports")
};

export type SubscriptionDetails = {
  subscriptionStatus: "active" | "inactive" | "suspended"; // Current status of the subscription
  subscriptionType: "basic" | "premium" | "enterprise"; // Subscription type
  startDate: string; // Subscription start date
  renewalDate: string; // Subscription renewal date
  paymentFrequency: "monthly" | "quarterly" | "annually"; // Payment frequency
  planDetails?: SubscriptionPlanDetails; // Optional details on the subscription plan
};

export type Institution = {
  id: string;
  name: string;
  registrationNumber: string;
  institutionType:
    | "corporation"
    | "non-profit"
    | "educational"
    | "government"
    | "other";
  industry: string;
  website: string;
  contactInformation: {
    primaryContact: ContactInformation;
    address: Address;
  };
  billingInformation: BillingInformation;
  subscriptionDetails: SubscriptionDetails;
  users: InstitutionUser[];
  roles?: InstitutionRole[];
  createdAt: string;
  updatedAt: string;
  organizationAdmins: string[];
  organizationOwner: string;
};
