import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
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
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Price (€)</TableHead>
                  <TableHead>Markup (%)</TableHead>
                  <TableHead>Total Price (€)</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expenses.map((expense, index) => (
                  <ExpenseRow
                    expense={expense}
                    index={index}
                    key={index}
                    onDelete={onDelete}
                    onUpdate={onUpdate} // Pass onUpdate to ExpenseRow
                    isDeleting={deleting === expense.id}
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
