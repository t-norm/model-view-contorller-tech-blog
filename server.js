const express = require ('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const path = require('path');

const PORT = process.env.PORT || 3001
const app = express();

const SequelizeStore = require('connect-session-sequelize')(session.Store);
let sess;
if (process.env.JAWSDB_SC) {
    sess = {
        secret: process.env.JAWSDB_SC,
        cookie: {},
        resave: false,
        saveUninitialized: true,
        store: new SequelizeStore({ db: sequelize })
    }
} else {
    sess = {
        secret: 'super secret secret',
        cookie: {},
        resave: false,
        saveUninitialized: true,
        store: new SequelizeStore({ db: sequelize })
    }
}
app.use(session(sess));

const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});