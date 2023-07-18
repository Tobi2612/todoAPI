const path = require('path');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const Todo = require('../models/Todo');


//@desc      get all todos
//@path      GET api/v1/todos
//@access    Private
exports.getTodos = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc      get single todo
//@path      GET api/v1/todo/:id
//@access    Private
exports.getTodo = asyncHandler(async (req, res, next) => {

    const todo = await Todo.findById(req.params.id);

    //make sure user is owner
    if (todo.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorised to make this action`, 401));
    }

    if (!todo) {
        return next(new ErrorResponse(`todo with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({ success: true, data: todo });

})

//@desc      create todos
//@path      POST api/v1/todos
//@access    Private
exports.createTodo = asyncHandler(async (req, res, next) => {
    //add user to req.body
    req.body.user = req.user.id;

    const todo = await Todo.create(req.body);
    res.status(201).json({ success: true, data: todo });

})

//@desc      update todo
//@path      PUT api/v1/todo/:id
//@access    Private
exports.updateTodo = asyncHandler(async (req, res, next) => {

    let todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorResponse(`Todo with id of ${req.params.id} not found`, 404))
    }

    //make sure user is owner
    if (todo.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorised to make this action`, 401));
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: todo });

})

//@desc      delete todo
//@path      DELETE api/v1/todos/:id
//@access    Private
exports.deleteTodo = asyncHandler(async (req, res, next) => {

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorResponse(`Todo with id of ${req.params.id} not found`, 404))
    }

    //make user user is owner
    if (todo.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorised to make this action`, 401))
    }

    await Todo.findOneAndDelete({_id: req.params.id});

    res.status(200).json({ success: true, data: {} })

})
