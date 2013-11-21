// User.js
// =======
// Defines the user data model (schema) for use via the API.

// Dependencies
// ------------
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var helpers = require('habitrpg-shared/script/helpers');
var _ = require('lodash');

// Task Schema
// -----------

var TaskSchema = {
  //_id:{type: String,'default': helpers.uuid},
  id: {type: String,'default': helpers.uuid},
  text: String,
  notes: {type: String, 'default': ''},
  tags: {type: Schema.Types.Mixed, 'default': {}}, //{ "4ddf03d9-54bd-41a3-b011-ca1f1d2e9371" : true },
  value: {type: Number, 'default': 0},
  priority: {type: String, 'default': '!'}, //'!!' // FIXME this should be a number or something
  challenge: {
    id: {type: 'String', ref:'Challenge'},
    broken: String, // CHALLENGE_DELETED, TASK_DELETED, UNSUBSCRIBED, CHALLENGE_CLOSED
    winner: String // user.profile.name
    // group: {type: 'Strign', ref: 'Group'} // if we restore this, rename `id` above to `challenge`
  }
};

var HabitSchema = new Schema(
  _.defaults({
    type: {type:String, 'default': 'habit'},
    history: Array, // [{date:Date, value:Number}], // this causes major performance problems
    up: {type: Boolean, 'default': true},
    down: {type: Boolean, 'default': true}
  }, TaskSchema)
  , { _id: false }
);

var DailySchema = new Schema(
  _.defaults({
    type: {type:String, 'default': 'daily'},
    history: Array, // [{date:Date, value:Number}], // this causes major performance problems
    completed: {type: Boolean, 'default': false},
    repeat: {type: Schema.Types.Mixed, 'default': {m:1, t:1, w:1, th:1, f:1, s:1, su:1} },
    streak: {type: Number, 'default': 0}
  }, TaskSchema)
  , { _id: false }
)

var TodoSchema = new Schema(
  _.defaults({
    type: {type:String, 'default': 'todo'},
    completed: {type: Boolean, 'default': false},
    date: String // due date for todos // FIXME we're getting parse errors, people have stored as "today" and "3/13". Need to run a migration & put this back to type: Date
  }, TaskSchema)
  , { _id: false }
);

var RewardSchema = new Schema(
  _.defaults({
    type: {type:String, 'default': 'reward'}
  }, TaskSchema)
  , { _id: false }
);

/**
 * Workaround for bug when _id & id were out of sync, we can remove this after challenges has been running for a while
 */
//_.each([HabitSchema, DailySchema, TodoSchema, RewardSchema], function(schema){
//  schema.post('init', function(doc){
//    if (!doc.id && doc._id) doc.id = doc._id;
//  })
//})

module.exports.TaskSchema = TaskSchema;
module.exports.HabitSchema = HabitSchema;
module.exports.DailySchema = DailySchema;
module.exports.TodoSchema = TodoSchema;
module.exports.RewardSchema = RewardSchema;
