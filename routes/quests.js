/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');

/*----------------------
ROUTER INIT
----------------------*/
const router = express.Router();

/*----------------------
USER
----------------------*/
const Quest = require('../models/Quest')

/*----------------------
ROUTES
----------------------*/
router.get('/', async (req, res) => {
    const quests = await Quest.find().sort({ requiredLvl: 'desc' });

    res.render('questsShow', { quests: quests});
});

//get new quest page
router.get('/new', (req, res) => {
    res.render('questsNew', { quest: new Quest() });
});

//single quest view
router.get('/:id', async (req, res) => {
    const quest  = await Quest.findById(req.params.id);
    if(quest == null){
        res.redirect('/game');
    }
    res.render('singleQuest', { quest: quest });
});

//new quest
router.post('/', async (req, res) => {
    let quest = new Quest({
        title: req.body.title,
        description: req.body.description,
        task: req.body.task,
        reward: req.body.reward
    });

    try{
        await quest.save();
        res.redirect(`/quests/${quest.id}`);
    } catch(err) {
        console.log(err); 
        res.render('quests/new', {quest: quest}); 
    }
    
});

module.exports = router;