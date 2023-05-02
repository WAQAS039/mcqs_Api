const express = require('express');
const routes = express.Router();
const {getCategories,getSingleCategory,addNewCategory,addNewQuestions,getQuestions,getOnCategoryQuestions,deleteACategory,deleteASubject,deleteATopic,deleteAQuestion} = require('../controllers/category_controllers')
/// get all Category
routes.get("/category",getCategories);
/// get one Category
routes.get("/category/:name",getSingleCategory);
/// delete Specific Category
routes.delete("/category/:id",deleteACategory);

/// add newQuestion with Full Detail
routes.post("/addQuestion",addNewQuestions);

routes.get("/all/fullMap",getQuestions);
routes.get("/one/:name",getOnCategoryQuestions);
routes.post("/",addNewCategory);


routes.delete("/subject/:id",deleteASubject);
routes.delete("/topic/:id",deleteATopic);
routes.delete("/question/:id",deleteAQuestion);

module.exports = routes;

