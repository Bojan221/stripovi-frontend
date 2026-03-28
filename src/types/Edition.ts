export interface Edition {
  _id: string;
  name: string;
  publisher: {
    _id: string;
    name: string;
    country: string;
  };
  heroes: Array<{
    _id: string;
    name: string;
  }>;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}
