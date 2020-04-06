class ManaCostWebkit {

    static listOfManaIcons;

    static retrieveWebkit = () => {
    if (!(this.listOfManaIcons)) {
        this.listOfManaIcons = require.context( '../images/mana_symbols', true, /\.svg$/ )
    }
        return this.listOfManaIcons
    }

}

export default ManaCostWebkit