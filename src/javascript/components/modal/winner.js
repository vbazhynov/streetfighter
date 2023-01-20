import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';

export function showWinnerModal(fighter) {
  const winnerObj = {};
  winnerObj.title = `Winner is ${fighter.name}`;
  winnerObj.bodyElement = createElement({
    tagName: 'img',
    className: 'modal-img',
    attributes: { src: fighter.source }
  });
  winnerObj.onClose = () => {
    location.reload();
  };
  showModal(winnerObj);
}
