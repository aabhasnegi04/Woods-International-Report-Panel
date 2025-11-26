import sql from 'mssql';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  server: process.env.WOODS_INTERNATIONAL_SERVER,
  port: Number(process.env.WOODS_INTERNATIONAL_PORT || 1433),
  user: process.env.WOODS_INTERNATIONAL_USER,
  password: process.env.WOODS_INTERNATIONAL_PASSWORD,
  database: process.env.WOODS_INTERNATIONAL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

console.log('Testing Woods International Database Connection...');
console.log('Server:', config.server);
console.log('Port:', config.port);
console.log('Database:', config.database);
console.log('User:', config.user);
console.log('---');

async function testConnection() {
  try {
    console.log('Connecting...');
    const pool = await sql.connect(config);
    console.log('✅ Connected successfully!');
    
    // Test query
    const result = await pool.request().query('SELECT DB_NAME() as database_name, @@VERSION as version');
    console.log('Database:', result.recordset[0].database_name);
    console.log('SQL Server Version:', result.recordset[0].version.split('\n')[0]);
    
    // Check for stored procedures
    console.log('\n--- Checking Stored Procedures ---');
    const procedures = [
      'proc_CHutilizedatewise_reportf2',
      'proc_summary_purchase1',
      'proc_CHgetstockfordisbushCurrent',
      'proc_paymentreceived_datewise_data',
      'proc_getpendingpaymentpartywise',
      'proc_gettotalordertill',
      'proc_pettyexpanse_report',
      'proc_drp_sale_report',
      'proc_logindone'
    ];
    
    for (const proc of procedures) {
      const check = await pool.request().query(`
        SELECT COUNT(*) as exists 
        FROM sys.procedures 
        WHERE name = '${proc}'
      `);
      const exists = check.recordset[0].exists > 0;
      console.log(`${exists ? '✅' : '❌'} ${proc}`);
    }
    
    await pool.close();
    console.log('\n✅ Connection test completed successfully!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
