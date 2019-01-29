module.exports = ({ log: parentLog }) => {
  const log = parentLog.create('sendNotificationEmail');

  return async id => {
    log.info(`Running task (${id}) ...`);
  };
};
