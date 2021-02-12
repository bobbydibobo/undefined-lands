/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');

/*----------------------
ROUTER INIT
----------------------*/
const router = express.Router();

/*----------------------
MODELS
----------------------*/
const Quest = require('../models/Quest');

/*----------------------
CUSTOM FUNCTIONS
----------------------*/
const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/user/login');
}

const checkAdmin = (req, res, next) => {
    if(req.user.admin === true) {
        return next();
    }

    res.redirect('/game')
}

/*----------------------
USER-UPDATE-ROUTES
----------------------*/
router.get('/', checkAuth, (req, res) => {
    res.render('game', {
        id: req.user.id,
        name: req.user.username,
        level: req.user.level,
        coins: req.user.coins,
        stats: req.user.stats,
        army: req.user.army,
        supplies: req.user.supplies,
        map: req.user.map
    });
});

router.get('/lol', (req, res) => {
    res.render('lol');
});

router.put('/updateLvl', async (req, res) => {
    let user = req.user;
    user.level = req.user.level;
    user.coins = req.user.coins;

    try{
        user.coins += (user.level * 100);
        user.level++;
        await user.save();

        if(user.level === 60){
            res.redirect('/game/lol')
        } else {
            res.redirect('/game');
        } 
    } catch(e) {
        console.log(e);
        res.redirect('/game');
    }
});

/*----------------------
QUEST-ROUTES
----------------------*/
//get Quest Overview
router.get('/quests', async (req, res) => {
    const quests = await Quest.find().sort({ requiredLvl: 'desc' });
    const userLevel = await req.user.level;
    const admin = await req.user.admin;
    res.render('questsShow', { quests: quests, level: userLevel, admin: admin });
});

//get new Quest page
router.get('/quests/new', checkAdmin, (req, res) => {
    res.render('questsNew', { quest: new Quest() });
});

//get edit quest page
router.get('/quests/edit/:id', checkAdmin, async (req, res) => {
    try{
        const quest = await Quest.findById(req.params.id);
        res.render('questsEdit', { quest: quest });
    } catch {
        res.redirect('/game')
    } 
});

//get single quest view
router.get('/quests/:slug', async (req, res) => {
    const quest  = await Quest.findOne({ slug: req.params.slug });
    const userLevel = await req.user.level;
    const admin = await req.user.admin;
    if(quest == null){
        res.redirect('/game');
    }
    res.render('singleQuest', { quest: quest, level: userLevel, admin: admin });
});

//new quest handler
router.post('/quests', async (req, res, next) => {
    req.quest = new Quest();
    next();
}, saveQuestAndRedirect('questsNew'));

router.put('/quests/:id', async (req, res, next) => {
    //req.quest = await Quest.findById(req.params.id);
    req.quest = await Quest();
    next();
}, saveQuestAndRedirect('questsEdit'));

//delete quest
router.delete('/quests/:id', async (req, res) => {
    await Quest.findByIdAndDelete(req.params.id);
    res.redirect('/game/quests');
});

/*----------------------
SHOP ROUTES
----------------------*/
router.get('/buildings', async (req, res) => {
    const coins = await req.user.coins;
    const army = await req.user.army;
    const supplies = await req.user.supplies;
    const map = await req.user.map;

    res.render('buildShop', { 
        coins: coins,
        supplies: supplies,
        army: army,
        map: map
    });
});

router.get('/error', (req, res) => {
    res.render('errorSite');
});

router.put('/buildings', async (req, res) => {
    const tileNr = await parseInt(req.body.tileNr);
    const buildNr = await parseInt(req.body.buildNr);
    let user = req.user;
    user.map = req.user.map;
    user.coins = req.user.coins;
    user.supplies = req.user.supplies;
    user.army = req.user.army;
    user.desert = req.user.desert

    if(user.map[tileNr] === 0 && buildNr === 1 && user.coins >= 500 && user.supplies[0] > user.army[0]){
        try{
            user.coins -= 500;
            
            const newArmy = user.army.slice();
            newArmy[0] += 10;
            user.army = newArmy;

            const newMap = user.map.slice();
            newMap[tileNr] = buildNr;
            user.map = newMap;

            await user.save();
            res.redirect('/game');
        } catch(err) {
            console.log(err);
            res.redirect('/game/buildings');
        }
    } else if(user.map[tileNr] === -1 && buildNr === 2 && user.coins >= 3000) {
        try{
            user.coins -= 3000;
            
            const newSupplies = user.supplies.slice();
            newSupplies[0] += 20;
            user.supplies = newSupplies;

            const newMap = user.map.slice();
            newMap[tileNr] = buildNr;
            user.map = newMap;

            await user.save();
            res.redirect('/game');
        } catch(err) {
            console.log(err);
            res.redirect('/game/buildings');
        }
    } else if(user.map[tileNr] === -2 && buildNr === 3 && user.coins >= 20000){
        try{
            user.coins -= 20000;

            const newArmy = user.army.slice();
            newArmy[1] += 300;
            user.army = newArmy;

            const newMap = user.map.slice();
            newMap[tileNr] = buildNr;
            user.map = newMap;

            await user.save();
            res.redirect('/game');
        } catch(err) {
            console.log(err);
            res.redirect('/game/buildings');
        }
    } else{
        res.render('errorSite');
    }
});
/*----------------------
COSTUM FUNCTIONS
----------------------*/
function saveQuestAndRedirect(path){
    return async (req, res) => {
        let quest = req.quest;
        quest.title = req.body.title;
        quest.description = req.body.description;
        quest.markdown = req.body.markdown;
        quest.solutions = req.body.solutions;
        quest.requiredLvl = parseInt(req.body.requiredLvl);
    
        try{
            quest = await quest.save();
            res.redirect(`/game/quests/${quest.slug}`);
        } catch(err) {
            console.log(err); 
            res.render(`${path}`, {quest: quest}); 
        }
    }  
}

module.exports = router;