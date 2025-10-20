const slider = document.getElementById("slider");
const button = document.getElementById("generateBtn");
const passwordToDisplay = document.getElementById('password');
const copyBtn = document.getElementById("copy");
const copyText = document.getElementById('copy-text');

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

updateSliderFill();

slider.addEventListener("input", updateSliderFill);

button.addEventListener("click", generatePassword);

copy.addEventListener("click", copyContent);


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

function generatePassword(event){
    event.preventDefault();
    copyText.textContent =''
    const passwordLetters = "abcdefghijklmnopqrstuvwxyz";
    const passwordNumbers = "1234567890";
    const passwordSymbols = "!@#$%^&*?~";
    let [passwordLength, passwordSettingsArr] = passwordSettings();
    if(passwordSettingsArr.length === 0) return

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
    
}

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

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordToDisplay.textContent)
        copyText.textContent ='copied'
    } catch (e) {
        console.error(e)
    }

}