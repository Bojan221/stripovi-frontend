import type { Comic } from "./Comic";

export type ComicCondition = "mint" | "good" | "used";

export interface UserComic {
  _id: string;
  user: string;
  comic: Comic;
  isFavorite: boolean;
  condition: ComicCondition;
  acquiredAt: string;
  createdAt: string;
  updatedAt: string;
}
