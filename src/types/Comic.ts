import type { User } from "./User";
import type { Edition } from "./Edition";
import type { Hero } from "./Hero";
export interface Comic {
  _id: string;
  title: string;
  coverImage: string;
  issueNumber: number;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  hero: Hero;
  edition: Edition;
}
