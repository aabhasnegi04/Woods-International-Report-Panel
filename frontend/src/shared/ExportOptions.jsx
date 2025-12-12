import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Divider,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Download,
  TableChart,
  BarChart,
  Dashboard
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const ExportOptions = ({ 
  reportData, 
  chartData, 
  reportTitle, 
  isExporting, 
  onExport 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (exportType, exportFormat, includeCharts = false) => {
    onExport(exportType, exportFormat, includeCharts);
    handleClose();
  };

  const hasData = reportData && (reportData.length > 0 || Object.keys(reportData).length > 0);
  const hasCharts = chartData && chartData.length > 0;

  return (
    <>
      {/* Export Button */}
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={isExporting || (!hasData && !hasCharts)}
        startIcon={<Download />}
        sx={{
          minWidth: 'auto',
          px: 3,
          py: 1.5,
          fontWeight: 700,
          fontSize: { xs: '0.875rem', md: '1rem' },
          textTransform: 'none',
          borderRadius: 2,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          border: 'none',
          color: 'white',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)'
          },
          '&:active': {
            transform: 'translateY(0)'
          },
          '&:disabled': {
            background: '#e2e8f0',
            color: '#94a3b8',
            boxShadow: 'none'
          }
        }}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            maxWidth: 350,
            p: 2,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }
        }}
      >
        {/* Export Type Section */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, px: 1 }}>
          Export Type
        </Typography>
        
        <MenuItem 
          onClick={() => handleExport('tables', 'excel')} 
          disabled={!hasData}
          sx={{ mb: 0.5 }}
        >
          <ListItemIcon>
            <TableChart sx={{ fontSize: 20, color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Tables (Excel)" 
            secondary={hasData ? "Export all table data" : "No table data"}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('tables', 'csv')} 
          disabled={!hasData}
          sx={{ mb: 0.5 }}
        >
          <ListItemIcon>
            <TableChart sx={{ fontSize: 20, color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Tables (CSV)" 
            secondary={hasData ? "Export all table data" : "No table data"}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('charts', 'excel')} 
          disabled={!hasCharts}
          sx={{ mb: 0.5 }}
        >
          <ListItemIcon>
            <BarChart sx={{ fontSize: 20, color: 'secondary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Chart Data (Excel)" 
            secondary={hasCharts ? "Export chart data only" : "No chart data"}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('charts', 'excel', true)} 
          disabled={!hasCharts}
          sx={{ mb: 0.5 }}
        >
          <ListItemIcon>
            <BarChart sx={{ fontSize: 20, color: 'success.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Full Charts (Excel + Images)" 
            secondary={hasCharts ? "Export charts as images + data" : "No chart data"}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('charts', 'csv')} 
          disabled={!hasCharts}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <BarChart sx={{ fontSize: 20, color: 'secondary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Chart Data (CSV)" 
            secondary={hasCharts ? "Export chart data only" : "No chart data"}
          />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem 
          onClick={() => handleExport('both', 'excel')} 
          sx={{ mb: 0.5 }}
        >
          <ListItemIcon>
            <Dashboard sx={{ fontSize: 20, color: 'success.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Everything (Excel)" 
            secondary="Tables & charts in separate sheets"
          />
        </MenuItem>

        <MenuItem 
          onClick={() => handleExport('both', 'csv')} 
        >
          <ListItemIcon>
            <Dashboard sx={{ fontSize: 20, color: 'success.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Everything (CSV)" 
            secondary="Tables & charts in one file"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportOptions;
