const express = require('express');
const app = express();
const fs  = require('fs');
const port = 3000;

app.use(express.json()) // read json body 

const DATA = './db.json';

// READ DATA ;
function readData (){
    const jsonData = fs.readFileSync(DATA);
    return JSON.parse(jsonData);
}

// write to data 
function writeToData (data){
    fs.writeFileSync(DATA ,JSON.stringify(data ,null ,2));
}

// get data todos
app.get('/', (req,res)=>{
    const todos = readData();
    res.status(200).json({
  message: "get all todos successfully ✅",
  data: todos
});
})

// add todo to db.json
app.post('/todos', (req , res)=>{
    const {title} = req.body
    if (!title) return res.status(400).json({ error: "Title is required" });
    const todos = readData();
    const newTodo = {
        id:todos.length ? todos[todos.length - 1].id +1 : 1,
        title
    }
    todos.push(newTodo);
    writeToData(todos);
    res.status(201).json({
  message: "add todo success ✅",
  data: newTodo
});
})

// put todos update
app.put('/todos/:id',(req, res)=>{
    const {id} = req.params;
    const {title} = req.body;
    if(!title) return res.status(400).json({error:"Title is required ❌"});
    const todos = readData();
    const todo = todos.find(t => t.id === parseInt(id));
    if(!todo) return res.status(400).json({error:"todo is not found ❌"});

    todo.title = title !== undefined ? title : todo.title;
    writeToData(todos);
    return res.status(200).json({
        message:"todo is update ✅",
        data:todo
    })
})

// delete todos
app.delete('/todos/:id',(req,res)=>{
    const {id} = req.params;
    if(!id) return res.status(400).json({error:"id is not found ❌"});
    let todos = readData();
    const existTodo = todos.find(todo=> todo.id == parseInt(id));
    if(!existTodo) return res.status(400).json({error:"todo is not found ❌"});

    todos = todos.filter(todo=> todo.id !== parseInt(id));
    writeToData(todos);
    res.status(200).json({
        message:"Delete todo by id is success ✅"
    })

})

// start server 
app.listen(port ,()=>{
    console.log(`server running on port  ${port}`);
})