import { Institution } from "@/types/Institution";

export const institutions: Institution[] = [
  {
    id: "inst001",
    name: "Tech University",
    registrationNumber: "T12345",
    legalType: "corporation",
    industry: "Education",
    website: "https://techuniversity.edu",
    contactInformation: {
      primaryContact: {
        name: "Sarah Smith",
        title: "Director of Operations",
        email: "sarah.smith@techuniversity.edu",
        phone: "+1234567890",
      },
      address: {
        street: "456 University Ave",
        city: "Tech City",
        state: "California",
        postalCode: "94000",
        country: "USA",
      },
    },
    billingInformation: {
      billingContact: {
        name: "John Doe",
        title: "Billing Manager",
        email: "john.doe@techuniversity.edu",
        phone: "+1234567891",
      },
      billingAddress: {
        street: "456 University Ave",
        city: "Tech City",
        state: "California",
        postalCode: "94000",
        country: "USA",
      },
      paymentMethod: "credit_card",
    },
    subscriptionDetails: {
      subscriptionStatus: "active",
      subscriptionType: "premium",
      startDate: "2023-01-01",
      renewalDate: "2024-01-01",
      paymentFrequency: "annually",
      planDetails: {
        featuresIncluded: [
          "custom reports",
          "priority support",
          "advanced analytics",
        ],
        userLimit: 500,
      },
    },
    users: [
      {
        id: "user001",
        name: "Alice Johnson",
        email: "alice.johnson@techuniversity.edu",
        role: "admin",
        joinedAt: "2023-01-01",
        status: "active",
      },
      {
        id: "user002",
        name: "Bob Williams",
        email: "bob.williams@techuniversity.edu",
        role: "teacher",
        joinedAt: "2023-02-15",
        status: "active",
      },
    ],
    roles: [
      {
        roleName: "admin",
        permissions: ["manage_users", "view_reports", "edit_content"],
      },
      {
        roleName: "teacher",
        permissions: ["create_content", "view_reports"],
      },
    ],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "inst002",
    name: "GreenTech Innovations",
    registrationNumber: "GT98765",
    legalType: "corporation",
    industry: "Technology",
    website: "https://greentechinnovations.com",
    contactInformation: {
      primaryContact: {
        name: "James Taylor",
        title: "Chief Executive Officer",
        email: "james.taylor@greentechinnovations.com",
        phone: "+1987654321",
      },
      address: {
        street: "789 Tech Park Rd",
        city: "Innovation City",
        state: "California",
        postalCode: "94001",
        country: "USA",
      },
    },
    billingInformation: {
      billingContact: {
        name: "Megan Adams",
        title: "Finance Manager",
        email: "megan.adams@greentechinnovations.com",
        phone: "+1987654322",
      },
      billingAddress: {
        street: "789 Tech Park Rd",
        city: "Innovation City",
        state: "California",
        postalCode: "94001",
        country: "USA",
      },
      paymentMethod: "bank_transfer",
    },
    subscriptionDetails: {
      subscriptionStatus: "inactive",
      subscriptionType: "enterprise",
      startDate: "2022-05-01",
      renewalDate: "2023-05-01",
      paymentFrequency: "annually",
      planDetails: {
        featuresIncluded: [
          "full API access",
          "unlimited integrations",
          "enterprise support",
        ],
        userLimit: 2000,
      },
    },
    users: [
      {
        id: "user003",
        name: "Carlos Garcia",
        email: "carlos.garcia@greentechinnovations.com",
        role: "admin",
        joinedAt: "2022-05-01",
        status: "active",
      },
      {
        id: "user004",
        name: "Ella Brown",
        email: "ella.brown@greentechinnovations.com",
        role: "manager",
        joinedAt: "2022-06-01",
        status: "active",
      },
    ],
    roles: [
      {
        roleName: "admin",
        permissions: ["manage_users", "view_reports", "edit_content"],
      },
      {
        roleName: "manager",
        permissions: ["manage_teams", "view_reports"],
      },
    ],
    createdAt: "2022-05-01T00:00:00Z",
    updatedAt: "2022-12-01T00:00:00Z",
  },
  {
    id: "inst003",
    name: "Global Solutions Inc.",
    registrationNumber: "GS54321",
    legalType: "corporation",
    industry: "Consulting",
    website: "https://globalsolutions.com",
    contactInformation: {
      primaryContact: {
        name: "Anna Lee",
        title: "Chief Strategy Officer",
        email: "anna.lee@globalsolutions.com",
        phone: "+1231231234",
      },
      address: {
        street: "500 Strategy Ave",
        city: "Consulting City",
        state: "New York",
        postalCode: "10001",
        country: "USA",
      },
    },
    billingInformation: {
      billingContact: {
        name: "Gregory White",
        title: "Billing Manager",
        email: "gregory.white@globalsolutions.com",
        phone: "+1231231235",
      },
      billingAddress: {
        street: "500 Strategy Ave",
        city: "Consulting City",
        state: "New York",
        postalCode: "10001",
        country: "USA",
      },
      paymentMethod: "paypal",
    },
    subscriptionDetails: {
      subscriptionStatus: "active",
      subscriptionType: "basic",
      startDate: "2023-03-01",
      renewalDate: "2024-03-01",
      paymentFrequency: "monthly",
      planDetails: {
        featuresIncluded: ["basic reports", "email support"],
        userLimit: 50,
      },
    },
    users: [
      {
        id: "user005",
        name: "Henry Clark",
        email: "henry.clark@globalsolutions.com",
        role: "admin",
        joinedAt: "2023-03-01",
        status: "active",
      },
      {
        id: "user006",
        name: "Grace Martin",
        email: "grace.martin@globalsolutions.com",
        role: "teacher",
        joinedAt: "2023-04-15",
        status: "active",
      },
    ],
    roles: [
      {
        roleName: "admin",
        permissions: ["manage_users", "view_reports", "edit_content"],
      },
      {
        roleName: "consultant",
        permissions: ["create_reports", "view_reports"],
      },
    ],
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "inst004",
    name: "Innovative Healthcare Systems",
    registrationNumber: "IHS11223",
    legalType: "non-profit",
    industry: "Healthcare",
    website: "https://innovativehealthcare.com",
    contactInformation: {
      primaryContact: {
        name: "Olivia Parker",
        title: "Chief Medical Officer",
        email: "olivia.parker@innovativehealthcare.com",
        phone: "+9876543210",
      },
      address: {
        street: "123 Health St",
        city: "Med City",
        state: "Texas",
        postalCode: "75201",
        country: "USA",
      },
    },
    billingInformation: {
      billingContact: {
        name: "Robert Green",
        title: "Finance Officer",
        email: "robert.green@innovativehealthcare.com",
        phone: "+9876543211",
      },
      billingAddress: {
        street: "123 Health St",
        city: "Med City",
        state: "Texas",
        postalCode: "75201",
        country: "USA",
      },
      paymentMethod: "credit_card",
    },
    subscriptionDetails: {
      subscriptionStatus: "active",
      subscriptionType: "premium",
      startDate: "2023-07-01",
      renewalDate: "2024-07-01",
      paymentFrequency: "annually",
      planDetails: {
        featuresIncluded: [
          "medical records integration",
          "24/7 support",
          "HIPAA compliance",
        ],
        userLimit: 200,
      },
    },
    users: [
      {
        id: "user007",
        name: "Sophia Davis",
        email: "sophia.davis@innovativehealthcare.com",
        role: "admin",
        joinedAt: "2023-07-01",
        status: "active",
      },
      {
        id: "user008",
        name: "Ethan Harris",
        email: "ethan.harris@innovativehealthcare.com",
        role: "student",
        joinedAt: "2023-07-10",
        status: "active",
      },
    ],
    roles: [
      {
        roleName: "admin",
        permissions: ["manage_users", "view_reports", "edit_content"],
      },
      {
        roleName: "doctor",
        permissions: ["view_patient_data", "edit_patient_data"],
      },
    ],
    createdAt: "2023-07-01T00:00:00Z",
    updatedAt: "2023-07-15T00:00:00Z",
  },
  {
    id: "inst005",
    name: "Creative Studios",
    registrationNumber: "CS13245",
    legalType: "corporation",
    industry: "Creative Services",
    website: "https://creativestudios.com",
    contactInformation: {
      primaryContact: {
        name: "Liam Anderson",
        title: "Creative Director",
        email: "liam.anderson@creativestudios.com",
        phone: "+1321654320",
      },
      address: {
        street: "200 Art Blvd",
        city: "Art City",
        state: "Florida",
        postalCode: "33101",
        country: "USA",
      },
    },
    billingInformation: {
      billingContact: {
        name: "Charlotte Young",
        title: "Billing Coordinator",
        email: "charlotte.young@creativestudios.com",
        phone: "+1321654321",
      },
      billingAddress: {
        street: "200 Art Blvd",
        city: "Art City",
        state: "Florida",
        postalCode: "33101",
        country: "USA",
      },
      paymentMethod: "paypal",
    },
    subscriptionDetails: {
      subscriptionStatus: "inactive",
      subscriptionType: "basic",
      startDate: "2022-11-01",
      renewalDate: "2023-11-01",
      paymentFrequency: "quarterly",
      planDetails: {
        featuresIncluded: ["standard support", "basic design tools"],
        userLimit: 25,
      },
    },
    users: [
      {
        id: "user009",
        name: "Isabella Moore",
        email: "isabella.moore@creativestudios.com",
        role: "admin",
        joinedAt: "2022-11-01",
        status: "active",
      },
      {
        id: "user010",
        name: "Lucas Taylor",
        email: "lucas.taylor@creativestudios.com",
        role: "admin",
        joinedAt: "2022-11-10",
        status: "active",
      },
    ],
    roles: [
      {
        roleName: "admin",
        permissions: ["manage_users", "view_reports", "edit_content"],
      },
      {
        roleName: "designer",
        permissions: ["create_designs", "view_reports"],
      },
    ],
    createdAt: "2022-11-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  // Add more institutions as needed
];
