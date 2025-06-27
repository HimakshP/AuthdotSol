import { Connection } from "@solana/web3.js";
import { resolve } from "@bonfida/spl-name-service";
import bs58 from "bs58";

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=521ac8a4-be7b-4f47-b49c-9cdfa9cb770f"
);

document.getElementById("loginBtn").addEventListener("click", async () => {
  const domain = document.getElementById("domainInput").value.trim();

  if (!domain.endsWith(".sol")) {
    alert("Please enter a valid .sol domain");
    return;
  }

  let wallet;

  if (window.solflare && window.solflare.isSolflare) {
    wallet = window.solflare;
  } else {
    alert("No supported wallet found (Phantom or Solflare)");
    return;
  }

  try {
    const ownerPublicKey = await resolve(connection, domain);

    const walletResp = await wallet.connect();
    const userPubkey = wallet.publicKey;

    console.log("🟢 Resolved ownerPublicKey:", ownerPublicKey?.toBase58?.());
    console.log("🔵 Connected wallet pubkey:", userPubkey?.toBase58?.());

    if (!ownerPublicKey.equals(userPubkey)) {
      alert("❌ Connected wallet does not own this .sol domain.");
      return;
    }

    const login_message = `Log in to jinai.xyz at ${new Date().toISOString()} `;
    const encoded_message = new TextEncoder().encode(login_message);
    const signed = await wallet.signMessage(encoded_message);

    const signature = bs58.encode(signed.signature);

    console.log("✅ Signed message:", login_message);
    console.log("📝 Signature (base58):", signature);
    console.log("🔑 Public Key:", userPubkey.toBase58());
    console.log("🌐 Domain:", domain);
  } catch (err) {
    console.error("❌ Error:", err.message);
    alert("Login failed. Check console.");
  }
});

// blud-is-himax.sol
