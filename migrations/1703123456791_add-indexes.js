/* eslint-disable camelcase */

exports.up = (pgm) => {
  // Add index for songs search by title
  pgm.createIndex('songs', 'title');
  
  // Add index for songs search by performer
  pgm.createIndex('songs', 'performer');
  
  // Add index for album_id foreign key
  pgm.createIndex('songs', 'album_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('songs', 'title');
  pgm.dropIndex('songs', 'performer');
  pgm.dropIndex('songs', 'album_id');
};