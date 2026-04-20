# Deploy AgentOps Studio

## Recommended Hosting

Use Netlify for this version because the site is static, and the lead form uses a Netlify Function to forward submissions to Slack without exposing the Slack webhook in browser code.

## Files

- `index.html` - website
- `styles.css` - UI styles
- `script.js` - animations and form submission
- `netlify.toml` - Netlify deploy configuration
- `netlify/functions/lead-to-slack.js` - secure Slack forwarding endpoint

## Slack Setup

1. In Slack, create an Incoming Webhook for the channel where leads should arrive.
2. Copy the webhook URL.
3. In Netlify, open the site settings.
4. Go to Environment variables.
5. Add:

```text
SLACK_WEBHOOK_URL=your_slack_incoming_webhook_url
```

Do not paste the Slack webhook into `index.html` or `script.js`.

## Netlify Deploy

1. Create a new Netlify site.
2. Deploy this folder: `sme-ai-devops-site`.
3. Build command can stay empty.
4. Publish directory should be:

```text
.
```

5. After deploy, test the contact form.

## Connect `agentops.co.in`

1. In Netlify, open Domain management.
2. Add custom domain: `agentops.co.in`.
3. Also add `www.agentops.co.in`.
4. Netlify will show the DNS records to add.
5. In your domain registrar DNS panel, point the domain to Netlify using the records Netlify provides.
6. Enable HTTPS in Netlify. It usually provisions automatically after DNS is correct.

## Suggested DNS Shape

Use the exact values Netlify gives you, but the common setup is:

```text
agentops.co.in      A or ALIAS/ANAME record to Netlify
www.agentops.co.in  CNAME to your Netlify site URL
```

DNS changes can take a few minutes to several hours.

