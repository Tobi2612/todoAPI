const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//load env vars
dotenv.config({ path: './config/.env' });


//db connection
connectDB();

//route files
const todos = require('./routes/todo');
const auth = require('./routes/auth');

const app = express();

//bodyparser
app.use(express.json());


//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent XSS attacks
app.use(xss())

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 100
})

app.use(limiter)

//prevent hpp param pollution
app.use(hpp())

//Enable CORS
app.use(cors())


//mount routers
app.use('/api/v1/todos', todos);
app.use('/api/v1/auth', auth);


// route to api documentation
app.get("/", (req, res) => {

    res.status(301).redirect("https://documenter.getpostman.com/view/")

})


app.use(errorHandler);
const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));

//handle promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));
})