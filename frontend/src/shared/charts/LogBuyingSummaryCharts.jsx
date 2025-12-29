import { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Grid, Card, CardContent } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function LogBuyingSummaryCharts({ data }) {
  // Process monthly buying data (single recordset)
  const monthlyBuyingData = useMemo(() => {
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
        month: item.MONTHS || item.LOADING_MONTH || '',
        fullMonth: item.LOADING_MONTH || item.MONTHS || '',
        'Log Count': item.NO_OF_LOGS || 0,
        'CBM Bordereau': parseFloat(item.CBM_BORDEREAU || 0),
        'Actual CBM': parseFloat(item.BORD_ACTUAL_CBM || 0),
        monthOrder: monthOrder[item.MONTHS || item.LOADING_MONTH || ''] || 99
      }))
      .sort((a, b) => a.monthOrder - b.monthOrder)
  }, [data])

  // Calculate totals
  const totals = useMemo(() => {
    return monthlyBuyingData.reduce((acc, item) => ({
      totalLogs: acc.totalLogs + item['Log Count'],
      totalBordereau: acc.totalBordereau + item['CBM Bordereau'],
      totalActual: acc.totalActual + item['Actual CBM']
    }), { totalLogs: 0, totalBordereau: 0, totalActual: 0 })
  }, [monthlyBuyingData])

  // Get year from metadata
  const year = data?.metadata?.year || new Date().getFullYear()

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(5, 150, 105, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <ShoppingCartIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Log Buying Summary
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Monthly log purchasing analysis for {year}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, px: 0 }}>
        <Grid container spacing={2} sx={{ maxWidth: 900 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)',
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
                <ShoppingCartIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
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
                  Total Logs Bought
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
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
                  {totals.totalBordereau.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  CBM Bordereau
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(52, 211, 153, 0.3)',
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
                <CalendarMonthIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
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
                  {totals.totalActual.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Actual CBM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Monthly Log Count Bar Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#047857', mb: 2, textAlign: 'center' }}>
            📊 Monthly Log Buying Trend ({year})
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none', 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            boxShadow: '0 8px 24px rgba(4, 120, 87, 0.15)',
            outline: 'none',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' }
          }}>
            <Box sx={{ width: Math.max(600, monthlyBuyingData.length * 100), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBuyingData} margin={{ top: 20, right: 20, left: 20, bottom: 70 }}>
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
                    domain={[0, 'dataMax + 10']}
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
                    cursor={{ fill: 'rgba(4, 120, 87, 0.05)' }}
                  />
                  <Bar dataKey="Log Count" fill="#059669" name="Logs Bought" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
            Monthly log purchasing volume for {year}
          </Typography>
        </Box>
      </Box>

      {/* CBM Comparison Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#10b981', mb: 2, textAlign: 'center' }}>
            📈 CBM Analysis - Bordereau vs Actual
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none', 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
            outline: 'none',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' }
          }}>
            <Box sx={{ width: Math.max(600, monthlyBuyingData.length * 100), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyBuyingData} margin={{ top: 20, right: 20, left: 20, bottom: 70 }}>
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
                    domain={[0, 'dataMax + 10']}
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
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  />
                  <Bar dataKey="CBM Bordereau" fill="#059669" name="CBM Bordereau" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual CBM" fill="#10b981" name="Actual CBM" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
            Comparison of planned vs actual CBM values by month
          </Typography>
        </Box>
      </Box>

      {/* Trend Analysis */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#34d399', mb: 2, textAlign: 'center' }}>
          📈 Log Buying Trend Analysis
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          boxShadow: '0 8px 24px rgba(52, 211, 153, 0.15)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, monthlyBuyingData.length * 100), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBuyingData} margin={{ top: 20, right: 20, left: 20, bottom: 70 }}>
                <defs>
                  <linearGradient id="logBuyingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
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
                  width={60}
                  domain={[0, 'dataMax + 10']}
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
                />
                <Area 
                  type="monotone" 
                  dataKey="Log Count" 
                  stroke="#34d399" 
                  strokeWidth={3}
                  fill="url(#logBuyingGradient)"
                  dot={{ fill: '#34d399', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          Seasonal trends and patterns in log purchasing activity
        </Typography>
      </Box>
    </Box>
  )
}