
//get one project for a user
//add a project
//update a project
//delete a project

//use this when you add middleware
// const router= require("express")
const router = require('express').Router();
const {User, Project, Task} = require('../models')

//move to home routes (maybe rename to /dashboard/:userId)
//find all projects and tasks for a user (good for dashboard homepage widgets)


//add a project => adds project to database, updates owner as the current user, adds project to user, and add user to collaborator

//find one project for a user 
// router.get()

module.exports = router;