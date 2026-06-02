import type { Comic } from "./Comic";

export interface FavoriteComic {
  _id: string;
  user: string;
  comic: Comic;
  createdAt: string;
  updatedAt: string;
}
