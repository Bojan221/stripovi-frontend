export interface Publisher {
  _id: string;
  name: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePicture?: string;
  };
}
