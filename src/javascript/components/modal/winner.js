import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';

export function showWinnerModal(fighter) {
  // call showModal function
  const winnerObj = {};
  winnerObj.title = `Winner is ${fighter.name}`;
  winnerObj.bodyElement = createElement({
    tagName: 'img',
    className: 'modal-img',
    attributes: { src: fighter.source }
  });
  winnerObj.onClose = () => {
    // const loadingElement = document.getElementById('loading-overlay');
    // loadingElement.style.visibility = 'visible';
    location.reload();
  };
  showModal(winnerObj);
}
