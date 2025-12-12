import { useMemo, useState } from 'react'
import { Button, Fab } from '@mui/material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { getTableDensity } from './table/density'
import ContainerLoadingCharts from './charts/ContainerLoadingCharts'
import ContainerMonthWiseCharts from './charts/ContainerMonthWiseCharts'
import ContainerClientWiseCharts from './charts/ContainerClientWiseCharts'
import DateWiseGradingCharts from './charts/DateWiseGradingCharts'
import GradingSummaryCharts from './charts/GradingSummaryCharts'
import DailyGradingReportCharts from './charts/DailyGradingReportCharts'
import ExportOptions from './ExportOptions'
import { exportData } from './exportUtils'

function ResultTable({ rows, title }) {
  const keys = rows.length ? Object.keys(rows[0] || {}) : []
  const { fontSize, cellPadding } = getTableDensity(keys.length)
  const [sort, setSort] = useState({ key: '', dir: 'asc' })
  const minTableWidth = Math.max(680, keys.length * Math.max(110, fontSize * 9))

  // Map database column names to display names
  const getDisplayName = (columnName) => {
    const columnMap = {
      'CLIENT_NAME': 'Client Name',
      'Client_Name': 'Client Name',
      'MTD_CONTAINER': 'Current Month',
      'PREVMONTH_CONTAINER': 'Previous Month',
      'MONTHS': 'Month',
      'LOADING_MONTH': 'Loading Month',
      'NO_OF_CONTAINER_2025': 'Containers 2025',
      'NO_OF_CONTAINER': 'Containers',
      'ContainerNo': 'Container No',
      'Container_Completed_date': 'Completion Date',
      'Destination': 'Destination',
      'Qty': 'Quantity',
      'Amount': 'Amount',
      // Date Wise Grading columns
      'PALLET_NO': 'Pallet No',
      'GRADING_NORMS': 'Grading Norms',
      'GRADE': 'Grade',
      'LENGTH': 'Length',
      'WIDTH': 'Width',
      'HEIGHT': 'Height',
      'THICKNESS': 'Thickness',
      'PCS': 'Pieces',
      'CBM': 'CBM',
      'ENTRY_DATE': 'Entry Date',
      'GRADER_NAME': 'Grader Name',
      'user_id': 'User ID',
      'workorderno': 'Work Order No',
      'slip_no': 'Slip No',
      'QUALITY_NAME': 'Quality Name',
      'EUROPE': 'Europe',
      'SOUTH_EAST_ASIA': 'South East Asia',
      'INDIA': 'India',
      'WIDTH_CAT': 'Width Category',
      'SHEETS': 'Sheets',
      'FULL': 'Full',
      'PART_SHEET': 'Part Sheet',
      'BANDES': 'Bandes',
      'SM': 'SM',
      'TOTAL_CBM': 'Total CBM',
      'FULL_P': 'Full %',
      'PART_SHEET_P': 'Part Sheet %',
      'BANDES_P': 'Bandes %',
      'SM_P': 'SM %',
      // Grading Summary columns
      'DATE': 'Date',
      'DAY': 'Day',
      'GRADE-1': 'Grade 1',
      'GRADE-2': 'Grade 2',
      'GRADE-3': 'Grade 3',
      'GRADE-4': 'Grade 4',
      'GRADE-5': 'Grade 5',
      'GRADE-6': 'Grade 6',
      'TOTAL': 'Total CBM',
      'GRADE-1P': 'Grade 1 %',
      'GRADE-2P': 'Grade 2 %',
      'GRADE-3P': 'Grade 3 %',
      'GRADE-4P': 'Grade 4 %',
      'GRADE-5P': 'Grade 5 %',
      'GRADE-6P': 'Grade 6 %'
    }
    return columnMap[columnName] || columnName
  }

  function toggleSort(columnKey) {
    setSort((prev) => {
      if (prev.key !== columnKey) return { key: columnKey, dir: 'asc' }
      if (prev.dir === 'asc') return { key: columnKey, dir: 'desc' }
      return { key: '', dir: 'asc' }
    })
  }

  const sortedRows = useMemo(() => {
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
    
    // If no sort is applied, check if there's a month column and auto-sort by it
    if (!sort.key) {
      const monthColumn = keys.find(k => k.toLowerCase().includes('month'))
      if (monthColumn) {
        const rowsCopy = [...rows]
        rowsCopy.sort((a, b) => {
          const av = a[monthColumn]
          const bv = b[monthColumn]
          const monthA = monthOrder[String(av).substring(0, 3)] || monthOrder[av] || 99
          const monthB = monthOrder[String(bv).substring(0, 3)] || monthOrder[bv] || 99
          return monthA - monthB
        })
        return rowsCopy
      }
      return rows
    }
    
    const key = sort.key
    const isNumericColumn = rows.some((r) => typeof r[key] === 'number' || /^\d+(\.\d+)?$/.test(String(r[key] ?? '')))
    const isDateColumn = key.toLowerCase().includes('date')
    const isMonthColumn = key.toLowerCase().includes('month')
    
    const rowsCopy = [...rows]
    rowsCopy.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av == null && bv == null) return 0
      if (av == null) return -1
      if (bv == null) return 1
      if (isMonthColumn) {
        const monthA = monthOrder[String(av).substring(0, 3)] || monthOrder[av] || 99
        const monthB = monthOrder[String(bv).substring(0, 3)] || monthOrder[bv] || 99
        return monthA - monthB
      }
      if (isDateColumn) {
        const dateA = new Date(av)
        const dateB = new Date(bv)
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateA - dateB
        }
      }
      if (isNumericColumn) {
        const an = typeof av === 'number' ? av : Number(av)
        const bn = typeof bv === 'number' ? bv : Number(bv)
        return an === bn ? 0 : an < bn ? -1 : 1
      }
      return String(av).localeCompare(String(bv))
    })
    if (sort.dir === 'desc') rowsCopy.reverse()
    return rowsCopy
  }, [rows, sort, keys])

  return (
    <Paper
      sx={{
        p: 0,
        borderRadius: 0,
        overflow: 'hidden',
        border: '1px solid rgba(79, 70, 229, 0.1)',
        background: '#ffffff',
        boxShadow: '0 8px 32px rgba(79, 70, 229, 0.12)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899, #f59e0b)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite'
        },
        '@keyframes shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }}
    >
      <Box sx={{ width: '100%' }}>
        {!rows.length ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">No rows</Typography>
          </Box>
        ) : (
          <>
            {/* Table Title - Fixed outside scroll area */}
            <Box sx={{
              p: { xs: 1.5, md: 3 }, 
              fontWeight: 800, 
              fontSize: { xs: '0.875rem', md: '1.3rem' },
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              textAlign: 'center',
              letterSpacing: 0.5,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}>
              {title}
            </Box>
            
            {/* Mobile scroll hint */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              justifyContent: 'center', 
              px: 2, 
              py: 1,
              background: 'rgba(99, 102, 241, 0.05)'
            }}>
              <Typography sx={{ fontSize: 10, color: '#6366f1', fontWeight: 600, textAlign: 'center' }}>
                ← Swipe to see all columns →
              </Typography>
            </Box>
            <Box sx={{ 
              width: '100%', 
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                height: { xs: 4, md: 8 }
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f5f9'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: 2
              }
            }}>
            <Box
              component="table"
              sx={{
                width: 'auto',
                minWidth: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                tableLayout: 'auto',
                '& thead th': {
                  position: 'sticky',
                  top: 0,
                  zIndex: 3,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  backdropFilter: 'blur(12px)',
                  textTransform: 'uppercase',
                  letterSpacing: { xs: 0.5, md: 1.2 },
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: { xs: '10px', md: `${fontSize + 1}px` },
                  borderBottom: 'none',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  padding: { xs: '10px 8px', md: '14px 18px' },
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                },
                '& tbody tr:nth-of-type(odd) td': {
                  backgroundColor: '#fef3c7',
                },
                '& tbody tr:nth-of-type(even) td': {
                  backgroundColor: '#fef9e7',
                },
                '& tbody tr:hover td': {
                  backgroundColor: '#fde68a',
                  transition: 'all 0.2s ease-in-out',
                },
                '& tbody tr': {
                  transition: 'all 0.2s ease-in-out',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                  '&:last-child td': {
                    borderBottom: 'none'
                  }
                },
                '& th, & td': {
                  borderRight: '1px solid rgba(251, 191, 36, 0.2)',
                  padding: { xs: '8px 12px', md: '12px 20px' },
                  fontSize: { xs: '11px', md: `${fontSize}px` },
                  fontWeight: 500,
                  lineHeight: 1.4,
                  position: 'relative',
                  whiteSpace: 'nowrap'
                },
                '& th:last-of-type, & td:last-of-type': { borderRight: 'none' },
                '& td': {
                  color: '#334155',
                  transition: 'all 0.2s ease-in-out',
                  textAlign: 'center'
                },
                '& td[data-numeric="true"]': {
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#1e293b',
                  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace'
                },
              }}
            >
              <Box component="thead">
                {/* Column Headers Row */}
                <Box component="tr">
                  {keys.map((k) => {
                    const displayName = getDisplayName(k)
                    const isRight = /^(hp|qty|sum|total|count|num|cbm|sqm|sqft)/i.test(k)
                    const isActive = sort.key === k
                    const arrow = isActive ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''
                    return (
                      <Box
                        key={k}
                        component="th"
                        onClick={() => toggleSort(k)}
                        sx={{
                          cursor: 'pointer',
                          userSelect: 'none',
                          textAlign: isRight ? 'right' : 'left',
                          p: { xs: `${Math.max(6, cellPadding)}px`, md: `${cellPadding + 2}px` },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isRight ? `${displayName}${arrow}` : `${displayName}${arrow}`}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box component="tbody">
                {sortedRows.map((row, idx) => (
                  <Box key={idx} component="tr">
                    {keys.map((k) => (
                      <Box
                        key={k}
                        component="td"
                        data-numeric={typeof row[k] === 'number' || /^(hp|qty|sum|total|count|num|cbm|sqm|sqft|value|price|amount)/i.test(k)}
                        sx={{
                          p: { xs: `${Math.max(8, cellPadding)}px`, md: `${cellPadding + 4}px` },
                          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                          fontSize: { xs: `${Math.max(11, fontSize)}px`, md: `${fontSize + 1}px` },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: typeof row[k] === 'number' || /^(hp|qty|sum|total|count|num|cbm|sqm|sqft|value|price|amount)/i.test(k) ? 'right' : 'left',
                          fontWeight: typeof row[k] === 'number' ? 600 : 500,
                          color: typeof row[k] === 'number' ? '#1e293b' : '#334155',
                          fontFamily: typeof row[k] === 'number' ? '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace' : 'inherit',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {(() => {
                          // Format dates to DD/MM/YYYY
                          if (k.toLowerCase().includes('date') && row[k]) {
                            try {
                              const date = new Date(row[k])
                              if (!isNaN(date.getTime())) {
                                const day = String(date.getDate()).padStart(2, '0')
                                const month = String(date.getMonth() + 1).padStart(2, '0')
                                const year = date.getFullYear()
                                return `${day}/${month}/${year}`
                              }
                            } catch (e) {
                              // Fallback to original value if date parsing fails
                            }
                          }
                          
                          // Format currency for numbers > 1000
                          if (typeof row[k] === 'number' && row[k] > 1000) {
                            return `₹${row[k].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          }
                          
                          return String(row[k])
                        })()}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          </>
        )}
      </Box>
    </Paper>
  )
}

export default function ReportViewer({ response, reportTitle = 'Result' }) {
  // Check report types first
  const isContainerLoadingReport = response?.recordsets?.length === 2 && reportTitle === 'Container Loading'
  const isContainerMonthWiseReport = reportTitle === 'Container Month Wise'
  const isContainerClientWiseReport = reportTitle === 'Container Client Wise'
  const isDateWiseGradingReport = reportTitle === 'Date Wise Grading'
  const isGradingSummaryReport = reportTitle === 'Grading Summary'
  const isDailyGradingReport = reportTitle === 'Daily Grading Report'
  
  // Swap recordsets for Date Wise Grading (show Thickness Summary first, then Detailed Data)
  const recordsets = useMemo(() => {
    const sets = response?.recordsets || []
    if (isDateWiseGradingReport && sets.length === 2) {
      return [sets[1], sets[0]] // Swap: [Thickness Summary, Detailed Grading Data]
    }
    return sets
  }, [response?.recordsets, isDateWiseGradingReport])
  
  // Create swapped response for charts
  const chartResponse = useMemo(() => {
    if (isDateWiseGradingReport && response?.recordsets?.length === 2) {
      return { ...response, recordsets }
    }
    return response
  }, [response, recordsets, isDateWiseGradingReport])
  
  const first = recordsets[0] || []
  const sectionRefs = useMemo(() => recordsets.map(() => ({ current: null })), [recordsets.length])
  
  // Export state
  const [isExporting, setIsExporting] = useState(false)
  
  // Prepare chart data for export
  const chartData = useMemo(() => {
    if (!response?.recordsets) return []
    // No special chart data needed for container reports currently
    return []
  }, [response])
  
  const handleExport = async (exportType, exportFormat, includeCharts = false) => {
    setIsExporting(true)
    try {
      const success = await exportData(exportType, exportFormat, response, chartData, reportTitle, includeCharts)
      if (success) {
        console.log('Export completed successfully')
        if (includeCharts) {
          alert('Export completed! Excel file and chart images have been downloaded.')
        }
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed: ' + error.message)
    } finally {
      setIsExporting(false)
    }
  }

  function scrollToSection(index) {
    const ref = sectionRefs[index]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }



  return (
    <Stack spacing={3} sx={{ width: '100%', m: 0, p: 0 }}>
      {/* Custom Charts for Container Loading Report */}
      {isContainerLoadingReport && (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
          <ContainerLoadingCharts data={response} />
          {/* Export Button - positioned at bottom of charts */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            mt: 2,
            px: 0,
            py: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
        </Box>
      )}
      

      {/* Custom Charts for Container Month Wise Report */}
      {isContainerMonthWiseReport && (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
          <ContainerMonthWiseCharts data={response} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            mt: 2,
            px: 0,
            py: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
        </Box>
      )}
      
      {/* Custom Charts for Container Client Wise Report */}
      {isContainerClientWiseReport && (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
          <ContainerClientWiseCharts data={response} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            mt: 2,
            px: 0,
            py: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
        </Box>
      )}
      
      {/* Custom Charts for Date Wise Grading Report */}
      {isDateWiseGradingReport && (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
          <DateWiseGradingCharts data={chartResponse} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            mt: 2,
            px: 0,
            py: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
        </Box>
      )}
      
      {/* Custom Charts for Grading Summary Report */}
      {isGradingSummaryReport && (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
          <GradingSummaryCharts data={response} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            mt: 2,
            px: 0,
            py: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
        </Box>
      )}
      
      {/* Custom Charts for Daily Grading Report */}
      {isDailyGradingReport && (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
          <DailyGradingReportCharts data={response} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            mt: 2,
            px: 0,
            py: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
        </Box>
      )}
      
      {/* Table Navigation */}
      {recordsets.length > 1 && (
        <Paper sx={{ 
          mx: 0, 
          p: { xs: 2, sm: 2.5, md: 3 }, 
          borderRadius: 0, 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 8px 24px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.6)
          `,
          border: '1px solid rgba(148, 163, 184, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: { xs: '3px', md: '4px' },
            background: 'linear-gradient(90deg, #f59e0b, #ef4444, #ec4899, #8b5cf6, #10b981)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite'
          },
          '@keyframes shimmer': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' }
          }
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 800, 
            mb: { xs: 2, sm: 2.5, md: 3 }, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
            📊 Report Tables
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', justifyContent: 'center' }}>
            {recordsets.map((_, idx) => {
              const containerTableNames = ['Client-wise Container Loading', 'Monthly Container Trend 2025']
              const gradingTableNames = ['Thickness Summary', 'Detailed Grading Data'] // Swapped order
              const dailyGradingTableNames = [
                'Europe Norm Details',
                'South East Asia Norm Details', 
                'Europe Summary',
                'South East Asia Summary',
                'India Norm Details',
                'India Summary',
                'Grading Norms Summary'
              ]
              const tableNames = isContainerLoadingReport 
                ? containerTableNames 
                : isDateWiseGradingReport 
                  ? gradingTableNames 
                  : isDailyGradingReport
                    ? dailyGradingTableNames
                    : []
              return (
              <Button
                key={idx}
                  size="large"
                  variant="contained"
                onClick={() => scrollToSection(idx)}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    letterSpacing: { xs: 0.3, md: 0.5 },
                    borderRadius: { xs: 2, md: 3 },
                    px: { xs: 2, sm: 2.5, md: 3 },
                    py: { xs: 1, sm: 1.25, md: 1.5 },
                    background: isDailyGradingReport 
                      ? 'linear-gradient(135deg, #ec4899, #db2777)'
                      : idx % 2 === 0 
                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                        : 'linear-gradient(135deg, #ec4899, #db2777)',
                    boxShadow: isDailyGradingReport 
                      ? '0 8px 24px rgba(236, 72, 153, 0.3)'
                      : '0 8px 24px rgba(139, 92, 246, 0.3)',
                    border: 'none',
                    color: 'white',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                    transition: 'all 0.3s ease-in-out',
                    minWidth: { xs: 'auto', sm: 'auto' },
                    '&:hover': {
                      background: isDailyGradingReport
                        ? 'linear-gradient(135deg, #db2777, #be185d)'
                        : idx % 2 === 0 
                          ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' 
                          : 'linear-gradient(135deg, #db2777, #be185d)',
                      boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  {tableNames[idx] || `${reportTitle} (${idx + 1})`}
              </Button>
              )
            })}
          </Box>
        </Paper>
      )}

      {/* Tables */}
      {!first.length ? (
        <Paper sx={{ p: 3, borderRadius: 0, textAlign: 'center', mx: 0 }}>
          <Typography color="text.secondary" variant="h6">No data available</Typography>
        </Paper>
      ) : (
        recordsets.map((rows, idx) => {
          const containerTableNames = ['Client-wise Container Loading', 'Monthly Container Trend 2025']
          const gradingTableNames = ['Thickness Summary', 'Detailed Grading Data'] // Swapped order
          const dailyGradingTableNames = [
            'Europe Norm Details',
            'South East Asia Norm Details', 
            'Europe Summary',
            'South East Asia Summary',
            'India Norm Details',
            'India Summary',
            'Grading Norms Summary'
          ]
          const tableNames = isContainerLoadingReport 
            ? containerTableNames 
            : isDateWiseGradingReport 
              ? gradingTableNames 
              : isDailyGradingReport
                ? dailyGradingTableNames
                : []
          const tableTitle = (isContainerLoadingReport || isDateWiseGradingReport || isDailyGradingReport) ? tableNames[idx] : `${reportTitle} ${recordsets.length > 1 ? `(${idx + 1})` : ''}`
          
          return (
          <Box key={idx} ref={(el) => (sectionRefs[idx].current = el)} sx={{ mb: 0, px: 0, width: '100%' }}>
            <ResultTable rows={rows} title={tableTitle} />
          </Box>
          )
        })
      )}
      
      {/* Scroll to Top Button */}
      <Fab
        onClick={scrollToTop}
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #8B6F47, #D4A574)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6B5536, #B8895E)',
            boxShadow: '0 12px 32px rgba(139, 92, 246, 0.6)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
        size="medium"
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Stack>
  )
}


