const Team = require('../models/Team');
const Event = require('../models/Event');
const PastParticipation = require('../models/PastParticipation');

// @desc    Generate dynamic reports
// @route   GET /api/principal/reports
exports.generateReports = async (req, res) => {
  try {
    const { year, department, eventType } = req.query;

    const matchStage = {};
    if (year) matchStage.year = parseInt(year);
    if (department) matchStage.department = department;
    if (eventType) matchStage.type = eventType;

    const reports = await Event.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'teams',
          localField: '_id',
          foreignField: 'event',
          as: 'teams'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          type: 1,
          totalTeams: { $size: '$teams' },
          totalParticipants: { $sum: { $size: '$teams.members' } }
        }
      }
    ]);

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate reports' });
  }
};

// @desc    Get historical data
// @route   GET /api/principal/historical-data
exports.getHistoricalData = async (req, res) => {
  try {
    const historicalData = await PastParticipation.aggregate([
      {
        $group: {
          _id: { year: '$year', department: '$department' },
          count: { $sum: 1 },
          events: { $addToSet: '$eventName' }
        }
      },
      {
        $project: {
          year: '$_id.year',
          department: '$_id.department',
          totalParticipations: '$count',
          uniqueEvents: { $size: '$events' }
        }
      }
    ]);

    res.json(historicalData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
};
