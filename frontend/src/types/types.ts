export interface Expense {
  id: number;
  name: string;
  price: number;
  percentageMarkup: number;
  totalPrice?: number;
  isNew?: boolean;
}

export interface ExpenseTrackerProps {
  expenses: Expense[];
  loading: boolean;
  adding: boolean;
  editing: boolean;
  deleting: boolean;
  error: string | null;
  onAdd: () => void;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (updatedExpense: Expense) => Promise<void>;
  newExpenseRef: React.RefObject<HTMLInputElement>;
}

export interface ExpenseListTableProps {
  expenses: Expense[];
  loading: boolean;
  editing: number | null;
  deleting: number | null;
  error: string | null;
  onAdd: () => void;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (updatedExpense: Expense) => Promise<void>;
  newExpenseRef: React.RefObject<HTMLInputElement>;
}

export interface ExpenseRowProps {
  expense: Expense;
  isEditing: boolean;
  index: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (updatedExpense: Expense) => Promise<void>;
  isDeleting: boolean;
  newExpenseRef: React.RefObject<HTMLInputElement>;
}