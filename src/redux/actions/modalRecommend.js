export const modalRecommend = ({
  isOpen = false
}) => {
  return {
    type: 'TRIGGER_MODAL_RECOMMEND',
    isOpen
  };
}
