export interface CategoryType {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount: number;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
