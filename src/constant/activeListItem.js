export const activeListItem = (theme) => ({
  backgroundColor: theme.palette.action.selected,
  borderLeft: `4px solid #1A4E8DFF`,
  "&:hover, &:focus": {
    backgroundColor: theme.palette.action.selected,
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "light" ? "#1A4E8DFF" : "",
  },
  "& .MuiListItemText-primary": {
    color: theme.palette.mode === "light" ? "#1A4E8DFF" : "",
    fontWeight: theme.typography.fontWeightBold,
  },
});
