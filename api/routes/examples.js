import { Router } from 'express';

const router = Router();

/**
 * ============================================
 * EXAMPLE ROUTES - SAFE TO DELETE
 * ============================================
 *
 * This entire file is for demonstration purposes only.
 * To remove all examples from your production deployment:
 * 1. Delete this file (api/routes/examples.js)
 * 2. Remove this line in server.js: app.use(exampleRoutes);
 * 3. Remove this import in server.js: import exampleRoutes from './routes/examples.js';
 *
 */

// In-memory storage for report demo (agent-initiated messages)
const reports = new Map();

router.get('/api/time', (req, res) => {
  try {
    const { timezone } = req.query;
    const now = new Date();
    let formatted;

    if (timezone) {
      try {
        formatted = now.toLocaleString('en-US', {
          timeZone: timezone,
          dateStyle: 'full',
          timeStyle: 'long'
        });
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid timezone',
          details: error.message
        });
      }
    } else {
      formatted = now.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
      });
    }

    res.json({
      datetime: now.toISOString(),
      timezone: timezone || 'UTC',
      formatted: formatted,
      timestamp: now.getTime()
    });
  } catch (error) {
    console.error('Time API error:', error);
    res.status(500).json({
      error: 'Failed to get current time',
      details: error.message
    });
  }
});

router.get('/api/sample-data', (req, res) => {
  try {
    const { category } = req.query;

    const allItems = [
      {
        id: '1',
        name: 'Introduction to React',
        category: 'books',
        description: 'A comprehensive guide to building modern web applications with React.',
        value: '$29.99',
        metadata: 'Publisher: Tech Books Inc. | Pages: 450'
      },
      {
        id: '2',
        name: 'Node.js Best Practices',
        category: 'books',
        description: 'Learn industry-standard patterns and practices for Node.js development.',
        value: '$34.99',
        metadata: 'Publisher: Dev Press | Pages: 380'
      },
      {
        id: '3',
        name: 'Cloud Computing Essentials',
        category: 'books',
        description: 'Master cloud infrastructure, deployment, and scaling strategies.',
        value: '$39.99',
        metadata: 'Publisher: Cloud Masters | Pages: 520'
      }
    ];

    const items = category
      ? allItems.filter(item => item.category.toLowerCase() === category.toLowerCase())
      : allItems;

    res.json({
      title: category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Items',
      items: items
    });
  } catch (error) {
    console.error('Sample data API error:', error);
    res.status(500).json({
      error: 'Failed to get sample data',
      details: error.message
    });
  }
});

router.post('/api/reports/generate', (req, res) => {
  const reportId = `report_${Date.now()}`;
  const { reportType = 'usage' } = req.body;

  reports.set(reportId, {
    id: reportId,
    type: reportType,
    status: 'processing',
    createdAt: new Date().toISOString()
  });

  const processingTime = 3000 + Math.random() * 2000;

  setTimeout(() => {
    const report = reports.get(reportId);
    if (report) {
      report.status = 'completed';
      report.completedAt = new Date().toISOString();
      report.data = {
        summary: `${reportType === 'usage' ? 'Usage' : 'Performance'} Report - ${new Date().toLocaleDateString()}`,
        metrics: {
          totalRequests: Math.floor(Math.random() * 10000) + 1000,
          avgResponseTime: (Math.random() * 500 + 100).toFixed(2) + 'ms',
          successRate: (95 + Math.random() * 4).toFixed(1) + '%',
          activeUsers: Math.floor(Math.random() * 500) + 100
        },
        period: 'Last 30 days'
      };
      reports.set(reportId, report);
    }
  }, processingTime);

  res.json({
    reportId,
    status: 'processing',
    estimatedTime: Math.ceil(processingTime / 1000) + ' seconds'
  });
});

router.get('/api/reports/status/:reportId', (req, res) => {
  const { reportId } = req.params;
  const report = reports.get(reportId);

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json(report);
});

export default router;
