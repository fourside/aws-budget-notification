import { getBudgets } from "./aws-budget";
import { getAccount } from "./aws-sts";
import { mapBudgetsToSlackBlocks } from "./mapBudgetsToSlackBlocks";
import { sendToSlack } from "./slack-client";

export async function handler(event: unknown): Promise<void> {
  console.log(JSON.stringify(event));
  try {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      throw new Error("not set env `SLACK_WEBHOOK_URL`");
    }
    const accountId = await getAccount();
    const budgets = await getBudgets(accountId);
    const slackMessage = mapBudgetsToSlackBlocks(budgets);
    const response = await sendToSlack(slackWebhookUrl, slackMessage);
    console.log("slack response", response);
  } catch (e) {
    console.error(e);
  }
}
