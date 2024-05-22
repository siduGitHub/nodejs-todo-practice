const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Serer Running at http://localhost:3000/'),
    )
  } catch (e) {
    console.log(`DB Erro${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// Api 1//

app.get('/todos/', async (request, response) => {
  const status = request.query
  const {Status} = status
  console.log(Status)
  const todoQuery = `
    SELECT * FROM todo WHERE status LIKE "%${Status}%";
  `
  const dbResponse = await db.all(todoQuery)
  response.send(dbResponse)
})

// api 2//

app.get('/todos/?priority=HIGH', async (request, response) => {
  const {Priority, search_q = ''} = request.query
  const todoQuery = `
    SELECT * FROM todo WHERE priority LIKE "%${search_q}%" AND "%${Priority}%";
  `
  console.log(Priority)
  const dbResponse = await db.all(todoQuery)
  response.send(dbResponse)
})

// api 3 //

/*app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const postQuery = `
    INSERT INTO todo (id,todo,priority,status)
    VALUES(${id},"${todo}","${priority}","${status}");
  `
  const dbResponse = await db.run(postQuery)
  response.send('Todo Successfully Added')
})*/

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body //Destructuring id column
  const insertTodo = `
        INSERT INTO todo (id, todo, priority, status)
        VALUES (${id},'${todo}','${priority}','${status}');` //Updated the id column inside the SQL Query
  await db.run(insertTodo)
  response.send('Todo Successfully Added')
})

// api 4//
//status update//

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {status} = request.body
  const updateStstus = `
    UPDATE todo SET
      status="${status}"
    WHERE id=${todoId};
  `
  await db.run(updateStstus)
  response.send('Status Updated')
})

//priority update//

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {priority} = request.body
  const updatePriority = `
    UPDATE todo SET
      priority="${priority}"
    WHERE id=${todoId};
  `
  await db.run(updatePriority)
  response.send('Priority Updated')
})

//Api 5//

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteQuery = `
    DELETE FROM todo 
    WHERE id=${todoId};
  `
  await db.run(deleteQuery)
  response.send('Succesfully Deleted')
})
