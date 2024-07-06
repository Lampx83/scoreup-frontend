import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import * as React from "react";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/Notifications.js";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

function Index() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <Tooltip title="Notification">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{
              color: theme => theme.palette.primary
            }} />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'auto',
            maxHeight: 400,
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 2.2,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 8,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar>W</Avatar>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </MenuItem>
      </Menu>
    </>
  )
}

export default Index;