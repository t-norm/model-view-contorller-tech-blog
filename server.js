const express = require ('express');
var favicon = require('serve-favicon');
const session = require('express-session');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const path = require('path');
const helper = require('./utils/helper');

const PORT = process.env.PORT || 3001
const app = express();

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: 'super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({ db: sequelize })
};
app.use(session(sess));

const hbs = exphbs.create({ helper });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(require('./controllers'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});