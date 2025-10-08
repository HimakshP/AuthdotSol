import {
  getHashedNameSync,
  getNameAccountKeySync,
} from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getProfilePic(
  domain: string,
  connection: Connection
): Promise<string | null> {
  try {
    const hashed = await getHashedNameSync(domain);
    const key = await getNameAccountKeySync(hashed, undefined, undefined);
    const accountInfo = await connection.getAccountInfo(key);

    if (!accountInfo) return null;

    const data = accountInfo.data.toString();
    const ipfsMatch = data.match(/ipfs:\/\/([^\s"]+)/);
    if (ipfsMatch && ipfsMatch[1]) {
      const ipfsHash = ipfsMatch[1];
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    }

    return null;
  } catch (e) {
    console.error("❌ Failed to fetch PFP:", e);
    return null;
  }
}
