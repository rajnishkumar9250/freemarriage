exports = module.exports = function(app, mongoose) {
  require('./schema/user')(app, mongoose);
  require('./schema/userpreference')(app, mongoose);
  require('./schema/document')(app, mongoose);
  require('./schema/post')(app, mongoose);
  require('./schema/history')(app, mongoose);
  require('./schema/follower')(app, mongoose);
};