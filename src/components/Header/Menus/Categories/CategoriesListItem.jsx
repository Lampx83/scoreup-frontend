import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ClassIcon from '@mui/icons-material/Class';

function CategoriesListItem() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <ClassIcon />
        </ListItemIcon>
        <ListItemText primary="Ngành học" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense >
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon sx={{minWidth: '36px'}}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText>Công nghệ thông tin</ListItemText>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon sx={{minWidth: '36px'}}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText>Khoa học máy tính</ListItemText>
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon sx={{minWidth: '36px'}}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText>Xem thêm...</ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}

export default CategoriesListItem;