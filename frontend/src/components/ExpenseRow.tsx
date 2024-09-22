// ExpenseRow.js
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Euro, Percent, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

const ExpenseRow = ({ expense, index }) => {
  return (
    <TableRow className="border-b" key={index}>
      <TableCell>
        <Input
          value={expense.name}
          placeholder="Expense name"
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <div className="relative">
          <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="number"
            value={expense.price}
            placeholder="0.00"
            className="w-full pl-8"
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="relative">
          <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="number"
            value={expense.markup}
            placeholder="0.00"
            className="w-full pl-8"
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {expense.totalPrice.toFixed(2)}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-500 hover:text-white"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete expense</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ExpenseRow;
