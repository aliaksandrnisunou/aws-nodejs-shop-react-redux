export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  cartId: string;
  productId: string;
  count: number,
}

export type Cart = {
  id?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status?: Status;

}
export enum Status {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}