const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const app = express()

//note: set cors up to use frontend domains when deploying the api
var corsOptions = {
  origin: 'http://localhost:8081',
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const db = process.env.MONGO_URI

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

// routes
app.get('/', (req, res) => {
  res.json({ message: 'BugBase API' })
})

//these are auth routes
app.use('/api/auth', require('./app/routes/auth'))
//these are routes that you send data from
app.use('/api', require('./app/routes/api'))

//start server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
