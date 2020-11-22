'use strict';

const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const storagefile = 'fooditems.json';

const worker = createWorker({
    logger: m => console.log(m),
});

async function imageparser() {
    let tmptxt = '', toreturn = [''];

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    try {
        const { data: { text } } = await worker.recognize(path.join(__dirname, '..', 'public/images', 'costco1.jpg'));
        toreturn = text

        await worker.terminate();
    } catch (error) {
        console.log(error);
    }

    tmptxt = itemParser(toreturn);
    let a = [];

    for(let b = 0; b < tmptxt.length; b++){
        let c = {};
        c.a = tmptxt[b].replace(' ', '');
        a.push(c);
    }

    addItems(a);
    // console.log(a);

    return tmptxt;
}

// Remove items from storage. array of numbers
function removeItems(toRemove) {
    let tmp = getItems();
    let items = [];

    for(let z = 0; z < tmp.length; z++){

        if(!(toRemove.includes(tmp[z].a))){
            items.push(tmp[z]);
        }
    }

    let b = JSON.stringify(items);
    fs.writeFileSync(storagefile, b);
}

// Add items to storage
// toAdd -> array of objects
function addItems(toAdd){
    let items = getItems();

    try {
        // {'a': 111, 'b': 222}
        for(let z = 0; z < toAdd.length; z++){
            let y = {};

            if (!toAdd[z].a) {
                continue
            } else {
                y.a = toAdd[z].a.replace(' ', '');
            }

            y.b = toAdd[z].b ? toAdd[z].b : '00';

            items.push(y);
        }

        let b = JSON.stringify(items);

        fs.writeFileSync(storagefile, b);
    } catch (error) {
        console.log(error)
    }
}

// Get items in storage
function getItems(){

    let rawdata = '';
    try {
        rawdata = fs.readFileSync(storagefile);
    } catch (error) {
        return [];
    }

    let items = JSON.parse(rawdata);

    return items; // array of objects
}

// Inaam Function
function itemParser (raw_str){

    //Remove header-footer strings
    let detailed_items, detailed_items_regx, replacement, cleand_items;
    detailed_items_regx = /([' ',(A-Z)|(0-9),' ']*)[' '][[0-9,' ']*[.][0-9,' ']*/g
    detailed_items = raw_str.match(detailed_items_regx).toString()

    // Pre-processing to remove E or B
    replacement = /(^| )[E|B]( |$)/g

    cleand_items = detailed_items.replace(replacement, '')

    const regex = /[' ']([' ',A-Z,' ']*)[' ']/g;

    return cleand_items.match(regex);
}


module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    app.get('/receipts', function(req, res) {
        res.render('pages/receipts');
    });

    app.get('/inventory', function(req, res) {
        let a = getItems();
        // JSON.stringify( a ).replace(/\\/g, '\\\\').replace(/"/g, '\\\"')
        res.render('pages/inventory', {Items: a});
    });

    app.get('/recipes', function(req, res) {
        res.render('pages/recipes');
    });

    app.get('/fooditems', function(req, res) {
        return fs.readFileSync(storagefile);
    });

    app.get('/parseimage', async function (req, res) {

        try{
            await imageparser();
        }
        catch(e){
            console.log(e)
        }

        // addItems([{'a': 111, 'b': 222}, {'a': 222, 'b': 333}]);
        // console.log(getItems());
        // removeItems([111, 444]);
    });

};