

const _db = require('../database/database.js')
const promise = require('bluebird')


var verboseSetting = false

function toConsole(comment) {
    if(verboseSetting) {
        console.log(comment)
    }
}

exports.testDatabaseIntegrity = async (opts) => {
    try {
        console.log("TESTING DATABASE INTEGRITY...")
        opts = Object.assign({}, { recreateTables: 'false', generateReport: 'true', verbose: false }, opts)
        verboseSetting = opts.verbose;
        const testCard = { card_name: "test's", set_code: "10abc", collector_number: "defhjk", price: 0.10, foil_price: 7.00 }
        const testCard2 = { card_name: "t2", set_code: "29def", collector_number: "10101", price: 0.13, foil_price: 3337.00 }
        const testAccount = { username: "testAccount", email: "abc@email.com", pwd: "password" }
        const testListing = { collection_name: "collection's name", description: "description" }
        const addCard = { is_foil: true }
        const dets = {..._db.getDetails(), password: 'REDACTED'}
        var report = {
            details: dets,
            count: 'untested',
            truncate: 'untested',
            drop: 'untested',
            create: 'untested',
            users: {},
            listing: {},
            collection: {},
            cards: {}
        }


        //truncate the table
        if (opts.recreateTables === 'truncate' ||!(opts.recreateTables ==='false')) {
            report.truncate = 'failed'
            await promise.all([_db.getConnectionInstance().users.truncateTable(), _db.getConnectionInstance().listing.truncateTable(), _db.getConnectionInstance().collection.truncateTable(), _db.getConnectionInstance().cards.truncateTable()])
            toConsole("Table truncated.")
            report.truncate = 'passed'
        } else if (opts.recreateTables === 'recreate') {
            report.drop = 'failed'
            await _db.getConnectionInstance().users.dropTable()
            await _db.getConnectionInstance().listing.dropTable()
            await _db.getConnectionInstance().collection.dropTable()
            await _db.getConnectionInstance().cards.dropTable()
            report.drop = 'passed'
            report.create = 'failed'
            await _db.createAllTables()
            report.create = 'passed'
        }

        
        

        //Creating a new user
        report.users.add = 'failed'
        toConsole(report.users)
        const user_res = (await _db.getConnectionInstance().users.add(testAccount))
        toConsole("USER ADDED:")
        toConsole(user_res)
        const user_id = user_res[0].id
        report.users.add = 'passed'

        //Creating a new card
        report.cards.insert = 'failed'
        const cards_res = await _db.getConnectionInstance().cards.upsert(testCard)
        toConsole("CARD ADDED:")
        const card_id = cards_res[0].id
        report.cards.insert = 'passed'

        //Creating a new collection profile ( listing)
        report.listing.add = 'failed'
        const listing_res = await _db.getConnectionInstance().listing.add({ ...testListing, user_id: user_id })
        toConsole("LISTING ADDED:")
        toConsole(listing_res)
        const listing_id = listing_res[0].id
        report.listing.add = 'passed'

        //Updating the collection profile details
        report.listing.update = 'failed'
        const updated_res = await _db.getConnectionInstance().listing.update(listing_id,
            { collection_name: `New "Name's`, description: `aA'2-_!@#$%^&*()"`, showcase_card_id: card_id }
        )
        toConsole("LISTING UPDATED")
        toConsole(JSON.stringify(updated_res))
        report.listing.update = 'passed'

        //Returning a list of profiles of a user
        report.listing.fetchlist = 'failed'
        const fetch_list = await _db.getConnectionInstance().listing.fetchList(user_id)
        toConsole("LIST OF COLLECTION PROFILES:")
        toConsole(fetch_list)
        report.listing.fetchlist = 'passed'

        //Adding a new card to collection 
        report.collection.add = 'failed'
        const added_res = await _db.getConnectionInstance().collection.add({ ...addCard, card_id: card_id, listing_id: listing_id })
        toConsole("CARD ADDED TO COLLECTION")
        toConsole(added_res)
        report.collection.add = 'passed'

        //Adding the same card 5 times to the collection
        report.collection.increase = 'failed'
        const increase_res = await _db.getConnectionInstance().collection.add({ ...addCard, amt: 5, card_id: card_id, listing_id: listing_id })
        toConsole("CARD AMOUNT INCREASED")
        toConsole(increase_res)
        report.collection.increase = 'pass'

        //Updating card details
        report.cards.update = 'failed'
        const update_card_res = await _db.getConnectionInstance().cards.upsert({...testCard2, set_code: testCard.set_code, collector_number: testCard.collector_number})
        //Adding the another card 5 times to the collection
        toConsole("CARD UPDATED ")
        toConsole(update_card_res)
        report.cards.update = 'passed'


        //Fetching a collection detail
        report.collection.fetchcollection = 'failed'
        const fetch_collection = await _db.getConnectionInstance().collection.fetchCollection(listing_id)
        toConsole("Render List of Cards in a Collection")
        toConsole(fetch_collection)
        report.collection.fetchcollection = 'passed'

        //Removing a card from collection
        report.collection.decrease = 'failed'
        const decrease_res = await _db.getConnectionInstance().collection.remove({ ...addCard, card_id: card_id, listing_id: listing_id })
        toConsole("CARD AMOUNT DECREASED:")
        toConsole(decrease_res)
        report.collection.decrease = 'passed'

        //Removing cards, over the amount
        report.collection.remove = 'failed'
        const remove_res = await _db.getConnectionInstance().collection.remove({ ...addCard, amt: 7, card_id: card_id, listing_id: listing_id })
        toConsole("TOTAL CARDS REMOVED:")
        toConsole(remove_res)
        report.collection.remove = 'passed'

        //Count each table
        report.count = 'failed'
        const count = await (promise.all([_db.getConnectionInstance().users.total(), _db.getConnectionInstance().listing.total(), _db.getConnectionInstance().collection.total(), _db.getConnectionInstance().cards.total()]))
        toConsole("Count: [Users, Listings, Collection, Cards]")
        toConsole(count)
        report.count = 'passed'

        //Removing collection profile
        report.listing.delete = 'failed'
        const remove_col_res = await _db.getConnectionInstance().listing.remove(listing_id)
        toConsole("LISTING REMOVED:")
        toConsole(remove_col_res)
        report.listing.delete = 'passed'

        //Query card
        report.cards.query = 'failed'
        const query = await _db.getConnectionInstance().cards.query('t')
        toConsole("QUERY CARDS")
        toConsole(query)
        report.cards.query = 'passed'

        //Removing user
        report.users.delete = 'failed'
        const remove_user = await _db.getConnectionInstance().users.remove({id:user_id})
        toConsole("USER REMOVED")
        report.users.delete = 'passed'

        //Removing card

        report.cards.delete = 'failed'
        const remove_card = await _db.getConnectionInstance().cards.remove({set_code: testCard.set_code, collector_number: testCard.collector_number})
        toConsole("CARD REMOVED")
        toConsole(remove_card)
        report.cards.delete = 'passed'

        console.log("ALL TESTS PASSED.")

        if (!verboseSetting) {
            console.log("(To see full details turn on verbose mode by specifying ?opts={verbose: true)}")
        }
        if (opts.generateReport) {
            
            console.log("You can access the report by accessing the returned Object's report props.")
            return {passed: true, report: report}
        } else {
            return report
        }
        


    } catch (err) {
        toConsole(err)
        console.log("TESTING FAILED. PLEASE REFER TO REPORT.")
        return {passed: false, report: report, err: err}
    }
}

exports.testDatabaseAvailability = async (dbName) => {
    newdbDets = JSON.parse(JSON.stringify(_db.getDetails()).valueOf())
    newdbDets.database = dbName
    toConsole(newdbDets)
    return _db.testConnection(newdbDets, true)
}
