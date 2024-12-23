import Phaser from "phaser";
import easyData from "@/public/data/easy";

export default class EasyFillWordScene extends Phaser.Scene {
  // dataWords: string[] = ['run', 'yellow', 'green', 'apple', 'orange', 'cup'];
  currentWordIndex: number = 0;
  matchedLetters: string[] = [];
  clickedButtons: Set<string> = new Set();
  wordSlots: Phaser.GameObjects.Text[] = [];
  wordCon: Phaser.GameObjects.Container[] = [];
  alphabetButtons: Phaser.GameObjects.Container[] = [];
  rope: Phaser.Physics.Arcade.Image | null = null;
  water: Phaser.Physics.Arcade.Image | null = null;
  isDown: boolean = false;
  isClicked: boolean = false;
  timerText: Phaser.GameObjects.Text | null = null;
  remainingTime: number = 60; // 1 minute in seconds
  timerEvent: Phaser.Time.TimerEvent | null = null;
  life:number=3;
  lifeText:Phaser.GameObjects.Text|null=null
 score:number=0
 scoreText:Phaser.GameObjects.Text|null=null
 image:Phaser.GameObjects.Image|null=null
 soundIcon:Phaser.GameObjects.Image|null=null


 

  constructor() {
    super('easyfillwords-scene');
  }

  preload() {
    this.load.image('rope', '/assets/hotairballon.jpg');
    this.load.image('water', '/assets/water.jpg');
    this.load.image('sound', '/assets/sound.jpeg');


    for (let i = 0; i < easyData.length; i++) {
      this.load.image(easyData[i].name, easyData[i].sorce);
      this.load.audio(easyData[i].name, easyData[i].sound);
    }
  }

  create() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const buttonStyle = { fontSize: '24px', color: '#000' };
    this.rope = this.physics.add.image(1000, 200, 'rope').setScale(0.2, 0.2);
    this.water = this.physics.add.image(0, 700, 'water').setScale(1.5, 0.1);
    this.water.setImmovable(true);
    this.soundIcon=this.add.image(500,200,'sound').setScale(0.4,0.4)
    this.soundIcon.setInteractive().on('pointerdown', this.playCurrentSound, this);

    

    this.lifeText=this.add.text(1200,30,`Life: ${this.life}`,{
      color:'#000000',
      fontSize:'30px'
    })

    this.scoreText=this.add.text(600,30,`Score: ${this.score}`,{
      color:'#000000',
      fontSize:'30px'
    })

    this.image=this.add.image(200,200,easyData[this.currentWordIndex].name).setScale(0.5,0.5)

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

      if (this.rope && this.water) {
        this.physics.add.collider(this.rope, this.water, this.collision, undefined, this);
      }
    });

    this.displayWordSlots();
    this.startTimer();

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

  playCurrentSound() {
    if (this.soundIcon && this.currentWordIndex >= 0 && this.currentWordIndex < easyData.length) {
      // Play the sound related to the current index
      const soundName = easyData[this.currentWordIndex].name;
      
      this.sound.play(soundName); // Play the sound
    }
  }

  startTimer() {
    if (this.timerEvent) {
      this.timerEvent.remove(); // Remove previous timer event
    }
  
    this.remainingTime = 60; // Reset timer to 1 minute for each new word
  
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.remainingTime--;
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        if (this.timerText) {
          this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
  
        if (this.remainingTime <= 0) {
          this.timerEvent?.remove(); // Stop the timer when time is up
          this.endGame(); // Call endGame when time runs out
        }
      },
      loop: true,
    });
  }
  
  endGame() {
    console.log('Time is up!');
    
    // Stop the timer and reset the current word
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
  
    // Change to the next word and restart the timer

  
    // Clear matched letters and clicked buttons
   
  
    this.rope?.setVelocityY(200)
  
   
  }
  

  displayWordSlots() {
    
    const currentWord = easyData[this.currentWordIndex].name;
    const slotXStart = 100;
    const slotY = 300;
    const slotSpacing = 60;
    
    // Destroy previous word slots
    if (this.wordSlots) {
      this.wordSlots.forEach((slot) => slot.destroy());
    }
    this.wordSlots = [];
  
    // Destroy previous word container
    if (this.wordCon) {
      this.wordCon.forEach((con) => con.destroy());
    }
    this.wordCon = [];
    
    // Destroy previous timer text if exists
    if (this.timerText) {
      this.timerText.destroy();
    }
  
    // Create the new timer text for this word
    const timerStyle = { fontSize: '32px', color: '#ff0000', fontFamily: 'Arial' };
    this.timerText = this.add.text(100, 30, `Time: 1:00`, timerStyle);
  
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
  
    // Restart the timer for the new word
    this.startTimer();
  }
  
  handleLetterClick(letter: string, button: Phaser.GameObjects.Container) {
    if (!this.isClicked) {
      this.clickedButtons.add(letter);
      const buttonBg = button.list[0] as Phaser.GameObjects.Graphics;
      buttonBg.clear();
      buttonBg.fillStyle(0xff0000, 1);
      buttonBg.fillRoundedRect(0, 0, 50, 50, 10);

      const currentWord =  easyData[this.currentWordIndex].name;
      if (currentWord.includes(letter)) {
        this.matchedLetters.push(letter);

        currentWord.split('').forEach((char, index) => {
          if (char === letter) {
            this.wordSlots[index].setText(char);
          }
        });

        if (currentWord.split('').every((char) => this.matchedLetters.includes(char))) {
          if (this.currentWordIndex < easyData.length - 1) {
            this.time.delayedCall(500, () => {
              this.currentWordIndex++;
              this.matchedLetters = [];
              this.clickedButtons.clear();
              this.displayWordSlots();
              this.resetAlphabetButtons();
              this.resetBalloonPosition();
              this.startTimer(); // Restart timer for the next word
              this.score=this.score+100
              this.image?.setTexture(easyData[this.currentWordIndex].name)
              if(this.scoreText){
                this.scoreText.setText(`Score: ${this.score}`)

              }
            });
          } else {
            console.log('All words completed!');
            
            window.location.href = `/Result?score=${this.score}`;
          }
        }
      } else {
        if (this.rope) {
          this.isClicked = true;
          this.rope.setVelocityY(50);
          setTimeout(() => {
            this.rope?.setVelocityY(0);
          }, 1000);

          setTimeout(() => {
            this.isClicked = false;
          }, 1200);
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

  collision() {
    this.rope?.setVisible(false);
    this.currentWordIndex++;
    this.rope?.setVelocityY(0);
    this.matchedLetters = [];
    this.clickedButtons.clear();
    this.displayWordSlots();
    this.resetAlphabetButtons();
    this.resetBalloonPosition();
    setTimeout(() => this.rope?.setVisible(true), 1000);
    this.image?.setTexture(easyData[this.currentWordIndex].name)

    this.life--
    this.lifeText?.setText(`Life: ${this.life}`)
  }

  update() {
    // Any continuous updates can go here
  }
}
