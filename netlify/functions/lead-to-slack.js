exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Slack webhook is not configured" })
    };
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON payload" })
    };
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const company = clean(body.company);
  const workflow = clean(body.workflow);

  if (!name || !email || !workflow) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Name, email, and workflow are required" })
    };
  }

  const slackPayload = {
    text: `New AgentOps Studio lead from ${name}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "New AgentOps Studio lead"
        }
      },
      section("Name", name),
      section("Email", email),
      section("Phone / WhatsApp", phone || "Not provided"),
      section("Company", company || "Not provided"),
      section("Workflow", workflow)
    ]
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slackPayload)
  });

  if (!response.ok) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Slack rejected the lead notification" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};

function section(label, value) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${label}:*\n${value}`
    }
  };
}

function clean(value) {
  return String(value || "").trim().slice(0, 1800);
}

