'use strict';

const tableExists = require('../../modules/table.exists');

exports.seed = async function(db) {

  const exists = await tableExists('receptions');

  if (!exists) {

    return;
  }

  await db.raw(`
INSERT INTO receptions (
  doctor_id,
  date,
  start_time,
  end_time
) VALUES (
  1,
  '2020-10-30',
  '08:00:00',
  '10:00:00'
), (
  1,
  '2020-11-01',
  '11:00:00',
  '13:00:00'
), (
  1,
  '2020-11-02',
  '15:00:00',
  '18:00:00'
)`);
};

