interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isConnected?: boolean;
  publicKey?: { toBase58(): string };
  connect(): Promise<void>;
  signMessage(
    message: Uint8Array,
    display?: string
  ): Promise<{ signature: Uint8Array }>;
}

interface Window {
  solana?: SolanaProvider;
  solflare?: SolanaProvider;
}
