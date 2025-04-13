const Department = require('../models/Department');
const Class = require('../models/Class');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const xlsx = require('xlsx');

// configure multer for single-file uploads
const upload = multer({ storage: multer.memoryStorage() });


/**
 * @desc    Create a new user
 * @route   POST /api/users/create-user
 * @access  Private (superadmin, innovation)
 */
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      department,
      class: userClass, // if role is student
      isActive = true
    } = req.body;

    if (!department) {
      return res.status(400).json({ error: 'Department is required' });
    }

    let year = null;

    if (role === 'student') {
      if (!userClass) {
        return res
          .status(400)
          .json({ error: 'Class is required for students' });
      }

      // fetch year from Class model using class id
      const classDoc = await Class.findById(userClass);
      if (!classDoc) {
        return res.status(400).json({ error: 'Invalid class ID' });
      }

      year = classDoc.year;
    }

    const tempPassword = 'user123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      class: role === 'student' ? userClass : undefined,
      year,
      isActive
    });

    await newUser.save();
    // TODO: send tempPassword via email
    res.status(201).json({ user: newUser, tempPassword });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'User creation failed' });
  }
};

/**
 * @desc    Update an existing user
 * @route   PUT /api/users/:id
 * @access  Private (superadmin, innovation)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      role,
      department,
      class: userClass,
      year,
      isActive
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // optionally check email uniqueness...
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    user.department = department ?? user.department;
    user.class = userClass ?? user.class;
    user.year = year ?? user.year;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'User update failed' });
  }
};


/**
 * @desc    Get all users (optionally filter by dept/class/role)
 * @route   GET /api/users
 * @access  Private (superadmin, innovation)
 */
exports.getUsers = async (req, res) => {
  try {
    const filters = {};
    ['department', 'class', 'role', 'isActive'].forEach((f) => {
      if (req.query[f] != null) filters[f] = req.query[f];
    });

    if (req.query.role_ne) {
      const roleNeValue = req.query.role_ne;
      filters.role = { $ne: roleNeValue }; 
    }

    if (req.query.except_me === 'true') {
      filters._id = { $ne: req.user.id };
    }

    const users = await User.find(filters).populate('department class', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * @desc    Get all users with class and department details
 * @route   GET /api/users/dropdown
 * @access  Private (superadmin, innovation, hod, student)
 */
exports.getUsersForDropdown = async (req, res) => {
  try {
    const query = {
      role: { $ne: 'superadmin' },
      isActive: true
    };

    if (req.query.role) {
      query.role = req.query.role;
    }

    let users = await User.find(query)
      .select('name _id role department class')
      .populate('department class', 'name');

    // If role=staff and ne_advisor=true, exclude those already advisors
    if (req.query.role === 'staff' && req.query.ne_advisor === 'true') {
      const classes = await Class.find({}, 'advisors');
      const advisorIds = new Set();

      classes.forEach(cls => {
        cls.advisors.forEach(advisorId => advisorIds.add(String(advisorId)));
      });

      users = users.filter(user => !advisorIds.has(String(user._id)));
    }

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      role: user.role,
      department: user.department || null,
      class: user.class || null
    }));

    // Return empty array if no users, instead of 404
    res.json(formattedUsers);
    
  } catch (err) {
    console.error('Error in getUsersForDropdown:', err);
    res.status(500).json({ 
      error: 'Failed to fetch users for dropdown',
      details: err.message 
    });
  }
};




/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (superadmin, innovation)
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      'department class',
      'name'
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

/**
 * @desc    Bulk add users from Excel
 * @route   POST /api/users/bulk-add
 * @access  Private (superadmin, innovation)
 */
exports.bulkAddUsers = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { role, department, class: userClass } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Validate required parameters
      if (!role || !department) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // For students, validate class exists and get year
      let year;
      if (role === 'student') {
        if (!userClass) {
          return res
            .status(400)
            .json({ error: 'Class ID required for students' });
        }

        const classData = await Class.findById(userClass);
        if (!classData) {
          return res.status(404).json({ error: 'Class not found' });
        }
        year = classData.year;
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      const created = [];
      for (const row of rows) {
        // Validate row data
        if (!row.name || !row.email) {
          continue; // Skip invalid rows
        }

        // Create user data object
        const userData = {
          name: row.name,
          email: row.email,
          role,
          department,
          isActive: true,
          password: await bcrypt.hash('user123', 10)
        };

        // Add class and year for students
        if (role === 'student') {
          userData.class = userClass;
          userData.year = year;
        }

        const user = new User(userData);
        await user.save();
        created.push(user);
      }

      res.json({ created });
    } catch (err) {
      console.error('Bulk add error:', err);
      res.status(500).json({ error: 'Bulk add failed' });
    }
  }
];

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (superadmin, innovation)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
