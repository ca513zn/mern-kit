const path = require('path');
const mongoose = require('lib/mongoose');
const config = require('config/config');
const logger = require('lib/winston');

if (!config.files.scripts || config.files.scripts.length === 0) {
  logger.info('No scripts have been configured');
  process.exit(0);
}

mongoose.connect()
.then(() => {
  logger.info('Loading all database scripts');
  // Load all the scripts and drop those collections
  const scripts = config.files.scripts.map(file => require(path.resolve(file)));
  const promises = scripts.filter(script => script.dropCollection).map(script => script.dropCollection());

  return Promise.all(promises);
}).then(() => {
  logger.info('Successfully dropped all collections');
  process.exit(0);
}).catch(err => {
  logger.error('Unable to drop collections', err);
  process.exit(err);
});
