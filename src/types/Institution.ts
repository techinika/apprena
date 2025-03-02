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
  id: string; // Unique identifier for the institution
  name: string; // Name of the institution
  registrationNumber: string; // Registration or tax number for the institution
  legalType:
    | "corporation"
    | "non-profit"
    | "educational"
    | "government"
    | "other"; // Legal type of the institution
  industry: string; // Industry or sector of the institution (e.g., Education, Healthcare)
  website: string; // URL to the institution's website
  contactInformation: {
    primaryContact: ContactInformation; // Primary contact for the institution
    address: Address; // Address of the institution
  };
  billingInformation: BillingInformation; // Billing details for the institution
  subscriptionDetails: SubscriptionDetails; // Subscription details for the institution
  users: InstitutionUser[]; // List of users within the institution
  roles?: InstitutionRole[]; // Optional roles within the institution
  createdAt: string; // Date when the institution was created
  updatedAt: string; // Last update timestamp
};
