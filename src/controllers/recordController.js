import Record from "../models/Record.js";

// @desc    Create a new financial record
// @route   POST /api/records
// @access  Private (Admin only)
export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.create({
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
      createdBy: req.user._id, // Attached by the auth middleware
    });

    res.status(201).json(record);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid record data", error: error.message });
  }
};

// @desc    Get all records (with optional filtering)
// @route   GET /api/records
// @access  Private (Admin, Analyst)
export const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    let query = {};

    // Build dynamic filter query
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Record.find(query)
      .populate("createdBy", "name email") // Include creator's basic info
      .sort({ date: -1 }); // Newest first

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get a single record by ID
// @route   GET /api/records/:id
// @access  Private (Admin, Analyst)
export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Private (Admin only)
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.json(updatedRecord);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid update data", error: error.message });
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private (Admin only)
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    await record.deleteOne();
    res.json({ message: "Record removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
