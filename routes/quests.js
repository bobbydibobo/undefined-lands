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
router.get('/:slug', async (req, res) => {
    const quest  = await Quest.findOne({ slug: req.params.slug });
    if(quest == null){
        res.redirect('/game');
    }
    res.render('singleQuest', { quest: quest });
});

//get edit quest page
router.get('/edit/:id', async (req, res) => {
    const quest = await Quest.findById(req.params.id)
    res.render('questsEdit', { quest: quest });
});

//new quest
router.post('/', async (req, res, next) => {
    req.quest = new Quest();
    next();
}, saveQuestAndRedirect());

//edit quest
router.put('/:id', async (req, res, next) => {
    req.quest = await Quest();
    next();
}, saveQuestAndRedirect());

//delete quest
router.delete('/:id', async(req, res) => {
    await Quest.findByIdAndDelete(req.params.id);
    res.redirect('/quests');
});

//costum function
function saveQuestAndRedirect(){
    return async (req, res) => {
        let quest = req.quest
        quest.title = req.body.title
        quest.description = req.body.description
        quest.markdown = req.body.markdown
    
        try{
            await quest.save();
            res.redirect(`/quests/${quest.slug}`);
        } catch(err) {
            console.log(err); 
            res.render(`questsNew`, {quest: quest}); 
        }
    }  
}

module.exports = router;