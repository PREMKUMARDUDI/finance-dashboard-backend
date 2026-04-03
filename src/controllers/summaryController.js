import Record from "../models/Record.js";

// @desc    Get dashboard summary (Totals, Category breakdown, Recent activity)
// @route   GET /api/summary
// @access  Private (Admin, Analyst, Viewer)
export const getDashboardSummary = async (req, res) => {
  try {
    // 1. Calculate Total Income and Total Expenses
    const totals = await Record.aggregate([
      {
        $group: {
          _id: "$type", // Group by 'income' or 'expense'
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((item) => {
      if (item._id === "income") totalIncome = item.totalAmount;
      if (item._id === "expense") totalExpense = item.totalAmount;
    });

    const netBalance = totalIncome - totalExpense;

    // 2. Category-wise Totals (e.g., how much spent on Food, Rent, etc.)
    const categoryTotals = await Record.aggregate([
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by highest amount
      },
    ]);

    // Format the category data nicely
    const formattedCategories = categoryTotals.map((item) => ({
      type: item._id.type,
      category: item._id.category,
      amount: item.totalAmount,
    }));

    // 3. Recent Activity (Last 5 records)
    const recentActivity = await Record.find()
      .sort({ date: -1 })
      .limit(5)
      .select("amount type category date notes"); // Only pick necessary fields

    // 4. Send the combined dashboard data
    res.json({
      overview: {
        totalIncome,
        totalExpense,
        netBalance,
      },
      categoryBreakdown: formattedCategories,
      recentActivity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error fetching summary", error: error.message });
  }
};
