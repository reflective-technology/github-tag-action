import * as core from '@actions/core';
import { prerelease, rcompare, valid } from 'semver';
// @ts-ignore
const DEFAULT_RELEASE_TYPES = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease',
];
import { compareCommits, listTags } from './github.js';
import { defaultChangelogRules } from './defaults.js';
export async function getValidTags(prefixRegex, shouldFetchAllTags) {
    const tags = await listTags(shouldFetchAllTags);
    const invalidTags = tags.filter((tag) => !prefixRegex.test(tag.name) || !valid(tag.name.replace(prefixRegex, '')));
    invalidTags.forEach((name) => core.debug(`Found Invalid Tag: ${name}.`));
    const validTags = tags
        .filter((tag) => prefixRegex.test(tag.name) && valid(tag.name.replace(prefixRegex, '')))
        .sort((a, b) => rcompare(a.name.replace(prefixRegex, ''), b.name.replace(prefixRegex, '')));
    validTags.forEach((tag) => core.debug(`Found Valid Tag: ${tag.name}.`));
    return validTags;
}
export async function getCommits(baseRef, headRef) {
    const commits = await compareCommits(baseRef, headRef);
    return commits
        .filter((commit) => !!commit.commit.message)
        .map((commit) => ({
        message: commit.commit.message,
        hash: commit.sha,
    }));
}
export function getBranchFromRef(ref) {
    return ref.replace('refs/heads/', '');
}
export function isPr(ref) {
    return ref.includes('refs/pull/');
}
export function getLatestTag(tags, prefixRegex, tagPrefix) {
    return (tags.find((tag) => prefixRegex.test(tag.name) &&
        !prerelease(tag.name.replace(prefixRegex, ''))) || {
        name: `${tagPrefix}0.0.0`,
        commit: {
            sha: 'HEAD',
        },
    });
}
export function getLatestPrereleaseTag(tags, identifier, prefixRegex) {
    return tags
        .filter((tag) => prerelease(tag.name.replace(prefixRegex, '')))
        .find((tag) => tag.name.replace(prefixRegex, '').match(identifier));
}
export function mapCustomReleaseRules(customReleaseTypes) {
    const releaseRuleSeparator = ',';
    const releaseTypeSeparator = ':';
    return customReleaseTypes
        .split(releaseRuleSeparator)
        .filter((customReleaseRule) => {
        const parts = customReleaseRule.split(releaseTypeSeparator);
        if (parts.length < 2) {
            core.warning(`${customReleaseRule} is not a valid custom release definition.`);
            return false;
        }
        const defaultRule = defaultChangelogRules[parts[0].toLowerCase()];
        if (customReleaseRule.length !== 3) {
            core.debug(`${customReleaseRule} doesn't mention the section for the changelog.`);
            core.debug(defaultRule
                ? `Default section (${defaultRule.section}) will be used instead.`
                : "The commits matching this rule won't be included in the changelog.");
        }
        if (!DEFAULT_RELEASE_TYPES.includes(parts[1])) {
            core.warning(`${parts[1]} is not a valid release type.`);
            return false;
        }
        return true;
    })
        .map((customReleaseRule) => {
        const [type, release, section] = customReleaseRule.split(releaseTypeSeparator);
        const defaultRule = defaultChangelogRules[type.toLowerCase()];
        return {
            type,
            release,
            section: section || defaultRule?.section,
        };
    });
}
export function mergeWithDefaultChangelogRules(mappedReleaseRules = []) {
    const mergedRules = mappedReleaseRules.reduce((acc, curr) => ({
        ...acc,
        [curr.type]: curr,
    }), { ...defaultChangelogRules });
    return Object.values(mergedRules).filter((rule) => !!rule.section);
}
