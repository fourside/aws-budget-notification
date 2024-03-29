import Sts from "aws-sdk/clients/sts";

const sts = new Sts();

export async function getAccount(): Promise<string> {
  return new Promise((resolve, reject) => {
    sts.getCallerIdentity({}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.Account === undefined) {
          reject("data.Account is undefined");
        } else {
          resolve(data.Account);
        }
      }
    });
  });
}
