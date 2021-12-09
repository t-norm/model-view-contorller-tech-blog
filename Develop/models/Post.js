const { Model } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {};

Post.init({},{sequelize});

module.exports = Post;