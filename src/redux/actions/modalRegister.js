export const modalRegister = (isOpen = false) => {
  return {
    type: 'TRIGGER_MODAL_REGISTER',
    isOpen
  }
}