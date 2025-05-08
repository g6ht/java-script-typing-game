const arrayOfWords = ['mother', 'father', 'page', 'killer', 'option', 'limited', 'property', 'outfit',
     'convince', 'deadly', 'shelf', 'jet', 'prosecute', 'visit', 'future', 'update', 'seize', 'applied',
      'technique', 'rebel' ,'auction', 'relative','motorcycle', 'vegetarian', 'distortion', 'gem', 'strain',
       'waist', 'digital', 'core', 'neighbour', 'echo', 'sour', 'cheap', 'key', 'critical', 'matter',
        'shrink', 'undress', 'pipe', 'nuclear', 'oppose'];

const canvas = this.document.querySelector('#canvas1');
canvas.width = 1500;
canvas.height = 1500; 
const ctx = canvas.getContext('2d');

let intervalId = 0;

let seconds = 60;
let aliveExists = false;
let started = false;
let right = false;
let chr;
let typedWord = '';
let typedLength = 0;
let rightWords = 0;
let wordList = [];

document.addEventListener('keydown', keyDownHandler);


function keyDownHandler(event){
    chr = (String.fromCharCode(event.keyCode)).toLowerCase();
    typedWord += chr;
    console.log(typedWord);
}

function randInt(min, max){
    return Math.random() * (max - min) + min;
} 

function generateWords(arr){
    const wrds = [];
    const len = arr.length;
    console.log(len);
    for (let i = 0; i < len; i++){
        const word = arr[i];
        console.log('word' + word);
        const spd = randInt(0.5, 1.5);
        const yPos = randInt(-6000, -100);
        const xPos = randInt(0, 1000);
        wrds.push(new Word(word, spd, yPos, xPos));
    }
    return wrds;
}

class Word {
    constructor(text, speed, yPos, xPos) {
        this.text = text;
        this.x = xPos;
        this.y = yPos;
        this.alive = true;
        this.speed = speed;
        this.typedWord = '';
        this.typedLength = 0;
        this.right = false;
    }

    update() {
        this.y += this.speed;
        this.typedWord = typedWord;
        if (this.y > 1500){
            this.alive = false;
            this.right = false;
        }
        
    }

    draw(context) {
        if (this.alive){
            if (!started){
                context.font = "150px Poppins";
            }
            else{
                context.font = "80px Poppins";
            }
            context.fillStyle = "black";
            context.fillText(this.text, this.x, this.y);
            this.typedLength = this.typedWord.length;
            if (this.typedWord === this.text.slice(0, this.typedLength)){
                this.right = true;
                context.fillStyle = "green";
                context.fillText(this.typedWord, this.x, this.y);
            }
            else {
                this.right = false;
                this.typedWord = '';
            }
            if (this.typedWord === this.text){
                
                this.alive = false;
                this.typedWord = '';
                this.right = false;
                if (this.text === 'start'){
                    started = true;
                    wordList = generateWords(arrayOfWords);
                    intervalId = setInterval(() => {
                        seconds--;
                    }, 1000);
                }
                else {
                    rightWords++;
                }
            }
        }
        
    }
    
}

const startWord = new Word('start', 0, 750, 600);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    right = false;

    if (!started){
        startWord.draw(ctx);
        startWord.update();
        right = startWord.right;
    }
    else {
        
        aliveExists = false;
        wordList.forEach((wrd) => {
            wrd.draw(ctx);
            wrd.update();

            if (seconds === 0){
                wrd.right = false;
                wrd.alive = false;
            }

            if (wrd.right == true){
                right = true;
            }
            if (wrd.alive == true){
                aliveExists = true;
            } 
        })
        if (!aliveExists){
            clearInterval(intervalId);
            ctx.fillStyle = 'black';
            ctx.fillText('WPM: ' + Math.floor(rightWords / ((60-seconds)/60)), 600, 700);
        }
    }
    if (right == false){
        typedWord = '';
    }
    requestAnimationFrame(animate);
}

animate(); 


