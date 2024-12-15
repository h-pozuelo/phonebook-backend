require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/persons");

app.use(cors());

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  } else {
    next(error);
  }
};

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.status(200).send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.status(200).send(
      `<p>Phonebook has info for ${persons.length} people</p>
         <p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.status(200).json(persons));
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => response.status(200).json(person));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  let id = 0;

  do {
    id = getRandomIntInclusive(1, 100);
  } while (persons.find((person) => person.id === id));

  return id;
};

const getRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number)
    return response.status(400).json({ error: "name and number are required" });

  // if (
  //   persons.find(
  //     (person) => person.name.toLowerCase() === body.name.toLowerCase()
  //   )
  // )
  //   return response.status(400).json({ error: "name must be unique" });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => response.status(200).json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.status(200).json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
