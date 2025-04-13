const Department = require('../models/Department');
const Class = require('../models/Class');
const User = require('../models/User');

/**
 * @desc    Create a new department
 * @route   POST /api/departments/create-department
 * @access  Private (superadmin, innovation)
 */
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, category, isActive = true } = req.body;

    if (await Department.findOne({ name })) {
      return res.status(400).json({ error: 'Department already exists' });
    }

    const newDept = new Department({
      name,
      description,
      category,
      isActive
    });

    await newDept.save();
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ error: 'Department creation failed' });
  }
};

/**
 * @desc    Update an existing department
 * @route   PUT /api/departments/:id
 * @access  Private (superadmin, innovation)
 */
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, isActive } = req.body;

    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    if (name && name !== dept.name && (await Department.findOne({ name }))) {
      return res
        .status(400)
        .json({ error: 'Another department with that name exists' });
    }

    dept.name = name ?? dept.name;
    dept.description = description ?? dept.description;
    dept.category = category ?? dept.category;
    if (typeof isActive === 'boolean') dept.isActive = isActive;

    await dept.save();
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: 'Department update failed' });
  }
};

/**
 * @desc    Get all departments by category, including counts
 * @route   GET /api/departments?category=student|non-student
 * @access  Private (superadmin, innovation)
 */
exports.getDepartments = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    // Apply category filter only if it exists and is valid
    if (category && ['student', 'non-student'].includes(category)) {
      query.category = category;
    } else if (category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const depts = await Department.find(query);

    const data = await Promise.all(
      depts.map(async (dept) => {
        const base = {
          id: dept._id,
          name: dept.name,
          description: dept.description || `Department of ${dept.name}`,
          category: dept.category,
          isActive: dept.isActive
        };

        const staffCount = await User.countDocuments({
            department: dept._id,
            role: { $ne: 'student' }
          });
        base.staffCount = staffCount;
        if (dept.category === 'student') {
          const studentsCount = await User.countDocuments({
            department: dept._id,
            role: 'student'
          });
          const classesCount = await Class.countDocuments({
            department: dept._id
          });
          return { ...base, studentsCount, classesCount };
        } 
        return base;
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

/**
 * @desc    Get a department by ID
 * @route   GET /api/departments/:id
 * @access  Private (superadmin, innovation)
 */
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

/**
 * @desc    Get Department dropdown list
 * @route   GET /api/departments/dropdown
 * @access  Private (superadmin, innovation)
 */
exports.getDepartmentDropdown = async (req, res) => {
  try {
    console.log('Fetching department dropdown...');
    const depts = await Department.find({
      isActive: true,
      category: 'student'
    });
    const dropdown = depts.map((dept) => ({
      id: dept._id,
      name: dept.name
    }));
    res.json(dropdown);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

/**
 * @desc    Delete a department
 * @route   DELETE /api/departments/:id
 * @access  Private (superadmin, innovation)
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }
    await Department.findByIdAndDelete(id);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

