const { QueueClient } = require('@azure/storage-queue');
const { TableClient } = require('@azure/data-tables');

function getConnString() {
  // Use the default Functions storage connection unless overridden.
  return process.env.AzureWebJobsStorage;
}

function queueClient(queueName) {
  return new QueueClient(getConnString(), queueName);
}

function tableClient(tableName) {
  return TableClient.fromConnectionString(getConnString(), tableName);
}

module.exports = { queueClient, tableClient };
