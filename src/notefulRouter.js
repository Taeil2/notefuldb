const express = require('express');
const notefulRouter = express.Router();
const notefulService = require('./noteful-service');
const xss = require('xss');

notefulRouter.get('/notes',(req,res,next)=>{
  const knexInstance = req.app.get('db');
  notefulService.getAllNotes(knexInstance)
    .then(notes=>{res.json(notes);})
    .catch(next);
});
notefulRouter.get('/folders',(req,res,next)=>{
  const knexInstance = req.app.get('db');
  notefulService.getAllFolders(knexInstance)
    .then(folders=>{res.json(folders);})
    .catch(next);
});
notefulRouter.post('/notes',(req,res,next)=>{
  const knexInstance=req.app.get('db');
  const {name,content,created,folderid}=req.body;
  const newNote={name,content,created,folderid};
  notefulService.insertNote(knexInstance,newNote)
    .then(note=>res.status(201).location(`/folders/${note.folderid}`).json({
      id: note.id,
      name: xss(note.name),
      content: xss(note.content),
      created: note.created,
      folderid:note.folderid
    }))
    .catch(next);
});

notefulRouter.post('/folders',(req,res,next)=>{
  const knexInstance=req.app.get('db');
  const {name} = req.body;
  const newFolder = {name};
  notefulService.insertFolder(knexInstance,newFolder)
    .then(folder=>res.status(201).location(`/folder/${folder.id}`).json({
      id: folder.id,
      name: xss(folder.name)
    }))
    .catch(next);
});

notefulRouter.delete('/notes/:noteid',(req,res,next)=>{
  const knexInstance=req.app.get('db');
  notefulService.deleteNote(knexInstance,req.params.noteid)
    .then(()=>res.status(204).end())
    .catch(next);
});

//error in the function above, unsure of source

module.exports = notefulRouter;