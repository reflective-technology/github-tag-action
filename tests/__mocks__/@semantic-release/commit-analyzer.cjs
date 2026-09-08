'use strict';

async function analyzeCommits(pluginConfig, context) {
  const dominated = { major: 3, minor: 2, patch: 1 };
  const rules = [
    ...(pluginConfig.releaseRules || []),
    { breaking: true, release: 'major' },
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'perf', release: 'patch' },
  ];

  let bump = null;
  for (const commit of context.commits || []) {
    const msg = commit.message || '';
    const isBreaking = msg.includes('BREAKING CHANGE');

    for (const rule of rules) {
      if (rule.breaking && isBreaking) {
        if (!bump || dominated[rule.release] > dominated[bump]) {
          bump = rule.release;
        }
        break;
      }
      if (rule.type && msg.startsWith(rule.type + ':')) {
        if (!bump || dominated[rule.release] > dominated[bump]) {
          bump = rule.release;
        }
        break;
      }
    }
  }

  return bump;
}

module.exports = { analyzeCommits };
