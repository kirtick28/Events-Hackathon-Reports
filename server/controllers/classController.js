const Department = require('../models/Department');
const Class = require('../models/Class');
const User = require('../models/User');

/**
 * @desc    Create a new class
 * @route   POST /api/classes/create-class
 * @access  Private (superadmin, innovation)
 */
exports.createClass = async (req, res) => {
  try {
    const { department, year, name, advisors, isActive = true } = req.body;

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const exists = await Class.findOne({ name, department, year });
    if (exists) {
      return res.status(400).json({ error: 'Class already exists' });
    }

    const newClass = new Class({ name, department, year, advisors, isActive });
    await newClass.save();

    // Update advisors: set their 'class' field to the newly created class ID
    if (Array.isArray(advisors)) {
      await User.updateMany(
        { _id: { $in: advisors } },
        { $set: { class: newClass._id } }
      );
    }

    res.status(201).json(newClass);
  } catch (err) {
    console.error('Error in createClass:', err);
    res.status(500).json({ error: 'Class creation failed' });
  }
};

/**
 * @desc    Update an existing class
 * @route   PUT /api/classes/:id
 * @access  Private (superadmin, innovation)
 */
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, department, advisors, isActive } = req.body;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const dup = await Class.findOne({
      _id: { $ne: id },
      name,
      department,
      year
    });
    if (dup) {
      return res.status(400).json({
        error: 'Another class with same name, department, and year exists'
      });
    }

    const oldAdvisorIds = cls.advisors.map(id => id.toString());
    const newAdvisorIds = advisors.map(id => id.toString());

    // Find advisors to remove (present in old, not in new)
    const removedAdvisors = oldAdvisorIds.filter(
      id => !newAdvisorIds.includes(id)
    );

    // Find advisors to add (present in new, not in old)
    const addedAdvisors = newAdvisorIds.filter(
      id => !oldAdvisorIds.includes(id)
    );

    // Update class data
    cls.name = name;
    cls.year = year;
    cls.department = department;
    cls.advisors = advisors;
    if (typeof isActive === 'boolean') cls.isActive = isActive;
    await cls.save();

    // Remove class reference from removed advisors
    await User.updateMany(
      { _id: { $in: removedAdvisors } },
      { $unset: { class: "" } }
    );

    // Add class reference to newly added advisors
    await User.updateMany(
      { _id: { $in: addedAdvisors } },
      { $set: { class: cls._id } }
    );

    res.json(cls);
  } catch (err) {
    console.error('Error in updateClass:', err);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

/**
 * @desc    Get all classes for a department, with student counts
 * @route   GET /api/classes?departmentId=xxx
 * @access  Private (superadmin, innovation)
 */
exports.getClasses = async (req, res) => {
  try {
    const { departmentId } = req.query;
    const classes = await Class.find({ department: departmentId });

    const data = await Promise.all(
      classes.map(async (cls) => {
        const studentCount = await User.countDocuments({
          class: cls._id,
          role: 'student'
        });

        const advisors = await User.find(
          { _id: { $in: cls.advisors } },
          'name _id'
        );

        return {
          _id: cls._id,
          name: cls.name,
          year: cls.year,
          department: cls.department,
          advisors: advisors.map(advisor => ({
            _id: advisor._id,
            name: advisor.name
          })),
          isActive: cls.isActive,
          studentCount
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error('Error in getClasses:', err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

/**
 * @desc    Get a class by ID
 * @route   GET /api/classes/:id
 * @access  Private (superadmin, innovation)
 */
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch class' });
  }
};

/**
 * @desc    Delete a class
 * @route   DELETE /api/classes/:id
 * @access  Private (superadmin, innovation)
 */
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Unset class from all advisors
    await User.updateMany(
      { _id: { $in: cls.advisors } },
      { $unset: { class: "" } }
    );

    await Class.findByIdAndDelete(id);

    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error('Error in deleteClass:', err);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};
