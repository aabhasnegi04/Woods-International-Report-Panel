import { useMemo, useState } from 'react'
import { Box, Paper, Typography, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PercentIcon from '@mui/icons-material/Percent'
import ShowChartIcon from '@mui/icons-material/ShowChart'

export default function DailyGradingReportCharts({ data }) {
  const [viewMode, setViewMode] = useState('absolute') // 'absolute' or 'percentage'

  // Extract the 3 norm summary tables (recordsets 3, 4, 5)
  const europeData = useMemo(() => {
    if (!data?.recordsets?.[2]?.[0]) return null
    const item = data.recordsets[2][0]
    return {
      norm: 'EUROPE',
      FULL: parseFloat(item.FULL || 0).toFixed(2),
      PART_SHEET: parseFloat(item.PART_SHEET || 0).toFixed(2),
      BANDES: parseFloat(item.BANDES || 0).toFixed(2),
      SM: parseFloat(item.SM || 0).toFixed(2),
      TOTAL: parseFloat(item.TOTAL || 0).toFixed(2),
      FULL_P: (parseFloat(item.FULL_P || 0) * 100).toFixed(2),
      PART_SHEET_P: (parseFloat(item.PART_SHEET_P || 0) * 100).toFixed(2),
      BANDES_P: (parseFloat(item.BANDES_P || 0) * 100).toFixed(2),
      SM_P: (parseFloat(item.SM_P || 0) * 100).toFixed(2),
    }
  }, [data])

  const southEastAsiaData = useMemo(() => {
    if (!data?.recordsets?.[3]?.[0]) return null
    const item = data.recordsets[3][0]
    return {
      norm: 'SOUTH EAST ASIA',
      FULL: parseFloat(item.FULL || 0).toFixed(2),
      PART_SHEET: parseFloat(item.PART_SHEET || 0).toFixed(2),
      BANDES: parseFloat(item.BANDES || 0).toFixed(2),
      SM: parseFloat(item.SM || 0).toFixed(2),
      TOTAL: parseFloat(item.TOTAL || 0).toFixed(2),
      FULL_P: (parseFloat(item.FULL_P || 0) * 100).toFixed(2),
      PART_SHEET_P: (parseFloat(item.PART_SHEET_P || 0) * 100).toFixed(2),
      BANDES_P: (parseFloat(item.BANDES_P || 0) * 100).toFixed(2),
      SM_P: (parseFloat(item.SM_P || 0) * 100).toFixed(2),
    }
  }, [data])

  const indiaData = useMemo(() => {
    if (!data?.recordsets?.[4]?.[0]) return null
    const item = data.recordsets[4][0]
    return {
      norm: 'INDIA',
      FULL: parseFloat(item.FULL || 0).toFixed(2),
      PART_SHEET: parseFloat(item.PART_SHEET || 0).toFixed(2),
      BANDES: parseFloat(item.BANDES || 0).toFixed(2),
      SM: parseFloat(item.SM || 0).toFixed(2),
      TOTAL: parseFloat(item.TOTAL || 0).toFixed(2),
      FULL_P: (parseFloat(item.FULL_P || 0) * 100).toFixed(2),
      PART_SHEET_P: (parseFloat(item.PART_SHEET_P || 0) * 100).toFixed(2),
      BANDES_P: (parseFloat(item.BANDES_P || 0) * 100).toFixed(2),
      SM_P: (parseFloat(item.SM_P || 0) * 100).toFixed(2),
    }
  }, [data])

  // Prepare chart data for each norm
  const prepareChartData = (normData) => {
    if (!normData) return []
    if (viewMode === 'percentage') {
      return [
        { category: 'Full', value: parseFloat(normData.FULL_P), color: '#10b981' },
        { category: 'Part Sheet', value: parseFloat(normData.PART_SHEET_P), color: '#3b82f6' },
        { category: 'Bandes', value: parseFloat(normData.BANDES_P), color: '#f59e0b' },
        { category: 'SM', value: parseFloat(normData.SM_P), color: '#ef4444' },
      ]
    } else {
      return [
        { category: 'Full', value: parseFloat(normData.FULL), color: '#10b981' },
        { category: 'Part Sheet', value: parseFloat(normData.PART_SHEET), color: '#3b82f6' },
        { category: 'Bandes', value: parseFloat(normData.BANDES), color: '#f59e0b' },
        { category: 'SM', value: parseFloat(normData.SM), color: '#ef4444' },
      ]
    }
  }

  const europeChartData = prepareChartData(europeData)
  const southEastAsiaChartData = prepareChartData(southEastAsiaData)
  const indiaChartData = prepareChartData(indiaData)

  const grandTotal = useMemo(() => {
    const total = (parseFloat(europeData?.TOTAL || 0) + parseFloat(southEastAsiaData?.TOTAL || 0) + parseFloat(indiaData?.TOTAL || 0)).toFixed(2)
    return total
  }, [europeData, southEastAsiaData, indiaData])

  const renderNormChart = (normName, chartData, normData, bgGradient, borderColor) => {
    if (!normData) return null

    return (
      <Box sx={{ mb: 4, px: 0 }}>
        {/* Prominent Norm Header */}
        <Paper sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <Typography sx={{ 
            fontSize: { xs: 18, md: 22 }, 
            fontWeight: 900, 
            color: 'white', 
            textAlign: 'center',
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>
            🌍 {normName}
          </Typography>
          <Typography sx={{ 
            fontSize: { xs: 11, md: 13 }, 
            color: 'rgba(255,255,255,0.9)', 
            textAlign: 'center',
            mt: 0.5,
            fontWeight: 600
          }}>
            Total: {normData.TOTAL} CBM
          </Typography>
        </Paper>
        
        <Paper sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          borderRadius: 0, 
          border: '3px solid #ec4899',
          background: bgGradient,
          boxShadow: '0 8px 24px rgba(190, 24, 93, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: '100%', height: { xs: 300, md: 350 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  stroke="transparent"
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="transparent"
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  width={50}
                  label={viewMode === 'percentage' ? { value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } } : undefined}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
                    border: '2px solid #ec4899',
                    borderRadius: 12,
                    fontSize: 13,
                    padding: '12px 16px',
                    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
                    fontWeight: 600
                  }}
                  cursor={{ stroke: 'rgba(236, 72, 153, 0.3)', strokeWidth: 2 }}
                  labelStyle={{ 
                    color: '#be185d', 
                    fontWeight: 700, 
                    fontSize: 14,
                    marginBottom: 8,
                    borderBottom: '2px solid #fbcfe8',
                    paddingBottom: 6
                  }}
                  formatter={(value) => [
                    viewMode === 'percentage' ? `${value}%` : `${value} CBM`,
                    viewMode === 'percentage' ? 'Percentage' : 'CBM'
                  ]}
                  labelFormatter={(label) => `📦 ${label}`}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <AssessmentIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Daily Grading Report
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Norm-wise sheet category analysis
        </Typography>
        {data?.metadata?.fromDate && data?.metadata?.toDate && (
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap'
          }}>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 14, md: 16 }, 
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              px: 2,
              py: 0.5,
              borderRadius: 1
            }}>
              📅 {data.metadata.fromDate}
            </Typography>
            <Typography sx={{ color: 'white', fontSize: { xs: 14, md: 16 }, fontWeight: 700 }}>
              to
            </Typography>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 14, md: 16 }, 
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              px: 2,
              py: 0.5,
              borderRadius: 1
            }}>
              📅 {data.metadata.toDate}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Summary Card */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Paper sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
          borderRadius: 0,
          boxShadow: '0 8px 24px rgba(219, 39, 119, 0.4)',
          border: '2px solid rgba(255,255,255,0.3)',
          textAlign: 'center',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600, mb: 0.5 }}>
            Total CBM (All Norms)
          </Typography>
          <Typography sx={{ color: 'white', fontSize: { xs: 36, md: 44 }, fontWeight: 900, lineHeight: 1 }}>
            {grandTotal}
          </Typography>
        </Paper>
      </Box>

      {/* Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="medium"
          sx={{
            '& .MuiToggleButton-root': {
              px: { xs: 2, md: 3 },
              py: 1,
              fontSize: { xs: 12, md: 14 },
              fontWeight: 700,
              textTransform: 'none',
              border: '2px solid #f9a8d4',
              color: '#be185d',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                }
              },
              '&:hover': {
                background: '#fce7f3',
              }
            }
          }}
        >
          <ToggleButton value="absolute">
            <ShowChartIcon sx={{ fontSize: 18, mr: 0.5 }} />
            CBM Values
          </ToggleButton>
          <ToggleButton value="percentage">
            <PercentIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Percentage
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Charts for each norm */}
      {renderNormChart('🇪🇺 Europe Norm', europeChartData, europeData, 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)', '#f9a8d4')}
      {renderNormChart('🌏 South East Asia Norm', southEastAsiaChartData, southEastAsiaData, 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)', '#f9a8d4')}
      {renderNormChart('🇮🇳 India Norm', indiaChartData, indiaData, 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)', '#f9a8d4')}
    </Box>
  )
}
