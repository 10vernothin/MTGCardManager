
/*This function replaces a mana cost with its SVG equivalents*/
var replaceManaCostWithSVG = async (stringRepresentation) => {
    if (stringRepresentation === undefined || stringRepresentation === '') {
        return ([])
    }
    let listOfCosts = stringRepresentation.split('{').slice(1);
    listOfCosts = listOfCosts.map((sym) => {
                let remadeSym = '{'.concat(sym)
                return remadeSym
        })
    let list = await fetch('/api/cards/fetch-list-of-SVG',
    {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(listOfCosts)
    })
    let resolved_list = await list.json();
    return resolved_list.data
}


export default replaceManaCostWithSVG;