import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Check from '@mui/icons-material/Check'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function CategoriesDropdown() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Button
        id="basic-button-recent"
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}

      >
        Chủ đề
      </Button>
      <Menu
        id="basic-menu-recent"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent'
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          marginTop: 1.5
        }}
      >
        <MenuItem>
          <ListItemText>Công nghệ thông tin</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Khoa học máy tính</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Xem thêm...</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default CategoriesDropdown;