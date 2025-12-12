import { useMemo, useState, useEffect } from 'react'
import { Box, Button, Paper, Stack, Typography, FormControl, InputLabel, Select, MenuItem, Fab } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import ReportViewer from './ReportViewer'

export default function ReportRunner({ selectedReport }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [year, setYear] = useState(new Date().getFullYear())
  const [client, setClient] = useState('')
  const [clients, setClients] = useState([])
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const reportTitle = useMemo(() => {
    const names = {
      container_loading_report: 'Container Loading',
      container_month_wise: 'Container Month Wise',
      container_client_wise: 'Container Client Wise',
      date_wise_grading: 'Date Wise Grading',
      grading_summary: 'Grading Summary',
      daily_grading_report: 'Daily Grading Report',
    }
    return names[selectedReport] || 'Result'
  }, [selectedReport])

  const reportMap = useMemo(() => {
      return {
      container_loading_report: 'proc_get_summary_container',
      container_month_wise: 'proc_getcontainersumyear',
      container_client_wise: 'proc_getcontainerclientwise',
      date_wise_grading: 'proc_gradesearchreport_date22',
      grading_summary: 'proc_gradesearchreport_grade22',
      daily_grading_report: 'proc_gradesearch_partsheet_Norm',
    }
  }, [])

  // Load clients on component mount
  useEffect(() => {
    if (selectedReport === 'container_client_wise') {
      fetchClients()
    }
  }, [selectedReport])

  async function fetchClients() {
    try {
      let apiBase = (typeof __API_BASE__ !== 'undefined' && __API_BASE__) ? __API_BASE__ : ''
      if (!apiBase && typeof window !== 'undefined') {
        const host = window.location.hostname
        if (host === 'report.akstrends.in' || host.endsWith('.report.akstrends.in')) {
          apiBase = 'https://adm.akstrends.in'
        }
      }
      const response = await fetch(`${apiBase}/api/clients`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  function buildParams() {
    if (selectedReport === 'container_loading_report') {
      return {}
    } else if (selectedReport === 'container_month_wise') {
      return { year: year }
    } else if (selectedReport === 'container_client_wise') {
      return { 
        year: year,
        client: client || ''
      }
    } else if (selectedReport === 'date_wise_grading') {
      return {
        from_date: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
        to_date: toDate ? dayjs(toDate).format('YYYY-MM-DD') : ''
      }
    } else if (selectedReport === 'grading_summary') {
      return {
        from_date: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
        to_date: toDate ? dayjs(toDate).format('YYYY-MM-DD') : ''
      }
    } else if (selectedReport === 'daily_grading_report') {
      return {
        from_date: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
        to_date: toDate ? dayjs(toDate).format('YYYY-MM-DD') : ''
      }
    }
    return {}
  }

  async function runSelectedReport() {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const params = buildParams()
      let apiBase = (typeof __API_BASE__ !== 'undefined' && __API_BASE__) ? __API_BASE__ : ''
      if (!apiBase && typeof window !== 'undefined') {
        // Default to production backend when running on report.akstrends.in
        const host = window.location.hostname
        if (host === 'report.akstrends.in' || host.endsWith('.report.akstrends.in')) {
          apiBase = 'https://adm.akstrends.in'
        }
      }
      const url = `${apiBase}/api/exec`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedure: reportMap[selectedReport] || reportMap['sales_summary'],
          params,
        }),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) {
        const msg = [json?.error, json?.details].filter(Boolean).join(' - ') || 'Request failed'
        throw new Error(msg)
      }
      // Add metadata to the response
      const dataWithMeta = {
        ...json,
        metadata: {
          fromDate: fromDate ? dayjs(fromDate).format('DD/MM/YYYY') : null,
          toDate: toDate ? dayjs(toDate).format('DD/MM/YYYY') : null,
          year: year,
          client: client
        }
      }
      setData(dataWithMeta)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', px: 0, m: 0 }}>
      {/* Hide filter section for container_loading_report after data is loaded */}
      {!(selectedReport === 'container_loading_report' && data) && (
      <Paper sx={{ 
        p: { xs: 2, md: 3 }, 
        borderRadius: 0, 
        border: (theme) => `1px solid ${theme.palette.divider}`, 
        boxShadow: (theme) => theme.palette.mode === 'light' 
          ? '0 8px 32px rgba(2,6,23,.08)' 
          : '0 8px 32px rgba(0,0,0,.2)',
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        width: '100%'
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                Report Filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedReport === 'container_loading_report'
                  ? 'Container loading analytics with MTD and monthly trends'
                  : selectedReport === 'container_month_wise'
                  ? 'Select year to view monthly container loading data'
                  : selectedReport === 'container_client_wise'
                  ? 'Select year and client to view detailed container data'
                  : selectedReport === 'date_wise_grading'
                  ? 'Select date range to view grading data by thickness'
                  : 'Generate your report'
                }
              </Typography>
            </Box>

            {/* Year Filter for Container Month Wise */}
            {selectedReport === 'container_month_wise' && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormControl size="medium" sx={{ minWidth: 200 }}>
                  <InputLabel>Select Year</InputLabel>
                  <Select
                    value={year}
                    label="Select Year"
                    onChange={(e) => setYear(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                      <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Year and Client Filters for Container Client Wise */}
            {selectedReport === 'container_client_wise' && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <FormControl size="medium" sx={{ minWidth: 150 }}>
                  <InputLabel>Select Year</InputLabel>
                  <Select
                    value={year}
                    label="Select Year"
                    onChange={(e) => setYear(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                      <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="medium" sx={{ minWidth: 200 }}>
                  <InputLabel>Select Client</InputLabel>
                  <Select
                    value={client}
                    label="Select Client"
                    onChange={(e) => setClient(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Clients</MenuItem>
                    {clients.map((c, idx) => (
                      <MenuItem key={idx} value={c.client_name}>
                        {c.client_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Date Range Filters for Date Wise Grading, Grading Summary, and Daily Grading Report */}
            {(selectedReport === 'date_wise_grading' || selectedReport === 'grading_summary' || selectedReport === 'daily_grading_report') && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <DatePicker 
                  label="From Date" 
                  value={fromDate} 
                  onChange={(val) => setFromDate(val)} 
                  format="DD/MM/YYYY"
                  slotProps={{ 
                    textField: { 
                      size: 'medium',
                      sx: { minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                    } 
                  }} 
                />
                <DatePicker 
                  label="To Date" 
                  value={toDate} 
                  onChange={(val) => setToDate(val)} 
                  format="DD/MM/YYYY"
                  slotProps={{ 
                    textField: { 
                      size: 'medium',
                      sx: { minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                    } 
                  }} 
                />
              </Box>
            )}



            {/* Action Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
              <Button 
                variant="contained" 
                onClick={runSelectedReport} 
                disabled={loading}
                size="large"
                sx={{ 
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  background: 'linear-gradient(135deg, #8B6F47 0%, #6B5536 100%)',
                  boxShadow: '0 8px 24px rgba(139, 111, 71, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6B5536 0%, #5A4429 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(139, 111, 71, 0.4)'
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.12)',
                    color: 'rgba(0,0,0,0.26)'
                  }
                }}
              >
                {loading ? 'Generating Report...' : 'Generate Report'}
            </Button>
            </Box>
          </Stack>
        </LocalizationProvider>
      </Paper>
      )}
      {error && (
        <Paper sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 0,
          border: '1px solid rgba(244,63,94,0.3)',
          background: 'linear-gradient(135deg, rgba(244,63,94,0.05) 0%, rgba(244,63,94,0.02) 100%)',
          boxShadow: '0 4px 16px rgba(244,63,94,0.1)'
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              p: 1, 
              borderRadius: 2, 
              background: 'rgba(244,63,94,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography sx={{ color: 'error.main', fontSize: 20 }}>⚠️</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main', mb: 0.5 }}>
                Report Error
              </Typography>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
      {data && (
        <Box sx={{ width: '100%' }}>
          <ReportViewer response={data} reportTitle={reportTitle} />
        </Box>
      )}
      
      {/* Scroll to Top Button */}
      <Fab
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #8B6F47, #D4A574)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(139, 111, 71, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6B5536, #B8895E)',
            boxShadow: '0 12px 32px rgba(139, 111, 71, 0.6)',
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


