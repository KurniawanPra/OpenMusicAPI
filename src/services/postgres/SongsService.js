const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows[0].id) {
        throw new InvariantError('Gagal menambahkan lagu');
      }
      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        throw new InvariantError('Album ID tidak ditemukan');
      }
      throw error;
    }
  }

  async getSongs(params = {}) {
    const { title, performer } = params;
    let query = 'SELECT id, title, performer FROM songs';
    const values = [];
    
    if (title || performer) {
      const filters = [];
      let valueIndex = 1;
      
      if (title) {
        filters.push(`title ILIKE $${valueIndex}`);
        values.push(`%${title}%`);
        valueIndex++;
      }
      
      if (performer) {
        filters.push(`performer ILIKE $${valueIndex}`);
        values.push(`%${performer}%`);
      }
      
      query += ` WHERE ${filters.join(' AND ')}`;
    }

    const result = await this._pool.query(query, values);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
      }
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        throw new InvariantError('Album ID tidak ditemukan');
      }
      throw error;
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;