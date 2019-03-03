module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1/freemarriage',
  superSecret : 'testRajnishScreteKey',
  ENCRYPTION_KEY : 'freemarriagelearn2earnbyrajnish',
  historyLimit : 30,
  uploadImageType: 'uploadimage',
  uploadAlbumType: 'uploadalbum',
  uploadProfilePicType: 'uploadprofilepic',
  uploadCoverPicType: 'uploadcoverpic',
  uploadStatusType: 'uploadstatus'
   
};