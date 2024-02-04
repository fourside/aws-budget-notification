import { SlackBlocks } from "./mapBudgetsToSlackBlocks";

export async function sendToSlack(
  webhookUrl: string,
  slackMessage: SlackBlocks
): Promise<unknown> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    body: JSON.stringify(slackMessage),
    headers: { "Content-Type": "application/json" },
  });
  return await response.text();
}
