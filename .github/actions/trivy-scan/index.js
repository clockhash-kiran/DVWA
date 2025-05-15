const core = require('@actions/core');

async function run() {
  try {
    const api_url = core.getInput('api_url', { required: true });
    const target_url = core.getInput('target_url', { required: true });
    const user_id = core.getInput('user_id', { required: true });
    const project_id = core.getInput('project_id', { required: true });

    const payload = {
      target_url,
      user_id,
      project_id
    };

    const response = await fetch(api_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Scan API request failed with status ${response.status}`);
    }

    const result = await response.json();

    core.info(`Scan API response: ${JSON.stringify(result)}`);

    if (result.status === "FAILED") {
      core.setFailed('Scan failed due to high/critical vulnerabilities.');
    } else {
      core.info('Scan succeeded.');
    }

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
