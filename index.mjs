import core from '@actions/core'
import getDeploymentUrl from './vercel.mjs'

async function run() {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    //const githubRef = process.env.GITHUB_REF
    const githubProject = process.env.GITHUB_REPOSITORY
    //const githubBranch = githubRef.replace(/\D/g,'')
    const githubCommitSHA = process.env.GITHUB_SHA
    const githubRefName = process.env.GITHUB_REF_NAME
    const githubRepo = githubProject.split('/')[1]
    const teamId = core.getInput('vercel_team_id')
    const projectId = core.getInput('vercel_project_id')

    core.info(`Retrievingg deployment preview for ${teamId}/${projectId} ...`)
    core.info(
      `Retrievingg deployment preview for commit sha: ${githubCommitSHA} ...`
    )
    core.info(
      `Retrievingg deployment preview for ref name: ${githubRefName} ...`
    )
    const { url, state } = await getDeploymentUrl(
      vercelToken,
      githubRepo,
      githubCommitSHA,
      teamId,
      projectId
    )

    core.setOutput('preview_url', url)
    core.setOutput('deployment_state', state)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
