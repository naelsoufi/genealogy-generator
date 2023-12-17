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
const AGE_RANGE_FOR_MAX_FERTILITY = {'min' : 30, 'max' : 40};
const YEARS_BETWEEN_PREGNANCIES = {'min' : 1, 'max' : 4};

// DEATH
//---CHILDREN
const DEATH_RATE_AT_INFANCY = 0.25;
const DEATH_RATE_BEFORE_10 = 0.2339;
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
    return sex;
}

//--- NAME
function generatePersonFirstName(person){
    let firstNameTable = (person.sex == MALE)? MEN_COMMON_FIRST_NAMES_LIST : WOMEN_COMMON_FIRST_NAMES_LIST;
    let diceRoll = rollDice(firstNameTable.length - 1);
    let firstName = firstNameTable[diceRoll];

    return firstName;
/*
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
    }   */
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

//--- LIFE AND DEATH
function ForcedPersonAttributes(){
    this.adult = false;
    this.ageGap = undefined;
    this.sex = undefined;
    this.birthYear = undefined;
    this.deathYear = undefined;
    this.lifeExpectancy = undefined;
    this.age = undefined;
    this.surname = undefined;
}

// Did the couple reproduced before dying?
function checkForProgeny(couple){ 
    let ageAtFirstChild = rollRandomDistribution(AGE_AT_FIRST_CHILD.max, AGE_AT_FIRST_CHILD.min);

    let yearForProgeny = couple.wife.birthYear + ageAtFirstChild;
    
    if (isAlive(couple.husband, yearForProgeny) && isAlive(couple.wife, yearForProgeny)) {
        return yearForProgeny;
    }
    else {
        return false;
    }
}

function generateProgeny(yearFirstChild, couple){
    let maxFertilityAge = rollRandomDistribution(AGE_RANGE_FOR_MAX_FERTILITY.max, AGE_RANGE_FOR_MAX_FERTILITY.min);
    
    let yearEndOfFertility = couple.wife.birthYear + maxFertilityAge;

    let childBirthYear = yearFirstChild;

    let progenyArray = [];

    while ((isAlive(couple.husband, childBirthYear) && isAlive(couple.wife, childBirthYear)) && yearEndOfFertility >= childBirthYear){
        let forcedPersonAttributes = new ForcedPersonAttributes();
        forcedPersonAttributes.birthYear = childBirthYear;
        forcedPersonAttributes.surname = couple.husband.surname;

        progenyArray.push(generatePerson(forcedPersonAttributes));

        childBirthYear += rollRandomDistribution(YEARS_BETWEEN_PREGNANCIES.max, YEARS_BETWEEN_PREGNANCIES.min, 4);
    }

    return progenyArray;

}

function isAlive(person, year){
    
    if (person.deathYear > year){
        return true;
    }

    return false;
}

function generatePersonLifeExpectancy(forcedPersonAttributes){
    let personLifeExpectancy = undefined;
    let survivedToLifeExpectancy = false;

    if (typeof forcedPersonAttributes == 'undefined' || forcedPersonAttributes.adult === false){
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
        
        survivedToLifeExpectancy = true;     
    }

    if (typeof forcedPersonAttributes != 'undefined' && forcedPersonAttributes.adult){
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

function generatePersonBirthYear(forcedPersonAttributes = new ForcedPersonAttributes()){
    let personBirthYear = (forcedPersonAttributes.ageGap)? forcedPersonAttributes.birthYear + forcedPersonAttributes.ageGap : 0;
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

function generatePerson(forcedPersonAttributes = new ForcedPersonAttributes()){
    let person = new Person();
    
    person.sex = forcedPersonAttributes.sex || generatePersonSex();
    
    let fullNameArray = generatePersonFullName(person);
    person.firstName = fullNameArray.firstName;
    
    person.surname = forcedPersonAttributes.surname || fullNameArray.surname;
    person.fullName = person.firstName + ' ' + person.surname;

    person.birthYear = forcedPersonAttributes.birthYear || generatePersonBirthYear();
    person.lifeExpectancy = (forcedPersonAttributes.adult)? generatePersonLifeExpectancy(forcedPersonAttributes) : generatePersonLifeExpectancy();
    
    person.deathYear = forcedPersonAttributes.deathYear || generatePersonDeathYear(person.birthYear, person.lifeExpectancy);
    person.age = person.deathYear-person.birthYear;

    return person;
}


function generateCouple(){
    // Create the husband
    let husbandForcedPersonAttributes = new ForcedPersonAttributes();
    husbandForcedPersonAttributes.adult = true;
    husbandForcedPersonAttributes.sex = MALE;
    
    let husband = generatePerson(husbandForcedPersonAttributes);

    // Create wife
    let wifeForcedPersonAttributes = new ForcedPersonAttributes();
    wifeForcedPersonAttributes.adult = true;
    wifeForcedPersonAttributes.sex = FEMALE;
    wifeForcedPersonAttributes.birthYear = husband.birthYear;
    wifeForcedPersonAttributes.ageGap = rollRandomDistribution(10,-5);
    
    let wife = generatePerson(wifeForcedPersonAttributes);

    let couple = {'husband' : husband, 'wife' : wife};

    return couple;
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
    coupleCard.classList.add('couple', 'group');
    
    let husbandCard = generatePersonCard(husband);
    let wifeCard = generatePersonCard(wife);

    let coupleConnection = document.createElement('div');
    coupleConnection.classList.add('connection','wedding');

    coupleCard.appendChild(husbandCard);
    coupleCard.appendChild(coupleConnection);
    coupleCard.appendChild(wifeCard);

    return coupleCard;
}

function generateProgenyCards(progenyArray){
    let progenyCard = document.createElement('div');
    progenyCard.classList.add('progeny', 'group');

    for (let i = 0 ; i < progenyArray.length ; i++){
        let childCard = generatePersonCard(progenyArray[i])
        progenyCard.appendChild(childCard);

        if(i < progenyArray.length - 1){
            let siblingConnection = document.createElement('div');
            siblingConnection.classList.add('connection','sibling');
            progenyCard.appendChild(siblingConnection);
        }
    }

    return progenyCard;
}

//---DRAW
function drawCard(card){
    FAMILY_TREE_SECTION.appendChild(card);
}



// Program
//* TO DO : Transform the program to draw in SVG instead
// Learn how to draw svg. Cards become SVG rectangles
// Connect cards with lines depending on the relationship
// Probably need to have a family array with each line being a member of the family with an ID
// The object could also have a connection to others like "father", "mother", "children", "siblings"
// Having this family tree array could help with the SVG drawing calculations to place the persons at the right place
// I would need to check how to move an object with SVG though when the whole thing updates.
// Now that I think about it, maybe since this first version can't be edited, maybe I could just not draw stuff until I'm ready
// How would that work exactly is a mystery and does it make things more complex than they need to
// Probably not, I will always need to check stuff and update so might as well draw once everything is settled.
// So yeah, try SVG drawing and the family array and ID stuff
// Then we go to the next big thing : add partners to kids that are still alive  when it's time to reproduce
// Then they make kids and it keeps going like that until everyone is dead I guess.
// Might need maybe an "end date" just in case it runs forever.
// The id stuff is great, I wonder if it should mean more, like to link with uncles and aunts ?
// Probably useless and overkill tbh.

let couple = generateCouple();
let coupleCard = generateCoupleCard(couple);
drawCard(coupleCard);

let progenyCheck = undefined;
checkForProgeny = checkForProgeny(couple);

if (checkForProgeny){
    let progeny = generateProgeny(checkForProgeny, couple);
    let progenyCard = generateProgenyCards(progeny);
    drawCard(progenyCard);
}
