import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import ExpenseRow from "./ExpenseRow";

const ExpenseListTable = () => {
  // Generate 100 sample expenses
  const expenses = Array.from({ length: 100 }, (_, index) => ({
    name: `Expense ${index + 1}`,
    price: Math.floor(Math.random() * 1000) + 100,
    markup: Math.floor(Math.random() * 30) + 5,
    totalPrice: 0,
  }));

  return (
    <div className="border rounded-md shadow-inner overflow-hidden">
      <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
        <Table className="relative">
          <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-700 z-10">
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Price (€)</TableHead>
              <TableHead>Markup (%)</TableHead>
              <TableHead>Total Price (€)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <ExpenseRow expense={expense} index={index} key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseListTable;
