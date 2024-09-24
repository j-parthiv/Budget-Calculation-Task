import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import CustomTooltip from "./CustomTooltip";
import { CircleAlert } from "lucide-react";

import ExpenseRow from "./ExpenseRow";
import useFetchExpenses from "@/hooks/useFetchExpense";
import { Spinner } from "./ui/spinner";
import { UseFetchExpensesResult } from "@/types/types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const ExpenseListTable: React.FC = ({
  expenses,
  loading,
  editing,
  deleting,
  error,
  onDelete,
  onUpdate,
  newExpenseRef,
}) => {
  return (
    <div className="border rounded-md shadow-inner overflow-hidden">
      <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
        {loading && (
          <div className="w-full h-52 flex justify-center items-center">
            <Spinner />
          </div>
        )}

        {!loading && error && (
          <div className="w-full h-52 flex justify-center items-center text-red-500">
            <p>Error fetching expenses: {error}</p>
          </div>
        )}

        {!loading && !error && expenses.length === 0 && (
          <div className="w-full h-52 flex justify-center items-center">
            <p>No expenses available.</p>
          </div>
        )}

        {!loading && !error && expenses.length > 0 && (
          <div>
            <Table className="relative">
              <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-700 z-10">
                <TableRow>
                  <TableHead className="w-[200px] relative">
                    <span>Name</span>
                    <CustomTooltip content="Name of the Expense (Empty fields will be saved as 'Unnamed Expense')">
                      <CircleAlert className="h-4 w-4 ml-1 mr-4 absolute right-0 top-1/2 transform -translate-y-1/2 hidden sm:inline" />
                    </CustomTooltip>
                  </TableHead>
                  <TableHead className="relative">
                    <span>Price (€)</span>
                    <CustomTooltip content="Enter a price value (Max: 1,000,000,000)">
                      <CircleAlert className="h-4 w-4 ml-1 mr-4 absolute right-0 top-1/2 transform -translate-y-1/2 hidden sm:inline" />
                    </CustomTooltip>
                  </TableHead>
                  <TableHead className="relative">
                    <span>Markup (%)</span>
                    <CustomTooltip content="Enter a markup percentage (Max: 100)">
                      <CircleAlert className="h-4 w-4 ml-1  mr-4 absolute right-0 top-1/2 transform -translate-y-1/2 hidden sm:inline" />
                    </CustomTooltip>
                  </TableHead>
                  <TableHead>Total Price (€)</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expenses.map((expense, index) => (
                  <ExpenseRow
                    expense={expense}
                    editing={editing}
                    index={expense.id}
                    key={expense.id}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    isDeleting={deleting === expense.id}
                    newExpenseRef={newExpenseRef}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseListTable;
