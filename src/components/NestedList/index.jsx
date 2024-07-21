import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function NestedList({
  title = "",
  Icon = null,
  children = {},
  level = 1,
  drawerOpen = true,
  handleDrawerOpen = () => {},
  active = {},
  sx = {
    minHeight: 48,
    px: 2.5,
    overflowX: 'hidden',
  },
  initState = false,
}) {
  const [open, setOpen] = React.useState(initState);
  if (!drawerOpen && open) {
    setOpen(false);
  }
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton
        onClick={() => {
          if (!drawerOpen) {
            handleDrawerOpen();
            setOpen(true);
            return;
          }
          handleClick();
        }}
        sx={{
          ...sx,
          ...(open && active)
        }}
      >
        {Icon &&
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: drawerOpen ? 3 : 'auto',
            justifyContent: 'center !important',
          }}
        >

          <Icon style={{width: '24px', height: '24px'}}/>
        </ListItemIcon>
        }
        <ListItemText
          primary={title}
          sx={{
            whiteSpace: 'wrap',
            textWrap: 'wrap',
            // opacity: drawerOpen ? 1 : 0,
            display: drawerOpen ? 'block' : 'none',
          }}
        />
        {drawerOpen ? (open ? <ExpandLess /> : <ExpandMore />) : ''}
      </ListItemButton>
      <Collapse in={open && drawerOpen} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            '& .MuiListItemButton-root': {
              paddingLeft: 6 * (level),
            },
          }}
        >
          {children}
        </List>
      </Collapse>
    </>
  );
}

export default NestedList;