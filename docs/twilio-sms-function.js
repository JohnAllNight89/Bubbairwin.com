/**
 * Twilio Function: text 520-208-5869 when the booking form is submitted.
 *
 * Setup (one time, ~10 minutes):
 *  1. Create a Twilio account at https://www.twilio.com/try-twilio
 *     (trial gives you free credit; verify 520-208-5869 as a "Verified
 *     Caller ID" so the trial can text it).
 *  2. Get a Twilio phone number (Console → Phone Numbers → Buy a number;
 *     trial credit covers it).
 *  3. Console → Functions and Assets → Services → Create Service
 *     (name it e.g. "bubba-sms").
 *  4. Add a Function with path /notify, paste this entire file in,
 *     and set it to "Public".
 *  5. In the service's Environment Variables add:
 *        SMS_TO   = +15202085869
 *        SMS_FROM = +1XXXXXXXXXX   (your new Twilio number)
 *     Keep "Add my Twilio Credentials (ACCOUNT_SID and AUTH_TOKEN)"
 *     checked under Settings → Dependencies/Credentials.
 *  6. Click Deploy All, then Copy URL on the /notify function —
 *     it looks like https://bubba-sms-1234.twil.io/notify
 *  7. Paste that URL into SMS_ENDPOINT at the bottom of js/main.js
 *     on the website (or send it to Claude to wire in and deploy).
 */
exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");

  const clean = (v, n) => String(v || "").replace(/\s+/g, " ").trim().slice(0, n);
  const name = clean(event.Name, 60);
  const phone = clean(event.Phone, 30);
  const email = clean(event.Email, 60);
  const placement = clean(event["Preferred Placement"], 40);
  const idea = clean(event["Tattoo Idea"], 280);

  // ignore empty/garbage pings
  if (!name || (!phone && !email)) {
    response.setStatusCode(400);
    return callback(null, response);
  }

  const body =
    "New tattoo consult request\n" +
    name + " | " + phone + (email ? " | " + email : "") + "\n" +
    (placement ? "Placement: " + placement + "\n" : "") +
    (idea ? "Idea: " + idea : "");

  try {
    await context.getTwilioClient().messages.create({
      to: context.SMS_TO,
      from: context.SMS_FROM,
      body: body,
    });
    response.setStatusCode(204);
  } catch (err) {
    console.error(err);
    response.setStatusCode(500);
  }
  return callback(null, response);
};
