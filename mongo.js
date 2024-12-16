const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hugopmempleo:${password}@cluster0.u24mb.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person.name, person.number))
    // Debemos cerrar la conexión con la base de datos al final de la función callback.
    // Si no, al ser una operación asíncrona, cerrará la conexión antes de que termine.
    mongoose.connection.close()
  })
} else {
  const person = new Person({ name: process.argv[3], number: process.argv[4] })

  person.save().then((result) => {
    console.log('added', result.name, 'number', result.number, 'to phonebook')
    mongoose.connection.close()
  })
}
