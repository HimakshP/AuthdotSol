import { Connection } from "@solana/web3.js";
import { resolve } from "@bonfida/spl-name-service";

// Connect to Solana Mainnet
const connection = new Connection("https://api.mainnet-beta.solana.com");

const domainName = "blud-is-himax.sol";

async function resolveDomain(domain) {
  try {
    const ownerPublicKey = await resolve(connection, domain);
    console.log(`✅ ${domain} is owned by:`, ownerPublicKey.toBase58());
  } catch (err) {
    console.error("❌ Error resolving domain:", err.message);
  }
}

resolveDomain(domainName);
