import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Euro, Percent, Trash2, RefreshCw, Check } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Spinner } from "./ui/spinner";
import { Expense, ExpenseRowProps } from "@/types/types";

const MAX_PRICE = 100000000; // 100 million
const MAX_MARKUP = 100; // 100%

const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  index,
  onDelete,
  onUpdate,
  isDeleting,
  isEditing,
  newExpenseRef,
}) => {
  const [name, setName] = useState<string>(expense.name);
  const [price, setPrice] = useState<string>(expense.price.toFixed(2));
  const [markup, setMarkup] = useState<string>(
    expense.percentageMarkup.toFixed(2)
  );
  const [totalPrice, setTotalPrice] = useState<number>(expense.totalPrice ?? 0);
  const [originalExpense, setOriginalExpense] = useState<Expense>(expense);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);
  const [isMarkupFocused, setIsMarkupFocused] = useState(false);

  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const isNewExpense = expense.isNew; // Check if the expense is new

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setSaveStatus("idle");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validate price input
    if (
      value === "" ||
      (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) <= MAX_PRICE)
    ) {
      setPrice(value);
      updateTotalPrice(value, markup);
    }
  };

  const handleMarkupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validate markup input
    if (
      value === "" ||
      (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) <= MAX_MARKUP)
    ) {
      setMarkup(value);
      updateTotalPrice(price, value);
    }
  };

  const updateTotalPrice = (priceStr: string, markupStr: string) => {
    const priceValue = parseFloat(priceStr) || 0;
    const markupValue = parseFloat(markupStr) || 0;
    const total = priceValue + (priceValue * markupValue) / 100;
    setTotalPrice(parseFloat(total.toFixed(2)));
  };

  const handleBlur = async (e: React.FocusEvent) => {
    // Ignore blur if moving to the delete button
    if (e.relatedTarget === deleteButtonRef.current) {
      return;
    }

    let updatedName = name.trim() === "" ? "Unnamed Expense" : name.trim();
    let updatedPrice = parseFloat(price) || 0;
    let updatedMarkup = parseFloat(markup) || 0;

    setName(updatedName);
    setPrice(updatedPrice.toFixed(2));
    setMarkup(updatedMarkup.toFixed(2));

    const updatedTotalPrice = parseFloat(
      (updatedPrice + (updatedPrice * updatedMarkup) / 100).toFixed(2)
    );
    setTotalPrice(updatedTotalPrice);

    const updatedExpense = {
      ...expense,
      name: updatedName,
      price: updatedPrice,
      percentageMarkup: updatedMarkup,
      totalPrice: updatedTotalPrice,
    };

    // Check if the updated expense differs from the original to avoid unnecessary api calls
    if (JSON.stringify(updatedExpense) !== JSON.stringify(originalExpense)) {
      setSaveStatus("saving");
      try {
        await onUpdate(updatedExpense);
        setOriginalExpense(updatedExpense);
        setSaveStatus("saved");
      } catch (error) {
        // Revert to original values if the update fails
        setSaveStatus("idle");
        setName(originalExpense.name);
        setPrice(originalExpense.price.toFixed(2));
        setMarkup(originalExpense.percentageMarkup.toFixed(2));
        setTotalPrice(originalExpense.totalPrice ?? 0);
      }
    }
  };

  // Handle auto-reset of save status after a short delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (saveStatus === "saved") {
      timer = setTimeout(() => setSaveStatus("idle"), 2000);
    }
    return () => clearTimeout(timer);
  }, [saveStatus]);

  return (
    <TableRow className="border-b relative" key={index}>
      <TableCell>
        <Input
          value={isNameFocused && name === "Unnamed Expense" ? "" : name}
          placeholder="Expense name"
          className="w-full min-w-32"
          onChange={handleNameChange}
          onBlur={(e) => {
            setIsNameFocused(false);
            handleBlur(e);
          }}
          onFocus={() => setIsNameFocused(true)}
          ref={isNewExpense ? newExpenseRef : null}
        />
      </TableCell>
      <TableCell>
        <div className="relative">
          <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            inputMode="decimal"
            value={isPriceFocused && price === "0.00" ? "" : price}
            placeholder="0.00"
            className="w-full min-w-32 pl-8"
            onChange={handlePriceChange}
            onBlur={(e) => {
              setIsPriceFocused(false);
              handleBlur(e);
            }}
            onFocus={() => setIsPriceFocused(true)}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="relative">
          <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            inputMode="decimal"
            value={isMarkupFocused && markup === "0.00" ? "" : markup}
            placeholder="0.00"
            className="w-full min-w-32 pl-8"
            onChange={handleMarkupChange}
            onBlur={(e) => {
              setIsMarkupFocused(false);
              handleBlur(e);
            }}
            onFocus={() => setIsMarkupFocused(true)}
          />
        </div>
      </TableCell>
      <TableCell className="font-medium w-32 whitespace-nowrap">
        € {totalPrice.toFixed(2)}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-500 hover:text-white"
          disabled={isDeleting || isEditing || saveStatus === "saving"}
          onClick={() => onDelete(expense.id)}
          ref={deleteButtonRef}
        >
          {isDeleting ? <Spinner /> : <Trash2 className="h-4 w-4" />}
          <span className="sr-only">Delete expense</span>
        </Button>
      </TableCell>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        {saveStatus === "saving" && (
          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
        )}
        {saveStatus === "saved" && <Check className="h-4 w-4 text-green-500" />}
      </div>
    </TableRow>
  );
};

export default ExpenseRow;
