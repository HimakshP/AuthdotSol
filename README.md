# 🟩 AuthdotSol — Login with your .sol Domain

> A Web3-native, privacy-first authentication SDK  that lets users sign into any website using their `.sol` domain — no Google, no passwords, no data leaks.

---

## ✨ Features (Built and Working)

- 🔐 **Sign in with `.sol` domain**  
  Users enter their domain (e.g., `blud-is-himax.sol`) to authenticate.

- 🧩 **Solflare wallet integration**  
  Secure, gasless signature confirmation with direct `.sol` → wallet resolution.

- 🧠 **Domain ownership verification**  
  Uses on-chain records from Bonfida SNS to resolve and verify domain ownership via signed messages.

- 📦 **Plug-and-play frontend extension**  
  A beautiful Chrome extension UI built with HTML, CSS, JS and Manifest V3 using Vercel's v0.

- 💾 **Backend signature verification**  
  Node.js + Express server that receives, verifies, and logs successful `.sol` sign-ins.

- 📊 **Login activity logging**  
  Every successful domain login is logged with timestamp and wallet address in a JSON file.

- 🌐 **Developer-friendly integration**  
  Easy to embed via a frontend popup. SDK in development for a one-liner integration experience.

- 🧭 **Basic wallet compatibility checks**  
  Solflare fully integrated, Phantom compatibility coming next.

---

## 🖼️ Demo Flow

1. User visits a website that supports AuthdotSol.
2. Clicks “Login with Solana”.
3. Types their `.sol` domain → signs a message → authenticated!
4. Backend logs this activity as a verified `.sol` login.

---

## 🧰 Tech Stack

- `@solana/web3.js`
- `@bonfida/spl-name-service`
- `bs58`
- Node.js + Express (backend)
- Vanilla JS + HTML/CSS + Vite (frontend)

---

## 💡 Why AuthdotSol?

- 🕵️‍♂️ Stop using Google for sign-in where it’s not needed.
- 🪪 Let your Solana identity be your username.
- 🚫 No passwords, no emails, no data harvesting.
- ✅ Verifiable domain ownership using cryptographic signatures.
- 🌱 Privacy-first, crypto-native login solution.

---

## 📬 Connect With Us

- Twitter: [@ThatGrizzly_Dev](https://twitter.com/ThatGrizzly_Dev)
- GitHub: [HimakshP](https://github.com/HimakshP)
- Docs (coming soon): `/docs/integrate.md`

---

## 🚀 Coming Next

- Phantom support (in progress)
- Login logs dashboard for website owners
- One-line SDK: `connectSolDomain()`

