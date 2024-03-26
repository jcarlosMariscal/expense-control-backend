export interface Expense {
  id: number;
  quantity: number;
  description: string;
  date: Date;
  categoryId: number;
  userId: number;
}
