import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  if (!fighter) {
    return '';
  }
  const { name, health, attack, defense } = fighter;
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });
  fighterElement.append(createFighterImage(fighter));
  const fighterInfo = createElement({
    tagName: 'ul',
    className: 'fighter-preview___info'
  });

  fighterInfo.append(createLiTag('Name', name));
  fighterInfo.append(createLiTag('Health', health));
  fighterInfo.append(createLiTag('Attack', attack));
  fighterInfo.append(createLiTag('Defense', defense));
  fighterElement.append(fighterInfo);

  // todo: show fighter info (image, name, health, etc.)

  return fighterElement;
}

function createLiTag(name, info) {
  const element = createElement({
    tagName: 'li',
    className: 'fighter-preview___info-element'
  });
  element.innerText = `${name}: ${info}`;
  return element;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes
  });
  return imgElement;
}
