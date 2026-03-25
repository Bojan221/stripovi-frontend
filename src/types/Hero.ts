export interface Hero {
  _id: string;
  name: string;
  alias: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}
