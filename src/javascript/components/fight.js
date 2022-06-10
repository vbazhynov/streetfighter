import { controls } from '../../constants/controls';
import { fighterDetailsMap } from './fighterSelector.js';

let keysPressed = new Set();
let isPlayerOneAttack = false;
let isPlayerTwoAttack = false;
let isWinner = false;
let winner = '';
let isPlayerOneCrit = false;
let isPlayerTwoCrit = false;
export function fight(firstFighter, secondFighter) {
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    let timerId = setInterval(() => {
      if (isWinner) {
        clearInterval(timerId);
        resolve(winner);
      }
    }, 500);
  });
}

function keyUpHandler(ev) {
  const { PlayerOneAttack, PlayerTwoAttack } = controls;
  const { code } = ev;
  keysPressed.delete(code);
  switch (code) {
    case PlayerOneAttack:
      isPlayerOneAttack = false;
      break;
    case PlayerTwoAttack:
      isPlayerTwoAttack = false;
      break;
  }
}

function keyDownHandler(ev) {
  const playerOne = fighterDetailsMap.get('playerOne');
  const playerTwo = fighterDetailsMap.get('playerTwo');
  const { code } = ev;
  keysPressed.add(code);
  const { PlayerOneAttack, PlayerTwoAttack, PlayerOneBlock, PlayerTwoBlock } = controls;

  if (keysPressed.size >= 3) {
    checkForCritical(keysPressed, playerOne, playerTwo);
  }

  switch (code) {
    case PlayerOneAttack:
      if (isPlayerOneAttack) {
        break;
      } else if (keysPressed.has(PlayerOneBlock)) {
        console.log('You Cannot Attack, you`re in block');
      } else {
        if (keysPressed.has(PlayerTwoBlock)) {
          playerTwo.health -= getDamage(playerOne, playerTwo);
          console.log('Attack partly blocked');
        } else {
          playerTwo.health -= getHitPower(playerOne);
          console.log('FullAttack');
        }
        if (playerTwo.health <= 0) {
          playerTwo.health = 0;
          isWinner = true;
          winner = playerOne;
        }
        isPlayerOneAttack = true;
        console.log('playerTwo Health :' + playerTwo.health);
        updateHealthBar('right', playerTwo);
        break;
      }

    case PlayerTwoAttack:
      if (isPlayerTwoAttack) {
        break;
      } else if (keysPressed.has(PlayerTwoBlock)) {
        console.log('You Cannot Attack, you`re in block');
        isPlayerTwoAttack = true;
        break;
      } else {
        if (keysPressed.has(PlayerOneBlock)) {
          playerOne.health -= getDamage(playerTwo, playerOne);
          console.log('Attack partly blocked');
        } else {
          playerOne.health -= getHitPower(playerTwo);
          console.log('Full Attack');
        }
        isPlayerTwoAttack = true;
        if (playerOne.health <= 0) {
          playerOne.health = 0;
          isWinner = true;
          winner = playerTwo;
        }
        console.log('playerOne Health :' + playerOne.health);
        updateHealthBar('left', playerOne);
        break;
      }
  }
}

function countPercents(base, current) {
  return (current * 100) / base;
}

function updateHealthBar(position, player) {
  const whitchPlayer = position === 'left' ? 'playerOneBaseHealth' : 'playerTwoBaseHealth';
  const baseHealth = fighterDetailsMap.get(whitchPlayer);
  const HealthBar = document.querySelector(`#${position}-fighter-indicator`);
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
      if (isPlayerOneCrit) {
        console.log('You Can`t Crit Now, cooldown is not finished');
      } else {
        console.log('Player One Critical Hit : ' + playerOne.attack * 2);
        isPlayerOneCrit = true;
        playerTwo.health -= playerOne.attack * 2;
        if (playerTwo.health <= 0) {
          playerTwo.health = 0;
          isWinner = true;
          winner = playerOne;
        }
        updateHealthBar('right', playerTwo);
        setTimeout(() => {
          isPlayerOneCrit = false;
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
      if (isPlayerTwoCrit) {
        console.log('You Can`t Crit Now, cooldown is not finished');
      } else {
        console.log('Player Two Critical Hit : ' + playerTwo.attack * 2);
        isPlayerTwoCrit = true;
        playerOne.health -= playerTwo.attack * 2;
        if (playerOne.health <= 0) {
          playerOne.health = 0;
          isWinner = true;
          winner = playerTwo;
        }
        updateHealthBar('left', playerOne);
        setTimeout(() => {
          isPlayerTwoCrit = false;
          console.log('PlayerTwo : You Can Crit Now');
        }, 10000);
      }
    }
  }
}

export function getDamage(attacker, defender) {
  // return damage
  const damage = getHitPower(attacker) - getBlockPower(defender);
  //console.log('Damage trow block is :' + damage);
  return damage >= 0 ? damage : 0;
}

export function getHitPower(fighter) {
  // return hit power

  const { attack } = fighter;
  const criticalHitChance = Math.random() * (2 - 1) + 1;
  const power = attack * criticalHitChance;
  //console.log('Damage is :' + power);
  return power;
}

export function getBlockPower(fighter) {
  // return block power
  const { defense } = fighter;
  const criticalHitChance = Math.random() * (2 - 1) + 1;
  const power = defense * criticalHitChance;
  console.log('Defence :' + power);
  return power;
}
