export const modalLogin = (isOpen = false) => {
  return {
    type: 'TRIGGER_MODAL_LOGIN',
    isOpen
  }
}