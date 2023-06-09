const database = require("../config/config");

const getCategories = (req, res) => {
    database.query("SELECT * FROM category", (err, result) => {
        if (err) throw err;
        res.status(201).json({ status: "ok", result });
    });
};

const getSingleCategory = (req, res) => {
    const { name } = req.params;
    database.query("SELECT * FROM category where name = ?", [name], (err, result) => {
        if (err) throw err;
        res.status(201).send({ status: "ok", result });
    });
};

const addNewCategory = (req, res) => {
    const { name } = req.body;
    database.query("SELECT * FROM category WHERE name = ?", [name], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            return res.status(409).send('Category already exists ' + result[0].ids + result[0].name);
        } else {
            database.query("INSERT INTO category (name) VALUES (?)", [name], (err, result) => {
                if (err) throw err;
                res.status(201).send({ status: "ok", "result": result.insertId });
            });
        }
    });
};


/// check From Here

const addNewQuestions = (req, res) => {
    const { categoryName, subjectName, topicName, questionText } = req.body;
    database.query("SELECT * FROM category WHERE name = ?", [categoryName], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            addSubject(subjectName, topicName, questionText, result[0].ids);
        } else {
            database.query("INSERT INTO category (name) VALUES (?)", [categoryName], (err, result) => {
                if (err) throw err;
                addSubject(subjectName, topicName, questionText, result.insertId);
            });
        }
        res.status(201).json({
            categoryName: categoryName,
            subjectName: subjectName,
            topicName: topicName,
            questionText: { questionText }
        });
    });

}

const addSubject = (subjectName, topicName, questionText, categoryId) => {
    database.query("SELECT * FROM subject where name = ? AND categoryId = ?", [subjectName,categoryId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            addTopic(topicName, questionText, result[0].id);
        } else {
            database.query("INSERT INTO subject (name,categoryId) VALUES (?,?)", [subjectName, categoryId], (err, result) => {
                if (err) throw err;
                addTopic(topicName, questionText, result.insertId);
            })
        }
    });
}

const addTopic = (topicName, questionText, subjectId) => {
    database.query("SELECT * FROM topic where name = ? AND subjectId = ?", [topicName,subjectId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            addQuestion(questionText, result[0].id);
        } else {
            database.query("INSERT INTO topic (name,subjectId) VALUES (?,?)", [topicName, subjectId], (err, result) => {
                if (err) throw err;
                addQuestion(questionText, result.insertId);
            })
        }
    })
}

const addQuestion = (question, topicId) => {
    database.query("SELECT * FROM question where name = ? AND topicId = ?", [question,topicId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            console.log("Success!");
        } else {
            database.query("INSERT INTO question (name,topicId) VALUES (?,?)", [question, topicId], (err, result) => {
                if (err) throw err;
                console.log("Success!");
            })
        }
    })
}

const getQuestions = (req, res) => {
    const mcqsMap = {};
    database.query("SELECT * FROM category", (err, result) => {
        if (err) throw err;
        mcqsMap.category = result[0].name;
        database.query("SELECT * FROM subject where categoryId = ?", [result[0].ids], (err, result) => {
            if (err) throw err;
            mcqsMap.subject = result[0].name;
            database.query("SELECT * FROM topic where subjectId = ?", [result[0].id], (err, result) => {
                if (err) throw err;
                console.log(result);
                mcqsMap.topic = result[0].name;
                console.log(mcqsMap);
                database.query("SELECT * FROM question WHERE topicId = ?", [result[0].id], (err, result) => {
                    if (err) throw err;
                    mcqsMap.question = { questionText: result[0].name };
                    console.log(mcqsMap);
                    res.status(201).json({ "data": mcqsMap });
                });
            });
        })
    });
}

const getOnCategoryQuestions = (req, res) => {
    const { name } = req.params;
    const mcqsMap = {};
    database.query("SELECT * FROM category where name = ?", [name], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            mcqsMap.category = result[0].name;
            database.query("SELECT * FROM subject where categoryId = ?", [result[0].ids], (err, result) => {
                if (err) throw err;
                mcqsMap.subject = [];
                for (let i = 0; i < result.length; i++) {
                    database.query("SELECT * FROM topic where subjectId = ?", [result[i].id], (err, result) => {
                        if (err) throw err;
                        console.log(result);
                        const index = mcqsMap.subject.indexOf(result[i].name);
                        mcqsMap.topic = result[0].name;
                        console.log(mcqsMap);
                        database.query("SELECT * FROM question WHERE topicId = ?", [result[0].id], (err, result) => {
                            if (err) throw err;
                            mcqsMap.question = { questionText: result[0].name };
                            console.log(mcqsMap);
                            res.status(201).json({ "data": mcqsMap });
                        });
                    });
                    mcqsMap.subject.push({
                        subjectName: result[i].name,
                    });
                }
                
            })
        }else{
            res.status(404).send("Category Not Found");
        }
    });
}


const deleteACategory = (req,res)=>{
    const {id} = req.params;
    database.query("DELETE FROM category WHERE ids = ?",[id],(err,result)=>{
        if(err) throw err;
        res.status(201).json({"status":"ok",data:result});
    });
}

const deleteASubject = (req,res)=>{
    const {id} = req.params;
    database.query("DELETE FROM subject WHERE id = ?",[id],(err,result)=>{
        if(err) throw err;
        res.status(201).json({"status":"ok",data:result});
    });
}

const deleteATopic = (req,res)=>{
    const {id} = req.params;
    database.query("DELETE FROM topic WHERE id = ?",[id],(err,result)=>{
        if(err) throw err;
        res.status(201).json({"status":"ok",data:result});
    });
}

const deleteAQuestion = (req,res)=>{
    const {id} = req.params;
    database.query("DELETE FROM question WHERE id = ?",[id],(err,result)=>{
        if(err) throw err;
        res.status(201).json({"status":"ok",data:result});
    });
}




module.exports = { 
    getCategories, 
    getSingleCategory, 
    addNewCategory, 
    addNewQuestions, 
    getQuestions , 
    getOnCategoryQuestions,
    deleteACategory,
    deleteASubject,
    deleteATopic,
    deleteAQuestion
};