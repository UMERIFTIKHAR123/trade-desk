export type CatalogCategory = {
  id: string;
  name: string;
  productCount: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
};
