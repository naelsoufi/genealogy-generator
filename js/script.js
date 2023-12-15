// Loading tables
import jsonFileFirstNamesMen from "../tables/first-names-men.json" assert { type: "json"};
import jsonFileFirstNamesWomen from "../tables/first-names-women.json" assert { type: "json"};
import jsonFileSurnames from "../tables/surnames.json" assert { type: "json"};

// Stocking in const for no accidents
const MEN_COMMON_FIRST_NAMES_LIST = jsonFileFirstNamesMen.common;
const WOMEN_COMMON_FIRST_NAMES_LIST = jsonFileFirstNamesWomen.common;
const FRENCH_SURNAMES_LIST = jsonFileSurnames.french
/*
---
--- CONSTANCE
---
*/
// DOM
const FAMILY_TREE_SECTION = document.querySelector('#familyTree');

// NOMENCLATURE
const MALE = 'male';
const FEMALE = 'female';

// TIME
const CURRENT_YEAR = 5955;

// COUPLE
const AGE_AT_FIRST_CHILD = {'min' : 15, 'max' : 30};

// DEATH
//---CHILDREN
const MISCARRIAGE_RATE = 0.33;
const DEATH_RATE_AT_INFANCY = 0.33;
const DEATH_RATE_BEFORE_10 = 0.5;
const YOUNG_ADULT_DEATH_RATE = 0.33;
const LIFE_EXPECTANCY_AT_10 = 32;

//---ADULT
const RISK_OF_PREGNANCY_DEATH = 0.05;
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
function randomDistribution(v){ 
    let r = 0;
    for(let i = v; i > 0; i --){
        r += Math.random();
    }
    return r / v;
}

function rollDice(maxRange, minRange = 1){
    let diceResult = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    return diceResult;
}

function rollRandomDistribution(maxRange, minRange, force = 3){
    /* force determines the look of the bell curve
    ** while 1 is normal mathfloor, 2 is a pyramid, 3 is a good bell curve and 4 is a strict bell curve
    ** 5 is overkill.
    */
    let result = Math.floor(randomDistribution(force) * (maxRange - minRange + 1)) + minRange;
    return result;
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
//--- SEX
function generatePersonSex(){
    let sex;
    if(flipCoin()){
        sex = MALE;
    }
    else
    {
        sex = FEMALE;
    }
}
//--- NAME
function generatePersonFirstName(person){
    if (person.sex == MALE){
        let tableSize = MEN_COMMON_FIRST_NAMES_LIST.length - 1;
        let diceRoll = rollDice(tableSize);
        let firstName = MEN_COMMON_FIRST_NAMES_LIST[diceRoll];
        return firstName;
    }
    else
    {
        let tableSize = WOMEN_COMMON_FIRST_NAMES_LIST.length - 1;
        let diceRoll = rollDice(tableSize);
        let firstName = WOMEN_COMMON_FIRST_NAMES_LIST[diceRoll];
        
        return firstName;
    }   
}

function generatePersonSurname(){
    let tableSize = FRENCH_SURNAMES_LIST.length - 1;
    let diceRoll = rollDice(tableSize);
    let surname = FRENCH_SURNAMES_LIST[diceRoll];
    return surname;
}

function generatePersonFullName(person){
    let firstName = generatePersonFirstName(person);
    let surname = generatePersonSurname();

    let fullName = {firstName: firstName, surname: surname};

    return fullName;
}

//--- BIRTH AND DEATH
function ForcedLifeDates(){
    this.adult = false;
    this.birthYear = undefined;
    this.ageGap = undefined;
}

// Did the couple reproduced before dying?
function checkForFirstChild(couple){
    let husbandLifeExpectancy = couple.husband.lifeExpectancy;
    let wifeLifeExpectancy = couple.wife.lifeExpectancy;
    
    let ageAtFirstChild = rollRandomDistribution(AGE_AT_FIRST_CHILD.max, AGE_AT_FIRST_CHILD.min);
    // Check the year. Are husband and wife still alive when wife has the ageAtFirstChild ? If one of them is dead, no children
    // Then make a function for number of pregnancies and then how much they are spaced (normal distribution with 1-5 years)
    // Maybe only keep the ones that reached adulthood ? Also year of birth is important for the kids. That will generate a person
}

function generatePersonLifeExpectancy(forcedLifeDates){
    let personLifeExpectancy = undefined;
    let survivedToLifeExpectancy = false;

    if (typeof forcedLifeDates == 'undefined' || forcedLifeDates.adult === false){
        /* CHILDHOOD */
        // Death before 1 years old
        let survivedFirstYear = checkDiceRollSuccess(roll1d100(), DEATH_RATE_AT_INFANCY * 100);
        if (survivedFirstYear === false){
            personLifeExpectancy = 0;
            return personLifeExpectancy;
        }

        // Death before 10 years old
        let survivedTenFirstYears = checkDiceRollSuccess(roll1d100(), DEATH_RATE_BEFORE_10 * 100);
        if (survivedTenFirstYears === false){
            personLifeExpectancy = rollDice(9);
            return personLifeExpectancy;
        }
        
        // Survived 10 years old
        survivedToLifeExpectancy = flipCoin();
        if (survivedToLifeExpectancy === false){
            personLifeExpectancy = rollDice(LIFE_EXPECTANCY_AT_10, 10);
            //*TO-DO : If reached 20-22, start the child making process until dead
            return personLifeExpectancy;
        }
    }

    if (typeof forcedLifeDates != 'undefined' && forcedLifeDates.adult){
        // The adult didn't reach life expectancy but reached the age to reproduce
        survivedToLifeExpectancy = flipCoin();
        if (survivedToLifeExpectancy === false){
            personLifeExpectancy = rollDice(LIFE_EXPECTANCY_AT_10, 20);
            return personLifeExpectancy;
        }
    }

    if (survivedToLifeExpectancy){
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
}

function generatePersonBirthYear(forcedLifeDates){
    let personBirthYear = 0;
    console.log(forcedLifeDates.birthYear);
    if(forcedLifeDates.birthYear != undefined && forcedLifeDates.ageGap != undefined)
    {
        personBirthYear = forcedLifeDates.birthYear + forcedLifeDates.ageGap;
    }
    return personBirthYear;
}

//* TO DO : We check if the person's death year is greater than current year
//* TO DO : We add a cause of death
//* TO DO : We add a precision (sub category)
//* TO DO : We add an adjective to the death (suspicious, barely noticed...)
//* TO DO : We have different chances of death depending on the age
function generatePersonDeathYear(birthYear, lifeExpectancy){
    let personDeathYear = birthYear + lifeExpectancy;
    return personDeathYear;
}

//--- GENERATE OBJECTS
function Person(){
    this.sex = "";
    this.firstName = "";
    this.surname = "";
    this.birthYear = undefined;
    this.deathYear = undefined;
    this.lifeExpectancy = undefined;
    this.age = 0;
}

function generatePerson(sex, forcedLifeDates){
    let person = new Person();
    person.sex = sex || generatePersonSex();
    
    let fullNameArray = generatePersonFullName(person);
    person.firstName = fullNameArray.firstName;
    person.surname = fullNameArray.surname;
    person.fullName = person.firstName + ' ' + person.surname;

    if(forcedLifeDates){
        person.birthYear = generatePersonBirthYear(forcedLifeDates);
        person.lifeExpectancy = generatePersonLifeExpectancy(forcedLifeDates);
    }
    else
    {
        person.birthYear = generatePersonBirthYear();
        person.lifeExpectancy = generatePersonLifeExpectancy();
    }
    
    person.deathYear = generatePersonDeathYear(person.birthYear, person.lifeExpectancy);
    person.age = person.deathYear-person.birthYear;
    
    return person;
}


function generateCouple(){
    // Create the husband
    let husbandForcedLifeDates = new ForcedLifeDates();
    husbandForcedLifeDates.adult = true;
    
    let husband = generatePerson(MALE, husbandForcedLifeDates);

    // Create wife
    let wifeForcedLifeDates = new ForcedLifeDates();
    wifeForcedLifeDates.adult = true;
    wifeForcedLifeDates.birthYear = husband.birthYear;
    wifeForcedLifeDates.ageGap = rollRandomDistribution(10,-5);
    
    let wife = generatePerson(FEMALE, wifeForcedLifeDates);

    let couple = {'husband' : husband, 'wife' : wife};

    return couple;
}


function generateProgeny(couple){
    //Did they have a kid ?
    let progenySurname = couple.husband.surname;
}

//---GENERATE CARDS
function generatePersonCard(person){
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
    
    return personCard;
}

function generateCoupleCard(couple){
    let husband = couple.husband;
    let wife = couple.wife;

    let coupleCard = document.createElement('div');
    coupleCard.classList.add('couple');
    
    let husbandCard = generatePersonCard(husband);
    let wifeCard = generatePersonCard(wife);

    let coupleConnection = document.createElement('div');
    coupleConnection.classList.add('connection','wedding');

    coupleCard.appendChild(husbandCard);
    coupleCard.appendChild(coupleConnection);
    coupleCard.appendChild(wifeCard);

    return coupleCard;
}

//---DRAW
function drawCard(card){
    FAMILY_TREE_SECTION.appendChild(card);
}



// Program
//* TO DO : Button to add a person
//* TO DO : Add Parents / Siblings / Children
//* TO DO : Investigate drawing links between cards
/*let person = new Person(generatePersonFullName(), generatePersonLifeDates());
addPerson(person);*/
let couple = generateCouple();
let coupleCard = generateCoupleCard(couple);
drawCard(coupleCard);