import { automation, t } from "automate.ax"
import { hubspot } from "automate.ax/hubspot"
import { stripe } from "automate.ax/stripe"

export default automation(
  "Give failed invoice payments an owner in HubSpot",
  {
    parameters: [
      {
        label: "HubSpot billing owner ID",
        name: "billingOwnerId",
        type: "text",
      },
    ],
  },
  ({ parameters }) => {
    const failure = stripe.onInvoicePaymentFailed()
    const invoice = stripe.getInvoice({ invoiceId: failure.data.object.id })
    const details = invoice.transform(
      ({ customerEmail, hostedInvoiceUrl }) => ({
        customerEmail: customerEmail ?? "Not supplied by Stripe",
        invoiceUrl: hostedInvoiceUrl ?? "Open the invoice in Stripe",
      }),
    )

    hubspot.createTask({
      timestamp: failure.created.transform(
        (seconds) => new Date(seconds * 1000),
      ),
      ownerId: parameters.billingOwnerId,
      subject: t`Review failed payment for Stripe invoice ${invoice.id}`,
      body: t`Customer: ${details.customerEmail}\nInvoice: ${details.invoiceUrl}\nStripe event: ${failure.id}\nReview the payment and contact the customer if needed.`,
      priority: "HIGH",
      taskType: "TODO",
    })
  },
)
