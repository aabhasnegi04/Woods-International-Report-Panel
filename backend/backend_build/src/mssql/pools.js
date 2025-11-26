import sql from 'mssql';
import express from 'express';

function getConfigFromEnv(prefix) {
  return {
    server: process.env[`${prefix}_SERVER`],
    port: Number(process.env[`${prefix}_PORT`] || 1433),
    user: process.env[`${prefix}_USER`],
    password: process.env[`${prefix}_PASSWORD`],
    database: process.env[`${prefix}_DATABASE`],
    options: {
      encrypt: true,
      trustServerCertificate: true
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
}

export async function initDbPools() {
  const pools = {};
  
  try {
    const cfg = getConfigFromEnv('WOODS_INTERNATIONAL');
    if (!cfg.server || !cfg.user || !cfg.password || !cfg.database) {
      console.warn(`[DB] Missing env for WOODS_INTERNATIONAL, skipping pool creation`);
      return pools;
    }
    const pool = new sql.ConnectionPool(cfg);
    pools.WOODS_INTERNATIONAL = await pool.connect();
    console.log(`[DB] Connected: WOODS_INTERNATIONAL`);
  } catch (err) {
    console.error(`[DB] Failed to connect WOODS_INTERNATIONAL:`, err.message);
  }
  
  return pools;
}

export function createDbPoolsRouter(pools) {
  const router = express.Router();

  // Get Woods International info
  router.get('/store', (req, res) => {
    res.json({ 
      store: 'Woods International',
      database: 'ud_woodsoft',
      status: pools.WOODS_INTERNATIONAL ? 'connected' : 'disconnected'
    });
  });

  // Execute stored procedure with parameters (Woods International)
  router.post('/exec', async (req, res) => {
    try {
      const { procedure, params } = req.body || {};
      if (!procedure) {
        return res.status(400).json({ error: 'procedure is required' });
      }
      const pool = pools.WOODS_INTERNATIONAL;
      if (!pool) {
        return res.status(503).json({ error: 'Woods International database is not connected' });
      }

      const request = pool.request();
      if (params && typeof params === 'object') {
        for (const [name, value] of Object.entries(params)) {
          request.input(name, value);
        }
      }
      const result = await request.execute(procedure);
      res.json({ recordsets: result.recordsets, rowsAffected: result.rowsAffected });
    } catch (err) {
      console.error('SP exec error:', err);
      res.status(500).json({ error: 'Failed to execute stored procedure', details: err.message });
    }
  });

  // Execute custom SQL query
  router.post('/query', async (req, res) => {
    try {
      const { query, params } = req.body || {};
      if (!query) {
        return res.status(400).json({ error: 'query is required' });
      }

      const pool = pools.WOODS_INTERNATIONAL;
      if (!pool) {
        return res.status(503).json({ error: 'Woods International database is not connected' });
      }

      const request = pool.request();
      if (params && typeof params === 'object') {
        for (const [name, value] of Object.entries(params)) {
          request.input(name, value);
        }
      }
      
      const result = await request.query(query);
      res.json({ recordsets: result.recordsets, rowsAffected: result.rowsAffected });
    } catch (err) {
      console.error('Query exec error:', err);
      res.status(500).json({ error: 'Failed to execute query', details: err.message });
    }
  });

  // Get dashboard data
  router.get('/dashboard', async (req, res) => {
    try {
      const pool = pools.WOODS_INTERNATIONAL;
      if (!pool) {
        return res.status(503).json({ error: 'Woods International database is not connected' });
      }

      const request = pool.request();
      const result = await request.query(`
        SELECT 
          COUNT(*) as table_count,
          DB_NAME() as database_name
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
      
      res.json({
        success: true,
        store: 'Woods International',
        database: 'ud_woodsoft',
        data: result.recordsets[0]
      });
    } catch (err) {
      console.error('Dashboard data error:', err);
      res.status(500).json({ error: 'Failed to get dashboard data', details: err.message });
    }
  });

  // Get clients list
  router.get('/clients', async (req, res) => {
    try {
      const pool = pools.WOODS_INTERNATIONAL;
      if (!pool) {
        return res.status(503).json({ error: 'Woods International database is not connected' });
      }

      const request = pool.request();
      const result = await request.query(`
        SELECT DISTINCT [Client_Name] as client_name
        FROM [ud_woodsoft].[woodsoft].[tb_m_Container]
        WHERE [Client_Name] IS NOT NULL AND [Client_Name] != ''
        ORDER BY [Client_Name]
      `);
      
      res.json(result.recordsets[0] || []);
    } catch (err) {
      console.error('Clients fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch clients', details: err.message });
    }
  });

  return router;
}


