'use strict';

const tableExists = require('../../modules/table.exists');

exports.seed = async function(db) {

  const exists = await tableExists('users');

  if (!exists) {

    return;
  }

  await db.raw(`
INSERT INTO users (
  role_id,
  firstname,
  middlename,
  lastname,
  gender,
  age,
  phone,
  record_status
) VALUES (
  1,
  'Филипп',
  'Филиппович',
  'Преображенский',
  'male',
  65,
  '+79001112233',
  'active'
), (
  2,
  'Иван',
  'Иванович',
  'Иванов',
  'male',
  40,
  '+79004445566',
  'active'
), (
  2,
  'Петр',
  'Петрович',
  'Петров',
  'male',
  50,
  '+79007778899',
  'active'
), (
  2,
  'Сидор',
  'Сидорович',
  'Сидоров',
  'male',
  60,
  '+79001002030',
  'active'
)`);
};
