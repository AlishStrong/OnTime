export interface Company {
  country: string;
  legalName: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalNumber: string;
  };
  locations: unknown[];
  ownerUID: string;
  verified: boolean;
}
