import * as core from '@actions/core';
import * as github from '@actions/github';

import { Inputs, Outputs } from './constants';

type ClientType = ReturnType<typeof github.getOctokit>;

export async function run() {
  try {
    const token = core.getInput(Inputs.RepoToken, { required: true });
    const branchPrefix = core.getInput(Inputs.BranchPrefix, { required: true });

    const client = github.getOctokit(token);

    const refs = await getRefs(client, branchPrefix);
    const lastest = refs.pop();

    if (!lastest) {
      core.setFailed(`not found branch with prefix ${branchPrefix}`);
    }

    console.log(`lastest: ${lastest}`);
    core.setOutput(Outputs.ReleaseBranch, lastest);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

async function getRefs(client: ClientType, match: string) {
  const iterator = client.paginate.iterator(client.rest.git.listMatchingRefs, {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: ''
  });

  const matchedRefs: string[] = [];

  for await (const { data: refs } of iterator) {
    const target = refs
      .map(ref => ref.ref)
      .filter(ref => ref.startsWith(`refs/heads/${match}`))
      .map(ref => ref.replace('refs/heads/', ''));
    matchedRefs.push(...target);
  }

  matchedRefs.sort();

  return matchedRefs;
}
