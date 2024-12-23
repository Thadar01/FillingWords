'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import EasyFillWordScene from './EasyFillWordScene';
import MedFillWordScene from './MedFillWordSene';
import HardFillWordScene from './HardFillWordScene';


interface ShootingGameProps {
  name: string | null;
}

const GameComponent: React.FC<ShootingGameProps> = ({ name }) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) {
      return; // Prevent reinitialization
    }

    const scenes = [];
    if (name === 'easy') {
      scenes.push(EasyFillWordScene);
    }else if(name==='med'){
      scenes.push(MedFillWordScene)
    }else if(name=='hard'){
      scenes.push(HardFillWordScene)
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1410,
      height: 700,
      scene: scenes,
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

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [name]);

  return (
    <div>
      <div id="phaser-container"></div>
    </div>
  );
};

export default GameComponent;
