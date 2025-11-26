import { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Chip } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import PersonIcon from '@mui/icons-material/Person'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

export default function ContainerClientWiseCharts({ data }) {
  const containerData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    return data.recordsets[0].map(item => {
      const date = new Date(item.Container_Completed_date)
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: item.Container_Completed_date,
        'Container No': item.ContainerNo,
        'Client': item.Client_Name,
        'Destination': item.Destination,
        'Quantity': item.Qty || 0,
        'Amount': item.Amount || 0
      }
    }).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
  }, [data])

  const totalQty = useMemo(() => containerData.reduce((sum, item) => sum + item['Quantity'], 0), [containerData])
  const totalAmount = useMemo(() => containerData.reduce((sum, item) => sum + item['Amount'], 0), [containerData])
  const totalContainers = containerData.length

  const dailyData = useMemo(() => {
    const grouped = containerData.reduce((acc, item) => {
      const date = item.date
      if (!acc[date]) acc[date] = { date, 'Quantity': 0, 'Containers': 0, sortDate: item.fullDate }
      acc[date]['Quantity'] += item['Quantity']
      acc[date]['Containers'] += 1
      return acc
    }, {})
    return Object.values(grouped).sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate))
  }, [containerData])

  return (
    <Box sx={{ pb: 2, background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)', width: '100%', mx: 0 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)', py: { xs: 3, md: 4 }, px: 2, mb: 3, borderRadius: 0, boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <PersonIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Container Client Wise
          </Typography>
        </Stack>
      </Box>

      <Stack spacing={2} sx={{ mb: 3, px: 0 }}>
        <Paper sx={{ p: 2.5, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 0, boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)', border: '2px solid rgba(255,255,255,0.3)', outline: 'none', '&:focus': { outline: 'none' }, '&:focus-visible': { outline: 'none' } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600, mb: 0.5 }}>Total Containers</Typography>
              <Typography sx={{ color: 'white', fontSize: { xs: 32, md: 40 }, fontWeight: 900, lineHeight: 1 }}>{totalContainers}</Typography>
            </Box>
            <Chip icon={<TrendingUpIcon />} label={`${totalQty} Qty`} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 700, fontSize: 14, height: 36, border: '2px solid rgba(255,255,255,0.3)' }} />
          </Stack>
        </Paper>
        <Paper sx={{ p: 2.5, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', borderRadius: 0, border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)', outline: 'none', '&:focus': { outline: 'none' }, '&:focus-visible': { outline: 'none' } }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600, mb: 0.5 }}>Total Amount</Typography>
          <Typography sx={{ color: 'white', fontSize: { xs: 32, md: 40 }, fontWeight: 900, lineHeight: 1 }}>₹{totalAmount.toLocaleString()}</Typography>
        </Paper>
      </Stack>

      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#047857', mb: 2, textAlign: 'center' }}>📈 Daily Quantity Trend</Typography>
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 0, border: '2px solid #a7f3d0', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', boxShadow: '0 8px 24px rgba(4, 120, 87, 0.2)', outline: 'none', '&:focus': { outline: 'none' }, '&:focus-visible': { outline: 'none' } }}>
          <Box sx={{ width: '100%', height: { xs: 350, md: 400 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} width={40} />
                <RechartsTooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, padding: '10px 14px' }} cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="Quantity" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0891b2', mb: 2, textAlign: 'center' }}>📊 Containers by Date</Typography>
        <Paper sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 0, border: '2px solid #a5f3fc', background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', boxShadow: '0 8px 24px rgba(8, 145, 178, 0.2)', outline: 'none', '&:focus': { outline: 'none' }, '&:focus-visible': { outline: 'none' } }}>
          <Box sx={{ width: '100%', height: { xs: 300, md: 350 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} width={40} />
                <RechartsTooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, padding: '10px 14px' }} formatter={(value) => [value, 'Containers']} cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }} />
                <Bar dataKey="Containers" fill="#06b6d4" name="Containers" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
