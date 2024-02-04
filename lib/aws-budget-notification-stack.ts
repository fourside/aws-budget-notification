import * as cdk from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";

const resourceName = "aws-budget-notification";
export class AwsBudgetNotificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhookUrl === undefined) {
      throw new Error("not set env `SLACK_WEBHOOK_URL`");
    }

    const logGroup = new logs.LogGroup(this, `${resourceName}-log-group`, {
      logGroupName: "/aws/lambda/podcast",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.THREE_MONTHS,
    });

    const lambda = new NodejsFunction(this, `${resourceName}-lambda`, {
      runtime: Runtime.NODEJS_20_X,
      entry: "lambda/src/index.ts",
      logGroup,
      timeout: cdk.Duration.minutes(3),
      environment: {
        SLACK_WEBHOOK_URL: slackWebhookUrl,
      },
    });

    const viewBudgetsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["budgets:ViewBudget"],
      resources: ["*"],
    });
    lambda.addToRolePolicy(viewBudgetsPolicy);

    new Rule(this, `${resourceName}-lambda-rule`, {
      schedule: Schedule.cron({ minute: "0", hour: "22" }),
      targets: [new targets.LambdaFunction(lambda)],
    });
  }
}
