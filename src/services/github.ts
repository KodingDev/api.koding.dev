import { Octokit } from '@octokit/rest';
import { gitHubConfig } from '../config';

export const github = new Octokit({
    auth: gitHubConfig.token,
});
