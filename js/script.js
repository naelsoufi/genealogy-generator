// Loading tables
import jsonFileFirstNamesMen from "../tables/first-names-men.json" assert { type: "json"};
import jsonFileSurnames from "../tables/surnames.json" assert { type: "json"};

// Stocking in const for no accidents
const MEN_COMMON_FIRST_NAMES_LIST = jsonFileFirstNamesMen.common;
const FRENCH_SURNAMES_LIST = jsonFileSurnames.french

/*
---
--- CONSTANCE
---
*/
// DOM
const FAMILY_TREE_SECTION = document.querySelector('#familyTree');

// TIME
const CURRENT_YEAR = 5955;
// DEATH
//---CHILDREN
const MISCARRIAGE_RATE = 0.33;
const DEATH_RATE_AT_INFANCY = 0.33;
const DEATH_RATE_BEFORE_10 = 0.5;
const YOUNG_ADULT_DEATH_RATE = 0.33;
const LIFE_EXPECTANCY_AT_10 = 32;
//---ADULT
const LIFE_EXPECTANCY_AVERAGE = 50;
const LIFE_EXPECTANCY_AT_50 = 63;
const LIFE_EXPECTANCY_AT_60 = 71;
const LIFE_EXPECTANCY_AT_70 = 76;
const LIFE_EXPECTANCY_AT_80 = 86;
const LIFE_EXPECTANCY_AT_90 = 96;
const LIFE_EXPECTANCY_AT_100 = 106;
const LIFE_EXPECTANCY_AT_110 = 116;
const LIFE_EXPECTANCY_MAX = 129;
const LIFE_EXPECTANCY_TABLE = [
    LIFE_EXPECTANCY_AT_10,
    LIFE_EXPECTANCY_AVERAGE,
    LIFE_EXPECTANCY_AT_50,
    LIFE_EXPECTANCY_AT_60,
    LIFE_EXPECTANCY_AT_70,
    LIFE_EXPECTANCY_AT_80,
    LIFE_EXPECTANCY_AT_90,
    LIFE_EXPECTANCY_AT_100,
    LIFE_EXPECTANCY_AT_110,
    LIFE_EXPECTANCY_MAX];

/*
---
--- FUNCTIONS
---
*/

// TOOLS

function rollDice(max, min = 1){
    let diceResult = Math.floor(Math.random() * (max - min + 1)) + min;
    return diceResult;
}

function roll1d100(){
    let diceResult = rollDice(100);
    return diceResult;
}

function checkDiceRollSuccess(diceResult, diceThreshold){
    if (diceResult >= diceThreshold){
        return true;
    } else {
        return false;
    }
}

function flipCoin(){
    let coin = rollDice(1, 0);
    if (coin > 0){
        return true;
    }
    return false;
}

function checkIfFirstPerson(){
    if(FAMILY_TREE_SECTION.hasChildNodes()) {
        return false;
    } else {
        return true;
    }
}

// PERSON
//--- NAME
function generatePersonFirstName(){
    let tableSize = MEN_COMMON_FIRST_NAMES_LIST.length - 1;
    let diceRoll = rollDice(tableSize);
    let firstName = MEN_COMMON_FIRST_NAMES_LIST[diceRoll];

    return firstName;
}

function generatePersonSurname(){
    let tableSize = MEN_COMMON_FIRST_NAMES_LIST.length - 1;
    let diceRoll = rollDice(tableSize);
    let surname = FRENCH_SURNAMES_LIST[diceRoll];

    return surname;
}
function generatePersonFullName(){
    let firstName = generatePersonFirstName();
    let surname = generatePersonSurname();

    let fullName = {firstName: firstName, surname: surname};

    return fullName;
}
//--- BIRTH AND DEATH
function generatePersonLifeExpectancy(){
    let personLifeExpectancy = 0;

    // Death before 1 years old
    let survivedFirstYear = checkDiceRollSuccess(roll1d100(), DEATH_RATE_AT_INFANCY * 100);
    if (survivedFirstYear === false){
        return personLifeExpectancy;
    }

    // Death before 10 years old
    let survivedTenFirstYears = checkDiceRollSuccess(roll1d100(), DEATH_RATE_BEFORE_10 * 100);
    if (survivedTenFirstYears === false){
        personLifeExpectancy = rollDice(9);
        return personLifeExpectancy;
    }
    
    // Survived 10 years old
    let survivedToAdulthood = flipCoin();
    if (survivedToAdulthood === false){
        personLifeExpectancy = rollDice(LIFE_EXPECTANCY_AT_10, 10);
        return personLifeExpectancy;
    }

    // Teenagehood and Adulthood
    let beatLifeExpectancy = flipCoin();
    // Allows to navigate the life expectancy table that contains life expectancies for each decade survived
    let lifeExpectancyIndex = 0;
    while (beatLifeExpectancy && (lifeExpectancyIndex < LIFE_EXPECTANCY_TABLE.length)){
        lifeExpectancyIndex++;
        beatLifeExpectancy = flipCoin();
    }

    // Once the person's luck has ran out, we check his life expectancy between his age two thresholds
    personLifeExpectancy = rollDice(LIFE_EXPECTANCY_TABLE[lifeExpectancyIndex + 1], LIFE_EXPECTANCY_TABLE[lifeExpectancyIndex])
    return personLifeExpectancy
}

function generatePersonBirthYear(){
    let personBirthYear = 0;

    // Will evolve
    //* TO DO : First person birth is minimum 30 something
    //* TO DO : A field allows us to decide the year
    if (checkIfFirstPerson()){
        personBirthYear = CURRENT_YEAR;
    } else {
        personBirthYear = 0;
    }
    return personBirthYear;
}

//* TO DO : We check if the person's death year is greater than current year
function generatePersonDeathYear(personBirthYear){
    let personDeathYear = personBirthYear + generatePersonLifeExpectancy();
    return personDeathYear;
}

//* TO DO : Account for no death year
function generatePersonLifeDates(){
    let birthYear = generatePersonBirthYear();
    let deathYear = generatePersonDeathYear(birthYear);

    let lifeDates = {birth: birthYear, death: deathYear};
    return lifeDates;
}

//--- CREATE / ADD
function Person (fullName, lifeDates){
    this.firstName = fullName.firstName;
    this.surname = fullName.surname;
    this.birthYear = lifeDates.birth;
    this.deathYear = lifeDates.death;
    this.age = lifeDates.death - lifeDates.birth;
}

function addPerson(person){
    let personName = document.createElement('h2');
    personName.textContent = person.firstName + " " + person.surname;

    let personLifeDates = document.createElement('p');
    personLifeDates.textContent = person.birthYear + " - " + person.deathYear;

    let personAge = document.createElement('p');
    personAge.textContent = "(" + person.age + " years old)"

    let personCard = document.createElement('div');
    personCard.classList.add('person');
    personCard.appendChild(personName);
    personCard.appendChild(personLifeDates);
    personCard.appendChild(personAge);

    FAMILY_TREE_SECTION.appendChild(personCard);
}

// Program
//* TO DO : Button to add a person
//* TO DO : Add Parents / Siblings / Children
//* TO DO : Investigate drawing links between cards
let person = new Person(generatePersonFullName(), generatePersonLifeDates());
addPerson(person);