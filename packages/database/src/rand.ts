import crypto from "crypto";

/** Sync */
function randomStringAsBase64Url(size: number) {
  return crypto.randomBytes(size).toString("base64url");
}

export default randomStringAsBase64Url;
