import { useMemo } from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import ContentCutIcon from '@mui/icons-material/ContentCut'

export default function LogCuttingSummaryCharts({ data }) {
  // Process monthly cutting data (single recordset)
  const monthlyCuttingData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    
    // Define month order mapping
    const monthOrder = {
      'Jan': 1, 'January': 1, '01': 1, '1': 1,
      'Feb': 2, 'February': 2, '02': 2, '2': 2,
      'Mar': 3, 'March': 3, '03': 3, '3': 3,
      'Apr': 4, 'April': 4, '04': 4, '4': 4,
      'May': 5, '05': 5, '5': 5,
      'Jun': 6, 'June': 6, '06': 6, '6': 6,
      'Jul': 7, 'July': 7, '07': 7, '7': 7,
      'Aug': 8, 'August': 8, '08': 8, '8': 8,
      'Sep': 9, 'September': 9, '09': 9, '9': 9,
      'Oct': 10, 'October': 10, '10': 10,
      'Nov': 11, 'November': 11, '11': 11,
      'Dec': 12, 'December': 12, '12': 12
    }
    
    // Process and sort data
    const processedData = data.recordsets[0]
      .map(item => {
        const monthValue = item.LOGCUTTING_MONTH || item.MONTHS || item.LOADING_MONTH || ''
        const gainLoss = parseFloat(item.GAINLOSS || item.GAIN_LOSS || 0)
        
        // Get month order, try different formats
        let order = monthOrder[monthValue] || monthOrder[String(monthValue).substring(0, 3)] || 99
        
        return {
          month: monthValue,
          'Gain/Loss': gainLoss,
          monthOrder: order
        }
      })
      .filter(item => item.month) // Remove empty months
      .sort((a, b) => a.monthOrder - b.monthOrder)
    
    return processedData
  }, [data])

  // Get year from metadata
  const year = data?.metadata?.year || new Date().getFullYear()

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #fef3e2 0%, #fed7aa 50%, #fdba74 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #b91c1c 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(234, 88, 12, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <ContentCutIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Log Cutting Summary
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Monthly log cutting gain/loss analysis for {year}
        </Typography>
      </Box>

      {/* Single Chart: LOGCUTTING_MONTH vs GAINLOSS */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#dc2626', mb: 2, textAlign: 'center' }}>
          📈 Monthly Gain/Loss Analysis
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #ffffff 0%, #fef3e2 100%)',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.15)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, monthlyCuttingData.length * 100), height: { xs: 400, md: 500 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCuttingData} margin={{ top: 40, right: 20, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  interval={0}
                  type="category"
                />
                <YAxis 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  width={80}
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
                  cursor={{ fill: 'rgba(220, 38, 38, 0.05)' }}
                />
                <Bar 
                  dataKey="Gain/Loss" 
                  name="Gain/Loss" 
                  radius={[8, 8, 0, 0]}
                >
                  {monthlyCuttingData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry['Gain/Loss'] >= 0 ? '#16a34a' : '#dc2626'} 
                    />
                  ))}
                  <LabelList 
                    dataKey="Gain/Loss" 
                    position="top" 
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      fill: '#374151' 
                    }}
                    formatter={(value) => {
                      if (value === 0) return '0'
                      return value > 0 ? `+${value}` : `${value}`
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          Monthly gain/loss values from log cutting operations for {year}
        </Typography>
      </Box>
    </Box>
  )
}