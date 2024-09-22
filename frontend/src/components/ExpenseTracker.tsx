import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Film, Plus } from "lucide-react";
  import ExpenseListTable from "./ExpenseListTable";
  import { Button } from "@/components/ui/button";
  
  const ExpenseTracker = () => {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl shadow-xl bg-white dark:bg-gray-800 primary-text-color">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Film className="h-8 w-8 sm:h-10 sm:w-10 secondary-text-color" />
              <span>Film Production Expense Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ExpenseListTable />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-6">
            <Button className="w-full sm:w-auto flex items-center gap-2 secondary-bg-color hover:secondary-bg-color-light transition-all duration-300">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
            <div className="text-xl sm:text-2xl font-bold bg-[#1d4e89]/10 dark:bg-gray-700 dark:text-white p-3 rounded-md">
              Total: €123.45
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default ExpenseTracker;