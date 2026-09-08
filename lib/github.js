import { context, getOctokit } from '@actions/github';
import * as core from '@actions/core';
let octokitSingleton;
export function getOctokitSingleton() {
    if (octokitSingleton) {
        return octokitSingleton;
    }
    const githubToken = core.getInput('github_token');
    octokitSingleton = getOctokit(githubToken);
    return octokitSingleton;
}
export async function listTags(shouldFetchAllTags = false, fetchedTags = [], page = 1) {
    const octokit = getOctokitSingleton();
    const tags = await octokit.rest.repos.listTags({
        ...context.repo,
        per_page: 100,
        page,
    });
    if (tags.data.length < 100 || shouldFetchAllTags === false) {
        return [...fetchedTags, ...tags.data];
    }
    return listTags(shouldFetchAllTags, [...fetchedTags, ...tags.data], page + 1);
}
export async function compareCommits(baseRef, headRef) {
    const octokit = getOctokitSingleton();
    core.debug(`Comparing commits (${baseRef}...${headRef})`);
    const commits = await octokit.rest.repos.compareCommits({
        ...context.repo,
        base: baseRef,
        head: headRef,
    });
    return commits.data.commits;
}
export async function createTag(newTag, createAnnotatedTag, GITHUB_SHA) {
    const octokit = getOctokitSingleton();
    let annotatedTag = undefined;
    if (createAnnotatedTag) {
        core.debug(`Creating annotated tag.`);
        annotatedTag = await octokit.rest.git.createTag({
            ...context.repo,
            tag: newTag,
            message: newTag,
            object: GITHUB_SHA,
            type: 'commit',
        });
    }
    core.debug(`Pushing new tag to the repo.`);
    await octokit.rest.git.createRef({
        ...context.repo,
        ref: `refs/tags/${newTag}`,
        sha: annotatedTag ? annotatedTag.data.sha : GITHUB_SHA,
    });
}
