require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 5000
const db = require('./db')
const models = require('./models/models')
const router = require('./routes/index')
const app = express()
const path = require('path')
const cors = require('cors')
const ErrorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));


app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'uploads')))
app.use(fileUpload({}))
app.use('/api', router)


app.use(ErrorHandlingMiddleware)
const start = async () => {
    try {
        await db.authenticate()
        await db.sync({alter: true})
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch(e) {
        console.log(e)
    }
    
}

start()