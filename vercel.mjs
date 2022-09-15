import core from '@actions/core'
import axios from 'axios'
import querystring from 'querystring'

const apiUrl = 'https://api.vercel.com'
const deploymentsUrl = '/v5/now/deployments'

export default async function getDeploymentUrl(
  token,
  repo,
  branch,
  teamId,
  projectId
) {
  const query = {
    teamId,
    projectId
  }
  const qs = querystring.stringify(query)

  core.info(`Fetching from: ${apiUrl}${deploymentsUrl}?${qs}`)
  const { data } = await axios.get(`${apiUrl}${deploymentsUrl}?${qs}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!data || !data.deployments || data.deployments.length <= 0) {
    core.error(JSON.stringify(data, null, 2))
    throw new Error('no deployments found')
  }

  core.debug(`Found ${data.deployments.length} deployments`)
  core.debug(`Looking for matching deployments ${repo}/${branch}`)
  const builds = data.deployments.filter((deployment) => {
    return (
      deployment.meta.githubCommitRepo === repo &&
      deployment.meta.githubPrId === branch
    )
  })

  core.debug(`Found ${builds.length} matching builds`)
  if (!builds || builds.length <= 0) {
    core.error(JSON.stringify(builds, null, 2))
    throw new Error('no deployments found')
  }

  const build = builds[0]
  core.info(`Preview URL: https://${build.url} (${build.state})`)
  return {
    url: build.url,
    state: build.state
  }
}
