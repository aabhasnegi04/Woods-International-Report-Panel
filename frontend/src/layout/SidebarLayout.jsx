import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, Tooltip, Switch, FormControlLabel, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ForestIcon from '@mui/icons-material/Forest'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../contexts/AuthContext'

const drawerWidth = 260

export default function SidebarLayout({ children, mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isMdUp = useMediaQuery('(min-width:900px)')
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = useMemo(() => ([
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/reports', label: 'Reports', icon: <AnalyticsIcon /> },
    { to: '/logs', label: 'Logs', icon: <ForestIcon /> },
  ]), [])



  const accent = useMemo(() => {
    if (location.pathname.startsWith('/reports')) return { main: '#8B6F47', alt: '#D4A574' }
    if (location.pathname.startsWith('/logs')) return { main: '#8B4513', alt: '#A0522D' }
    // Dashboard/default: use wood colors
    return { main: '#8B6F47', alt: '#D4A574' }
  }, [location.pathname])



  const onNavigate = () => {
    // Close temporary drawer on mobile when user navigates
    if (!isMdUp) setMobileOpen(false)
  }

  const drawer = (
    <Box role="navigation" sx={{ color: 'text.primary', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box component={Link} to="/" onClick={onNavigate} sx={{ display: 'inline-block', textDecoration: 'none', '&:hover': { opacity: 0.9 }, cursor: 'pointer' }}>
          <Box
            component="img"
            src="/wood_logo.png"
            alt="Woods International Gabon"
            sx={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: { xs: 60, md: 80 },
              display: 'inline-block',
            }}
          />
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(139, 111, 71, 0.15)' }} />
      <List sx={{ flexGrow: 1, px: 2, py: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item) => {
          const isSelectedRoot = location.pathname === item.to
          return (
            <Box key={item.to}>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={onNavigate}
                selected={isSelectedRoot}
                sx={{
                  borderRadius: 2.5,
                  transition: 'all .3s ease',
                  minHeight: 48,
                  px: 2,
                  py: 1.5,
                  '& .MuiListItemText-primary': { 
                    fontWeight: 600, 
                    fontSize: 15, 
                    letterSpacing: 0.3 
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(139, 111, 71, 0.08)',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: '#8B6F47'
                    }
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#2C2416',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '& .MuiListItemText-primary': { fontWeight: 700 },
                    '&:hover': {
                      backgroundColor: '#1F1810',
                      transform: 'translateX(4px)'
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Box>
          )
        })}
      </List>
      <Divider />
      
      {/* User Info and Logout */}
      <Box sx={{ p: 3, borderTop: '1px solid rgba(139, 111, 71, 0.15)' }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          background: 'rgba(139, 111, 71, 0.05)',
          mb: 2
        }}>
          <Typography variant="caption" sx={{ color: '#6B5536', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Logged in as
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#2C2416', mt: 0.5 }}>
            {user?.username || 'User'}
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            background: 'transparent',
            color: '#DC2626',
            border: '1.5px solid #DC2626',
            boxShadow: 'none',
            '&:hover': {
              background: '#DC2626',
              color: 'white',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Logout
        </Button>
      </Box>
      
      <Box sx={{ p: 3, borderTop: '1px solid rgba(139, 111, 71, 0.15)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#6B5536', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Theme
          </Typography>
          <Tooltip title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}>
            <FormControlLabel
              control={
                <Switch 
                  checked={mode === 'dark'} 
                  onChange={onToggleMode}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#8B6F47'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#8B6F47'
                    }
                  }}
                />
              }
              label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{mode === 'dark' ? 'Dark' : 'Light'}</Typography>}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: (theme) => theme.palette.background.default }}>
      <Box component="nav" sx={{ width: { md: collapsed ? 0 : drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: { xs: '88vw', sm: drawerWidth },
              background: (theme) => theme.palette.mode === 'light'
                ? `linear-gradient(180deg, #ffffff 0%, #f7fbff 50%, #f3f4ff 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .12)} 0%, transparent 60%)`
                : `linear-gradient(180deg, #0f172a 0%, #0b1324 50%, #0a0f1f 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .18)} 0%, transparent 60%)`,
              borderRight: (theme) => `1px solid ${alpha(accent.main, theme.palette.mode === 'light' ? 0.25 : 0.35)}`,
              boxShadow: (theme) => theme.palette.mode === 'light' ? '0 10px 30px rgba(2,6,23,.08)' : '0 10px 30px rgba(0,0,0,.6)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }
          }}
        >
          {drawer}
        </Drawer>
        {!collapsed && (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: (theme) => theme.palette.mode === 'light'
                  ? `linear-gradient(180deg, #ffffff 0%, #f7fbff 50%, #f3f4ff 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .12)} 0%, transparent 60%)`
                  : `linear-gradient(180deg, #0f172a 0%, #0b1324 50%, #0a0f1f 100%), radial-gradient(1200px 300px at -200px -100px, ${alpha(accent.main, .18)} 0%, transparent 60%)`,
                borderRight: (theme) => `1px solid ${alpha(accent.main, theme.palette.mode === 'light' ? 0.25 : 0.35)}`,
                boxShadow: (theme) => theme.palette.mode === 'light' ? '0 10px 30px rgba(2,6,23,.08)' : '0 10px 30px rgba(0,0,0,.6)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box component="main" sx={{ flexGrow: 1, pt: 0, pb: 0, px: 0, width: { md: collapsed ? '100%' : `calc(100% - ${drawerWidth}px)` }, overflow: 'hidden' }}>
        <Box sx={{ mb: 0, display: 'flex', alignItems: 'center', gap: 1, position: 'fixed', top: 16, left: 16, zIndex: 1300 }}>
          {!isMdUp && (
            <IconButton 
              color="primary" 
              onClick={() => setMobileOpen(true)} 
              aria-label="open sidebar"
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'background.paper',
                  boxShadow: 4
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
          )}
        </Box>
        {/* Desktop fixed toggle near divider */}
        {isMdUp && (
          <Tooltip title={collapsed ? 'Open sidebar' : 'Close sidebar'}>
            <IconButton
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? 'open sidebar' : 'close sidebar'}
              sx={{
                position: 'fixed',
                top: 16,
                left: collapsed ? 16 : drawerWidth + 16,
                zIndex: 1400,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(accent.main, 0.35)}`,
                boxShadow: (theme) => theme.palette.mode === 'light' ? '0 6px 16px rgba(2,6,23,.08)' : '0 6px 16px rgba(0,0,0,.45)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'background.paper',
                  transform: 'scale(1.05)',
                  boxShadow: (theme) => theme.palette.mode === 'light' ? '0 8px 20px rgba(2,6,23,.12)' : '0 8px 20px rgba(0,0,0,.6)'
                }
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}


