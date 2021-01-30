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

router.put('/updateLvl', async (req, res) => {
    let user = req.user;
    user.level = req.user.level;
    user.coins = req.user.coins;

    try{
        user.coins += rewardCoinsDependingOnLvl(req.user.level);
        user.level++;
        await user.save();
        res.redirect('/game');
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
    res.render('questsShow', { quests: quests, level: userLevel});
});

//get new Quest page
router.get('/quests/new', (req, res) => {
    res.render('questsNew', { quest: new Quest() });
});

//get edit quest page
router.get('/quests/edit/:id', async (req, res) => {
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
    if(quest == null){
        res.redirect('/game');
    }
    res.render('singleQuest', { quest: quest, level: userLevel });
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
COSTUM FUNCTIONS
----------------------*/
function saveQuestAndRedirect(path){
    return async (req, res) => {
        let quest = req.quest;
        quest.title = req.body.title;
        quest.description = req.body.description;
        quest.markdown = req.body.markdown;
    
        try{
            quest = await quest.save();
            res.redirect(`/game/quests/${quest.slug}`);
        } catch(err) {
            console.log(err); 
            res.render(`${path}`, {quest: quest}); 
        }
    }  
}

function rewardCoinsDependingOnLvl(userLvl) {
    let coins;

    if(userLvl < 10){
        coins = 100;
    } else if(userLvl >= 10 && userLvl < 20) {
        coins = 200;
    } else if(userLvl >= 20 && userLvl < 30) {
        coins = 300;
    } else if(userLvl >= 30 && userLvl < 40) {
        coins = 400;
    } else if(userLvl >= 40 && userLvl < 50) {
        coins = 500;
    } else if(userLvl >= 50) {
        coins = 600;
    }

    return coins;
}

module.exports = router;