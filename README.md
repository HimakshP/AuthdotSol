# AuthdotSol

A Solana-based authentication SDK that enables websites to offer **Login with Solana Name Service (.sol) domains**. Users authenticate by entering their `.sol` domain, connecting a supported wallet, and signing a message to prove ownership of the associated Solana address.

### Core Features
- `.sol` domain resolution to owner public keys using Solana Name Service
- Wallet authentication with Phantom and Solflare
- Message signing and signature verification
- Backend verification of domain, public key, and signature
- Authentication event logging with Supabase
- Vite-based frontend with frontend–backend integration
