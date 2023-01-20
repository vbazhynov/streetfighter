import { controls } from '../../constants/controls';
import { fighterDetailsMap } from './fighterSelector.js';

const keysPressed = new Set();

export function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    firstFighter = createFighterObject(firstFighter, 'left');
    secondFighter = createFighterObject(secondFighter, 'right');

    keyDownHandler = keyDownHandler.bind(null, firstFighter, secondFighter, resolve);
    keyUpHandler = keyUpHandler.bind(null, firstFighter, secondFighter);

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
  });
}

function createFighterObject(fighter, position) {
  return {
    entity: fighter,
    health: fighter.health,
    position: position,
    isPlayerAttack: false,
    isPlayerCrit: false
  };
}

function clearEvents() {
  document.removeEventListener('keydown', keyDownHandler);
  document.removeEventListener('keyup', keyUpHandler);
}

function keyUpHandler(firstFighter, secondFighter, ev) {
  const { PlayerOneAttack, PlayerTwoAttack } = controls;
  const { code } = ev;
  keysPressed.delete(code);
  switch (code) {
    case PlayerOneAttack:
      firstFighter.isPlayerAttack = false;
      break;
    case PlayerTwoAttack:
      secondFighter.isPlayerAttack = false;
      break;
  }
}

function keyDownHandler(playerOne, playerTwo, resolve, event) {
  const { code } = event;
  keysPressed.add(code);
  const { PlayerOneAttack, PlayerTwoAttack, PlayerOneBlock, PlayerTwoBlock } = controls;

  if (keysPressed.size >= 3) {
    checkForCritical(keysPressed, playerOne, playerTwo);
  }

  switch (code) {
    case PlayerOneAttack:
      if (playerOne.isPlayerAttack) {
        break;
      } else if (keysPressed.has(PlayerOneBlock)) {
        console.log('You Cannot Attack, you`re in block');
      } else {
        if (keysPressed.has(PlayerTwoBlock)) {
          console.log('Attack blocked by Player two');
        } else {
          const pl1Hit = getDamage(playerOne.entity, playerTwo.entity);
          playerTwo.health -= pl1Hit;
          console.log(`Player One Hit ${pl1Hit} points`);
        }
        if (playerTwo.health <= 0) {
          playerTwo.health = 0;
          clearEvents();
          resolve(playerOne.entity);
          console.log('Player One Wins!');
        }
        playerOne.isPlayerAttack = true;
        updateHealthBar(playerTwo);
        break;
      }

    case PlayerTwoAttack:
      if (playerTwo.isPlayerAttack) {
        break;
      } else if (keysPressed.has(PlayerTwoBlock)) {
        console.log('You Cannot Attack, you`re in block');
        break;
      } else {
        if (keysPressed.has(PlayerOneBlock)) {
          console.log('Attack blocked by player One');
        } else {
          const p2Hit = getDamage(playerTwo.entity, playerOne.entity);
          playerOne.health -= p2Hit;
          console.log(`Player Two Hit ${p2Hit} points`);
        }
        playerTwo.isPlayerAttack = true;
        if (playerOne.health <= 0) {
          playerOne.health = 0;
          clearEvents();
          resolve(playerTwo.entity);
          console.log('Player Two Wins!');
        }
        updateHealthBar(playerOne);
        break;
      }
  }
}

function countPercents(base, current) {
  return (current * 100) / base;
}

function updateHealthBar(player) {
  const witchPlayer = player.position === 'left' ? 'playerOneBaseHealth' : 'playerTwoBaseHealth';
  const baseHealth = fighterDetailsMap.get(witchPlayer);
  const HealthBar = document.querySelector(`#${player.position}-fighter-indicator`);
  HealthBar.style.width = `${countPercents(baseHealth, player.health)}%`;
}

function checkForCritical(keys, playerOne, playerTwo) {
  const { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = controls;
  let trueCounter = 0;
  for (const key of keys) {
    if (PlayerOneCriticalHitCombination.includes(key)) {
      trueCounter++;
    }
    if (trueCounter === 3) {
      if (playerOne.isPlayerCrit) {
        console.log('You Can`t Crit Now, cooldown is not finished');
      } else {
        console.log('Player One Critical Hit : ' + playerOne.entity.attack * 2 + 'points');
        playerOne.isPlayerCrit = true;
        playerTwo.health -= playerOne.entity.attack * 2;
        if (playerTwo.health <= 0) {
          playerTwo.health = 0;
          clearEvents();
          resolve(playerOne.entity);
          console.log('Player One Wins!');
        }
        updateHealthBar(playerTwo);
        setTimeout(() => {
          playerOne.isPlayerCrit = false;
          console.log('PlayerOne : You Can Crit Now');
        }, 10000);
      }
    }
  }
  trueCounter = 0;
  for (const key of keys) {
    if (PlayerTwoCriticalHitCombination.includes(key)) {
      trueCounter++;
    }
    if (trueCounter === 3) {
      if (playerTwo.isPlayerCrit) {
        console.log('You Can`t Crit Now, cooldown is not finished');
      } else {
        console.log('Player Two Critical Hit : ' + playerTwo.entity.attack * 2 + 'points');
        playerTwo.isPlayerCrit = true;
        playerOne.health -= playerTwo.entity.attack * 2;
        if (playerOne.health <= 0) {
          playerOne.health = 0;
          clearEvents();
          resolve(playerTwo.entity);
          console.log('Player Two Wins!');
        }
        updateHealthBar(playerOne);
        setTimeout(() => {
          playerTwo.isPlayerCrit = false;
          console.log('PlayerTwo : You Can Crit Now');
        }, 10000);
      }
    }
  }
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage >= 0 ? damage : 0;
}

export function getHitPower(fighter) {
  const { attack } = fighter;
  const criticalHitChance = Math.random() * (2 - 1) + 1;
  const power = attack * criticalHitChance;
  return power;
}

export function getBlockPower(fighter) {
  const { defense } = fighter;
  const criticalHitChance = Math.random() * (2 - 1) + 1;
  const power = defense * criticalHitChance;
  return power;
}
