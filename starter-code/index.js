const slider = document.getElementById("slider");
const button = document.getElementById("generateBtn");
const passwordToDisplay = document.getElementById('password');
const copyBtn = document.getElementById("copy");
const copyText = document.getElementById('copy-text');


slider.addEventListener("input", updateSliderFill);

button.addEventListener("click", generatePassword);

copy.addEventListener("click", copyContent);

updateSliderFill();

// Slider
function updateSliderFill() {
    const sliderValueOutput = document.getElementById("slider-value");

    const value = slider.value;
    const min = slider.min;
    const max = slider.max;
    const percentage = ((value - min) / (max - min)) * 100;

    slider.style.setProperty('--fill-percentage', percentage + '%');

    slider.style.background = `linear-gradient(
    to right, 
    rgb(164, 255, 175) 0%, 
    rgb(164, 255, 175) ${percentage}%, 
    rgb(24, 23, 31) ${percentage}%,
    rgb(24, 23, 31) 
    100%)`;

    sliderValueOutput.textContent = value; 
}

// password checkboxes and length
function passwordSettings() {
    const checkboxes = document.querySelectorAll('.checkboxes');
    const characters = slider.value;
    const passwordIncludes = []
    checkboxes.forEach(element => {
        const selected = element.checked;
        if(!selected) return
        const checkboxes = {
            id: element.id,
            selected: selected
        };
        passwordIncludes.push(checkboxes)
    });
   return [characters, passwordIncludes];
}

// create the password with settings
function generatePassword(event){
    event.preventDefault();
    copyText.textContent =''
    const passwordLetters = "abcdefghijklmnopqrstuvwxyz";
    const passwordNumbers = "1234567890";
    const passwordSymbols = "!@#$%^&*?~";
    let [passwordLength, passwordSettingsArr] = passwordSettings();
    if(passwordSettingsArr.length === 0) return
    copyBtn.style.filter = 'none';

    const findSetting = new Set (passwordSettingsArr.map((el => el.id.toLowerCase())))

    const possibleChars = [];
    const guranteedChars = [];
    if (findSetting.has("lowercase")) {
        possibleChars.push(...passwordLetters); 
        guranteedChars.push(passwordLetters[Math.floor(Math.random() * passwordLetters.length)]);
    }
    if (findSetting.has("uppercase")) {
        possibleChars.push(...passwordLetters.toUpperCase()); 
        guranteedChars.push(passwordLetters[Math.floor(Math.random() * passwordLetters.length)].toUpperCase());
    }
    if (findSetting.has("numbers")) {
        possibleChars.push(...passwordNumbers);
        guranteedChars.push(passwordNumbers[Math.floor(Math.random() * passwordNumbers.length)]);
    } 
    if (findSetting.has("symbols")) {
        possibleChars.push(...passwordSymbols);
        guranteedChars.push(passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)]);
    }
    let password = '';
    guranteedChars.forEach(char => {
        if(password.length < passwordLength) password += char;  
    });
    for (let i = 0; i < passwordLength - guranteedChars.length; i++) {
        const randomChar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
        password += randomChar;
    }
    password = shuffleArray([...password])
    passwordToDisplay.textContent = password.join('')
    passwordToDisplay.style.color = 'rgb(230, 229, 234)'

    passwordStrength(password, passwordLetters, passwordNumbers, passwordSymbols);
    
}

// shuffle an array
function shuffleArray(array){
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [ array[randomIndex],  array[currentIndex]];
  }

  return array;
}

// copy to clipboard
async function copyContent() {
    if(copyBtn.style.filter != 'none') return
    try {
        await navigator.clipboard.writeText(passwordToDisplay.textContent)
        copyText.textContent ='copied'
    } catch (e) {
        console.error(e)
    }

}

// rate the stength of the password
function passwordStrength(password, letters, numbers, symbols) {
    const strengthElement = document.getElementById('passwordStrength');
    const boxes = document.querySelectorAll('.boxes');

    boxes.forEach(element => {
        element.style.backgroundColor = 'inherit'
        element.style.borderColor = 'var(--clr-body)'

    });
    let rating = 0;
    let strength = '';
    let strengthColor;
    let numberOfBlocks;
    password.forEach(element => {
        if(element === element.toUpperCase()) rating += 1;
        if(element === element.toLowerCase()) rating += 1;
        if(numbers.includes(element)) rating += 2
        if(symbols.includes(element)) rating += password.length > 7 ? 5 : 1
    });
    switch(true) {
        case rating <= 10:
            strength = 'too weak!';
            strengthColor = '#F64A4A';
            numberOfBlocks = 1;
            break;
        case rating <= 15: 
            strength = 'weak';
            strengthColor = '#FB7C58' 
            numberOfBlocks = 2;
            break;
        case rating <= 20:
            strength = 'medium';
            strengthColor = '#F8CD65'
            numberOfBlocks = 3;
            break;
        case rating > 21:
            strength = 'strong';
            strengthColor = 'var(--clr-primary)'
            numberOfBlocks = 4;
            break;
    }
    console.log(rating <= 20)
    console.log(rating)
    console.log(strength)
    strengthElement.textContent = strength.toUpperCase();

    for(let i = 0; i < numberOfBlocks; i++){
        boxes[i].style.backgroundColor = strengthColor
        boxes[i].style.borderColor = strengthColor
    }

}