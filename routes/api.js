/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

    app.route('/api/books')
        .get(function (req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
            MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {
                db.collection('Books').find().toArray(function (err, results) {
                    if (err) {
                        console.log(err);
                        res.status(500).json("error retrieving books");
                    } else {
                        res.json(results);
                    }
                });
            });
        })

        .post(function (req, res) {
            var title = req.body.title;
            //response will contain new book object including atleast _id and title
            if (title === undefined) {
                res.status(500).json("title not provided");
            } else {
                MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {
                    if (err) {
                        console.log(err);
                        res.status(500).json("failed to insert book ", title);
                    } else {
                        db.collection('Books').insertOne({ title }, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).json("failed to insert book ", title);
                            } else {
                                res.json(result);
                            }
                        });
                    }
                });
            }
        })

        .delete(function (req, res) {
            //if successful response will be 'complete delete successful'
            MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {
                if (err) {
                    console.log(err);
                    res.status(500).json("complete delete failed");
                } else {
                    db.collection('Books').deleteMany({}, function (err, results) {
                        if (err) {
                            console.log(err);
                            res.status(500).json("complete delete failed");
                        } else {
                            res.json("complete delete successful");
                        }
                    });
                }
            });
        });



    app.route('/api/books/:id')
        .get(function (req, res) {
            var bookid = req.params.id;
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            if (bookid === undefined) {
                res.status(500).json("id not provided");
            } else {
                MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {
                    if (err) {
                        console.log(err);
                        res.status(500).json("error connecting to the database");
                    } else {
                        db.collection('Books').findOne({ _id: bookid }, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).json('could not find book with bookid ', bookid);
                            } else {
                                if (Object.keys(result).length === 0) {
                                    res.json('book not found');
                                } else {
                                    res.json(result);
                                }
                            }
                        });
                    }
                });
            }
        })

        .post(function (req, res) {
            var bookid = req.params.id;
            var comment = req.body.comment;
            //json res format same as .get
            if (bookid === undefined) {
                res.status(500).json("no id provided");
            } else {
                let newBook = { _id: bookid, comment: comment || '' };
                MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {
                    if (err) {
                        console.log(err);
                        res.status(500).json("error adding book with bookid ", bookid);
                    } else {
                        db.collection('Books').insertOne(newBook, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).json("error adding book with bookid ", bookid);
                            } else {
                                res.json(result);
                            }
                        });
                    }
                });
            }
        })

        .delete(function (req, res) {
            var bookid = req.params.id;
            //if successful response will be 'delete successful'
            if (bookid === undefined) {
                res.status(500).json("delete failed");
            } else {
                MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {
                    if (err) {
                        console.log(err);
                        res.status(500).json('delete failed');
                    } else {
                        db.collection('Books').deleteOne({ _id: bookid }, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).json('delete failed');
                            } else {
                                res.json('delete successful');
                            }
                        });
                    }
                });
            }
        });

};
