const express = require('express');
const routes = express.Router();
const {getCategories,getSingleCategory,addNewCategory,addNewQuestions} = require('../controllers/category_controllers')
routes.get("/",getCategories);
routes.get("/:name",getSingleCategory);
routes.post("/",addNewCategory);
routes.post("/question",addNewQuestions);

module.exports = routes;

