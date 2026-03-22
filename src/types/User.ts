export interface UserState {
  accessToken: string | null;
  user: User | null;
}

export interface User {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "moderator" | "admin";
}
