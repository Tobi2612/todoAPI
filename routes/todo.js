const express = require('express');
const router = express.Router();
const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todo');
const Todo = require('../models/Todo')
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth')

router
    .route('/')
    .get(protect, advancedResults(Todo), getTodos)
    .post(protect, createTodo)

router
    .route('/:id')
    .get(protect, getTodo)
    .put(protect, updateTodo)
    .delete(protect, deleteTodo)

module.exports = router