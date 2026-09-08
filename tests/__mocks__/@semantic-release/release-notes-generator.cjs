'use strict';

async function generateNotes(pluginConfig, context) {
  const commits = context.commits || [];
  const notes = commits.map((c) => '* ' + c.message).join('\n');
  return notes || 'No changes';
}

module.exports = { generateNotes };
