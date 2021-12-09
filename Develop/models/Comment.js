const { Model } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {};

Comment.init({},{sequelize});

module.exports = Comment;