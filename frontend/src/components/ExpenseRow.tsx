import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Euro, Percent, Trash2, RefreshCw, Check } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ExpenseRowProps } from "@/types/types";
import { useState, useEffect } from "react";
import { Spinner } from "./ui/spinner";

const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  index,
  onDelete,
  onUpdate,
  isDeleting,
}) => {
  const [name, setName] = useState<string>(expense.name);
  const [price, setPrice] = useState<number>(expense.price);
  const [markup, setMarkup] = useState<number>(expense.percentageMarkup);
  const [totalPrice, setTotalPrice] = useState<number>(expense.totalPrice);
  const [originalExpense, setOriginalExpense] = useState(expense);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSaveStatus('idle');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(newPrice);
    setTotalPrice(newPrice + newPrice * (markup / 100));
    setSaveStatus('idle');
  };

  const handleMarkupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMarkup = parseFloat(e.target.value);
    setMarkup(newMarkup);
    setTotalPrice(price + price * (newMarkup / 100));
    setSaveStatus('idle');
  };

  const handleBlur = async () => {
    const updatedExpense = {
      ...expense,
      name,
      price,
      percentageMarkup: markup,
    };
    if (JSON.stringify(updatedExpense) !== JSON.stringify(originalExpense)) {
      setSaveStatus('saving');
      try {
        await onUpdate(updatedExpense);
        setOriginalExpense(updatedExpense);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('idle');
        // Revert to original values on error
        setName(originalExpense.name);
        setPrice(originalExpense.price);
        setMarkup(originalExpense.percentageMarkup);
        setTotalPrice(originalExpense.totalPrice);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (saveStatus === 'saved') {
      timer = setTimeout(() => setSaveStatus('idle'), 2000);
    }
    return () => clearTimeout(timer);
  }, [saveStatus]);

  return (
    <TableRow className="border-b relative" key={index}>
      <TableCell>
        <Input
          value={name}
          placeholder="Expense name"
          className="w-full min-w-32"
          onChange={handleNameChange}
          onBlur={handleBlur}
        />
      </TableCell>
      <TableCell>
        <div className="relative">
          <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="number"
            value={price}
            placeholder="0.00"
            className="w-full min-w-32 pl-8"
            onChange={handlePriceChange}
            onBlur={handleBlur}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="relative">
          <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="number"
            value={markup}
            placeholder="0.00"
            className="w-full min-w-32 pl-8"
            onChange={handleMarkupChange}
            onBlur={handleBlur}
          />
        </div>
      </TableCell>
      <TableCell className="font-medium w-32">
        € {totalPrice.toFixed(2)}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-500 hover:text-white"
          disabled={isDeleting}
          onClick={() => onDelete(expense.id)}
        >
          {isDeleting ? <Spinner /> : <Trash2 className="h-4 w-4" />}
          <span className="sr-only">Delete expense</span>
        </Button>
      </TableCell>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        {saveStatus === 'saving' && (
          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
        )}
        {saveStatus === 'saved' && (
          <Check className="h-4 w-4 text-green-500" />
        )}
      </div>
    </TableRow>
  );
};

export default ExpenseRow;