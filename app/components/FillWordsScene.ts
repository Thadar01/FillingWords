import Phaser from "phaser";

export default class FillWordScene extends Phaser.Scene {
  dataWords: string[] = ['run', 'yellow', 'green', 'apple', 'orange', 'cup'];
  currentWordIndex: number = 0;
  matchedLetters: string[] = [];
  clickedButtons: Set<string> = new Set();
  wordSlots: Phaser.GameObjects.Text[] = [];
  wordCon: Phaser.GameObjects.Container[] = [];
  alphabetButtons: Phaser.GameObjects.Container[] = [];
  rope: Phaser.Physics.Arcade.Image | null = null;
  water: Phaser.Physics.Arcade.Image | null = null;
  isDown: boolean = false;
  isClicked:boolean=false

  constructor() {
    super('fillwords-scene');
  }

  preload() {
    this.load.image('rope', '/assets/hotairballon.jpg');
    this.load.image('water', '/assets/water.jpg');
  }

  create() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const buttonStyle = { fontSize: '24px', color: '#000' };
    this.rope = this.physics.add.image(1000, 200, 'rope').setScale(0.2, 0.2);
    this.water = this.physics.add.image(0, 700, 'water').setScale(1.5, 0.1);
    this.water.setImmovable(true)
    

    const buttonXStart = 50;
    const buttonYStart = 400;
    const buttonSpacing = 60;
    alphabet.forEach((letter, index) => {
      const x = buttonXStart + (index % 10) * buttonSpacing;
      const y = buttonYStart + Math.floor(index / 10) * buttonSpacing;

      const buttonBg = this.add.graphics();
      buttonBg.fillStyle(0x3498db, 1);
      buttonBg.fillRoundedRect(0, 0, 50, 50, 10);

      const buttonText = this.add.text(15, 10, letter, buttonStyle);

      const button = this.add.container(x, y, [buttonBg, buttonText])
        .setSize(50, 50)
        .setInteractive()
        .on('pointerdown', () => this.handleLetterClick(letter, button));

      button.on('pointerdown', () => button.setScale(0.95));
      button.on('pointerup', () => button.setScale(1));
      this.alphabetButtons.push(button);
        if(this.rope && this.water){
            this.physics.add.collider(this.rope,this.water,this.collision,undefined,this)

        }
    });

    this.displayWordSlots();

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const letter = event.key.toLowerCase();
      if (alphabet.includes(letter) && !this.clickedButtons.has(letter)) {
        const button = this.alphabetButtons.find((btn) => {
          const buttonText = btn.list[1] as Phaser.GameObjects.Text;
          return buttonText.text === letter;
        });
        if (button) this.handleLetterClick(letter, button);
      }
    });
  }

  displayWordSlots() {
    const currentWord = this.dataWords[this.currentWordIndex];
    const slotXStart = 100;
    const slotY = 300;
    const slotSpacing = 60;
    if (this.wordSlots) {
      this.wordSlots.forEach((slot) => slot.destroy());
    }
    this.wordSlots = [];

    if (this.wordCon) {
      this.wordCon.forEach((con) => con.destroy());
    }
    this.wordCon = [];
    currentWord.split('').forEach((_, index) => {
      const x = slotXStart + index * slotSpacing;

      const slotBg = this.add.graphics();
      slotBg.fillStyle(0xf0f0f0, 1);
      slotBg.fillRoundedRect(0, 0, 50, 50, 10);

      const slotText = this.add.text(25, 25, '', {
        fontSize: '32px',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
      }).setOrigin(0.5);

      const wordSlot = this.add.container(x, slotY, [slotBg, slotText]);
      this.wordSlots.push(slotText);
      this.wordCon.push(wordSlot);
    });
  }

  handleLetterClick(letter: string, button: Phaser.GameObjects.Container) {
    if(!this.isClicked){
    this.clickedButtons.add(letter);
    const buttonBg = button.list[0] as Phaser.GameObjects.Graphics;
    buttonBg.clear();
    buttonBg.fillStyle(0xff0000, 1);
    buttonBg.fillRoundedRect(0, 0, 50, 50, 10);

    const currentWord = this.dataWords[this.currentWordIndex];
    if (currentWord.includes(letter)) {
      this.matchedLetters.push(letter);

      currentWord.split('').forEach((char, index) => {
        if (char === letter) {
          this.wordSlots[index].setText(char);
        }
      });

      if (currentWord.split('').every((char) => this.matchedLetters.includes(char))) {
        if (this.currentWordIndex < this.dataWords.length - 1) {
          this.time.delayedCall(500, () => {
            this.currentWordIndex++;
            this.matchedLetters = [];
            this.clickedButtons.clear();
            this.displayWordSlots();
            this.resetAlphabetButtons();
            this.resetBalloonPosition();
          });
        } else {
          console.log('All words completed!');
          this.resetBalloonPosition();
          this.rope?.setVisible(true)
        }
      }
    } else {
      if (this.rope) {
        this.isClicked=true
        this.rope.setVelocityY(50);
        setTimeout(()=>{this.rope?.setVelocityY(0)
            
        },1000)

        setTimeout(()=>{this.isClicked=false
            
        },1200)
      }
    }
}
  }

  resetBalloonPosition() {
    if (this.rope) {
        this.tweens.add({
            targets: this.rope,
            y: 200, // Target position
            duration: 1000, // Duration of the animation in milliseconds
            ease: 'Power2', // Easing function for smooth movement
        });
    }
}


  resetAlphabetButtons() {
    this.alphabetButtons.forEach((btn) => {
      const buttonBg = btn.list[0] as Phaser.GameObjects.Graphics;
      buttonBg.clear();
      buttonBg.fillStyle(0x3498db, 1);
      buttonBg.fillRoundedRect(0, 0, 50, 50, 10);
    });
  }


  collision(){
    this.rope?.setVisible(false)
    this.currentWordIndex++
    this.rope?.setVelocityY(0)
    this.matchedLetters = [];
    this.clickedButtons.clear();
    this.displayWordSlots();
    this.resetAlphabetButtons();
    this.resetBalloonPosition();
    setTimeout(()=>    this.rope?.setVisible(true),1000
)
  }

  update() {
    // Any continuous updates can go here
  }
}
