import { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Grid, Card, CardContent } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AnalyticsIcon from '@mui/icons-material/Analytics'

export default function LogInvoiceSummaryCharts({ data }) {
  // Process monthly invoice data (single recordset)
  const monthlyInvoiceData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    const monthOrder = {
      'Jan': 1, 'January': 1,
      'Feb': 2, 'February': 2,
      'Mar': 3, 'March': 3,
      'Apr': 4, 'April': 4,
      'May': 5,
      'Jun': 6, 'June': 6,
      'Jul': 7, 'July': 7,
      'Aug': 8, 'August': 8,
      'Sep': 9, 'September': 9,
      'Oct': 10, 'October': 10,
      'Nov': 11, 'November': 11,
      'Dec': 12, 'December': 12
    }
    
    return data.recordsets[0]
      .map(item => ({
        month: item.MONTHS || '',
        fullMonth: item.LOADING_MONTH || item.MONTHS || '',
        'Log Count': item.NO_OF_LOGS || 0,
        'Invoice CBM': parseFloat(item.INVOICE_CBM || 0),
        'Total Value': parseFloat(item.TOTAL_VALUE || 0),
        'Average Rate': parseFloat(item.AVERAGE_RATE || 0),
        monthOrder: monthOrder[item.MONTHS || ''] || 99
      }))
      .sort((a, b) => a.monthOrder - b.monthOrder)
  }, [data])

  // Calculate totals
  const totals = useMemo(() => {
    return monthlyInvoiceData.reduce((acc, item) => ({
      totalLogs: acc.totalLogs + item['Log Count'],
      totalCBM: acc.totalCBM + item['Invoice CBM'],
      totalValue: acc.totalValue + item['Total Value'],
      avgRate: monthlyInvoiceData.length > 0 ? acc.totalValue / acc.totalCBM : 0
    }), { totalLogs: 0, totalCBM: 0, totalValue: 0, avgRate: 0 })
  }, [monthlyInvoiceData])

  // Get year from metadata
  const year = data?.metadata?.year || new Date().getFullYear()

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(29, 78, 216, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <ReceiptIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Log Invoice Summary
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Monthly invoice analysis with values and rates for {year}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, px: 0 }}>
        <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(29, 78, 216, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <ReceiptIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totals.totalLogs.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Total Logs Invoiced
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <TrendingUpIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totals.totalCBM.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Total Invoice CBM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <AttachMoneyIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ₹{(totals.totalValue / 100000).toFixed(1)}L
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Total Invoice Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(96, 165, 250, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <AnalyticsIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ₹{totals.totalCBM > 0 ? (totals.totalValue / totals.totalCBM).toFixed(0) : '0'}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Average Rate/CBM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Monthly Invoice Value Bar Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#1e40af', mb: 2, textAlign: 'center' }}>
            💰 Monthly Invoice Value Trend ({year})
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none', 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            boxShadow: '0 8px 24px rgba(30, 64, 175, 0.15)',
            outline: 'none',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' }
          }}>
            <Box sx={{ width: Math.max(600, monthlyInvoiceData.length * 100), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyInvoiceData} margin={{ top: 20, right: 20, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#374151" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#374151" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    width={80}
                    domain={[0, 'dataMax + 100000']}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '2px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 13,
                      padding: '12px 16px',
                      fontWeight: 600
                    }}
                    cursor={{ fill: 'rgba(30, 64, 175, 0.05)' }}
                    formatter={(value, name) => [
                      name === 'Total Value' ? `₹${(value / 100000).toFixed(2)}L` : value.toLocaleString(),
                      name
                    ]}
                  />
                  <Bar dataKey="Total Value" fill="#1d4ed8" name="Invoice Value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
            Monthly invoice value trends for {year}
          </Typography>
        </Box>
      </Box>

      {/* CBM vs Value Comparison Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#2563eb', mb: 2, textAlign: 'center' }}>
            📊 Monthly CBM & Invoice Value Comparison
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none', 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
            outline: 'none',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' }
          }}>
            <Box sx={{ width: Math.max(600, monthlyInvoiceData.length * 100), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyInvoiceData.map(item => ({
                  ...item,
                  'CBM (×100)': item['Invoice CBM'] * 100, // Scale CBM by 100 to make it visible
                  'Value (₹L)': item['Total Value'] / 100000 // Convert to Lakhs
                }))} margin={{ top: 20, right: 20, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#374151" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#374151" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    width={60}
                    domain={[0, 'dataMax + 100']}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '2px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 13,
                      padding: '12px 16px',
                      fontWeight: 600
                    }}
                    cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                    formatter={(value, name) => {
                      if (name === 'CBM (×100)') {
                        return [`${(value / 100).toFixed(2)} CBM`, 'Invoice CBM']
                      }
                      if (name === 'Value (₹L)') {
                        return [`₹${value.toFixed(2)}L`, 'Invoice Value']
                      }
                      return [value, name]
                    }}
                  />
                  <Bar dataKey="CBM (×100)" fill="#3b82f6" name="CBM (×100)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Value (₹L)" fill="#1d4ed8" name="Value (₹L)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
            Blue bars show CBM (scaled ×100) and dark blue bars show invoice value in Lakhs
          </Typography>
        </Box>
      </Box>

      {/* Average Rate Trend Analysis */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#3b82f6', mb: 2, textAlign: 'center' }}>
          📈 Average Rate Trend Analysis
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, monthlyInvoiceData.length * 100), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyInvoiceData} margin={{ top: 20, right: 20, left: 20, bottom: 70 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  interval={0}
                />
                <YAxis 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  width={80}
                  domain={[0, 'dataMax + 1000']}
                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '2px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13,
                    padding: '12px 16px',
                    fontWeight: 600
                  }}
                  formatter={(value, name) => [`₹${value.toFixed(2)}/CBM`, name]}
                />
                <Area 
                  type="monotone" 
                  dataKey="Average Rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fill="url(#rateGradient)"
                  dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          Monthly average rate per CBM trends and pricing patterns
        </Typography>
      </Box>
    </Box>
  )
}