var fs = require('fs');
var cardContainer;
var cardDataPath = '../api/json/scryfall/cards.json';

/*This currently uses local JSON storage instead of postgreSQL*/
exports.fetchCards = () => {
    if (cardContainer == undefined) {
        cardContainer = JSON.parse(fs.readFileSync(cardDataPath));
    }
    return cardContainer;     
}

exports.queryKeys = () => {
    if (this.fetchCards()[0] === undefined){
        return [];
    } else {
    return Object.keys(this.fetchCards()[0]).map(
        (item) => {return item;}
    )
    }
}

exports.updateCards = () => {
    cardContainer = JSON.parse(fs.readFileSync(cardDataPath));
}

/*Subcontainer so this function can be chained to refine results. E.g. C->Co->Cob->Cobr...*/
exports.queryCardList = (nameFragment, subcontainer = this.fetchCards()) => {
    return subcontainer.filter(item => item.name.toLowerCase().includes(nameFragment.toLowerCase()))
}

exports.selectExactCard = (setID, set, subcontainer = this.fetchCards()) => {
    return subcontainer.filter(item => item.collector_number == setID && item.set == set)[0];
}
