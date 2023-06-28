const express = require("express");
const morgan = require('morgan')
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get("/api/persons", (req,res) => {
    res.send(data);
})

app.get("/api/info", (req, res) => {
    res.write(`<p>The phonebook has info for ${data.length} people</p>`);
    res.write(`<p>${Date()}</p>`);
    res.send();
})

app.get("/api/persons/:id", (req, res) => {
    const personID = Number(req.params.id);
    const person = data.find(person => person.id === personID)
    if (person) {
        res.send(person)
    } else {
        res.status(404).json({ 
            error: 'This person does not exist' 
          })
    }

})

app.post("/api/persons", (req, res) => {

    const name = req.body.name
    const number = req.body.number
    const id = generateID()

    const newPerson = {
        "id": id,
        "name": name,
        "number": number
    }

    if (!name || !number) {
        res.status(400).json({ error: 'name and number cannot be empty' }).end()
    } else if (data.find(person => person.name === name)) {
        res.status(400).json({ error: 'name must be unique' }).end()
    } else {
        data.push(newPerson);
        res.status(200).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const personID = Number(req.params.id);
    data = data.filter(person => person.id !== personID);
    res.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

const generateID = () => {
    return Math.floor(Math.random()*100000)
}