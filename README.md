# Send failed Stripe invoices to a HubSpot billing owner

A failed invoice needs a human review before it becomes another unnoticed item in the billing dashboard.

Stripe can retry a payment and send billing emails. This example adds an internal handoff: when an invoice payment fails, it retrieves the invoice and creates a high-priority HubSpot task for a billing owner you choose. The task includes the customer email Stripe supplied, a hosted invoice link when available, and the event ID.

The owner still needs to check the invoice's current state and find the right customer record before contacting anyone. The example assigns every failed invoice to one billing owner rather than guessing which HubSpot contact or account manager it belongs to. It records a human next step without changing the subscription or sending another billing email.

## Set it up with a coding agent

Copy the setup prompt from [the article](https://automate.ax/articles/stripe-failed-payment) into your coding agent. The agent creates the Automate.ax project, asks for your choices, guides account authorization, checks the automation, and deploys it. You do not need to clone this repository yourself when using the prompt.

You'll choose:

- The Stripe account whose failed invoices should create tasks.
- The HubSpot billing owner who should review every task.
- Account authorization.

Start with the setup prompt. The agent will create the Automate.ax project, guide you through connecting Stripe and HubSpot, and ask for values it cannot discover from your accounts.

## Manual setup

If you prefer to set it up yourself:

```sh
git clone https://github.com/SentsCo/automate-ax-stripe-failed-payment.git
cd automate-ax-stripe-failed-payment
bun install
bunx automate.ax login
bunx automate.ax init
bun run typecheck
bunx automate.ax deploy
```

Connect the accounts requested by Automate.ax when you deploy. The platform stores credentials outside this repository. Set any project parameters requested by the automation, then review the read and write operations before turning it on.

## Check a run

Trigger an invoice payment failure in Stripe test mode. Confirm the task goes to the selected HubSpot owner and contains the correct invoice ID, customer email, link when available, and Stripe event ID. Check the live invoice state before treating the task as unresolved.

## Limits

- Stripe may retry an invoice and email the customer on its own. This workflow is for internal follow-up and should not send a second automatic payment demand.
- A failed attempt is not a lost subscription. The account owner should check the invoice's current status before contacting the customer.
- The task is not associated with a HubSpot contact. The billing owner must verify the customer before reaching out.
- Repeated failure events can create more than one task for an invoice. Add a deduplication rule before using this with a high-volume billing queue.

The workflow responds to [a real problem described by A SaaS operator's failed-invoice question on Reddit](https://www.reddit.com/r/SaaS/comments/1erwrg2). The public report informed the example; it is not an endorsement of this implementation.
