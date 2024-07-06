export const closeDrawer = () => {
  return {
    type: 'CLOSE_DRAWER'
  }
}

export const openDrawer = () => {
  return {
    type: 'OPEN_DRAWER'
  }
}

export const toggleDrawer = (open) => {
  return {
    type: 'TOGGLE_DRAWER',
    value: open
  }
}