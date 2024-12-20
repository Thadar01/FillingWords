'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import {  useMyContext } from '../context/MyProvider';



const GameComponent = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const {isDown}=useMyContext()

  // Phaser Scene for Fall
  class FallScene extends Phaser.Scene {
    rope: Phaser.Physics.Arcade.Image | null = null;
    cursor: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    isDown: boolean = false;

    constructor() {
      super({ key: 'fall-scene' });
    }

    preload() {
      this.load.image('rope', '/assets/hotairballon.jpg');
    }

    create() {
      this.rope = this.physics.add.image(1000,200, 'rope');
      this.rope.setScale(0.3,0.3)

      if (this.input.keyboard) {
        this.cursor = this.input.keyboard.createCursorKeys();
      }

      // Access isDown directly from scene data
      this.isDown = isDown;

      console.log('isDown:', this.isDown);
    }

    update() {
      if (this.isDown && this.rope) {
          this.rope.y=this.rope.y+10
      }
    }
  }

  useEffect(() => {
    if (gameRef.current) {
      return; // Prevent reinitialization
    }

    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1400,
      height: 700,
      scene: [FallScene],
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
  }, [isDown]);

  return (
   
      <div id="phaser-container" ></div>
  );
};

export default GameComponent;
