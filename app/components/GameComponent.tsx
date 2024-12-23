'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import FillWordScene from './FillWordsScene';



const GameComponent = () => {
  const gameRef = useRef<Phaser.Game | null>(null);



  useEffect(() => {
    if (gameRef.current) return;

    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1400,
      height: 700,
      scene: [FillWordScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      parent: 'phaser-container',
      backgroundColor: '#FFFFFF',
    };

    gameRef.current = new Phaser.Game(gameConfig);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);



  return <div id="phaser-container"></div>;
};

export default GameComponent;


