"use client";

import { useState, useEffect, useRef } from "react";
import {
  getDomainKeySync,
  NameRegistryState,
  resolve,
} from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { Button } from "../app/components/ui/button";
import { Input } from "../app/components/ui/input";
import Link from "next/link";
import { getProfilePic } from "@/lib/get_pfp";

export default function AuthdotSolLanding() {
  const [showTryItOut, setShowTryItOut] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userDomain, setUserDomain] = useState("");
  const [pfp] = useState<string | null>(null);

  const handleTryItOut = () => {
    setShowTryItOut(true);
  };

  const getProvider = () => {
    if (window.solflare?.isSolflare) return window.solflare;
    if (window.solana?.isPhantom) return window.solana;
    return null;
  };

  const handleSignIn = async () => {
    try {
      // 1. Resolve the .sol domain to a public key
      const domain = userDomain.trim().toLowerCase();
      const connection = new Connection(
        "https://mainnet.helius-rpc.com/?api-key=521ac8a4-be7b-4f47-b49c-9cdfa9cb770f"
      );
      const { pubkey } = getDomainKeySync(domain);
      const { registry } = await NameRegistryState.retrieve(connection, pubkey);
      const resolvedAddress = registry.owner.toBase58();

      console.log("Resolved .sol →", resolvedAddress);

      // 2. Detect installed wallets
      const phantom = window.solana?.isPhantom ? window.solana : null;
      const solflare = window.solflare?.isSolflare ? window.solflare : null;

      if (!phantom && !solflare) {
        alert("No supported Solana wallets found.");
        return;
      }

      // 3. Ask user to choose if both installed
      let wallet;
      if (phantom && solflare) {
        const choice = window.prompt(
          "Both Phantom and Solflare detected. Type 'phantom' or 'solflare':"
        );
        if (choice?.toLowerCase() === "phantom") {
          wallet = phantom;
        } else if (choice?.toLowerCase() === "solflare") {
          wallet = solflare;
        } else {
          alert("Invalid wallet choice. Please type 'phantom' or 'solflare'.");
          return;
        }
      } else {
        wallet = phantom || solflare;
      }

      // 4. Connect and verify ownership
      const ownerPublicKey = await resolve(connection, domain);
      const walletResp = await wallet?.connect();
      const userPubkey = wallet?.publicKey;

      console.log("🟢 Resolved ownerPublicKey:", ownerPublicKey?.toBase58?.());
      console.log("🔵 Connected wallet pubkey:", userPubkey?.toBase58?.());

      if (!ownerPublicKey.equals(userPubkey)) {
        alert("❌ Connected wallet does not own this .sol domain.");
        return;
      }

      // 5. Create and sign message
      const currentSite = window.location.hostname || "jinai.xyz"; // Dynamic site detection
      const timestamp = new Date().toISOString();
      const login_message = `Log in to ${currentSite} at ${timestamp}`;
      const encoded_message = new TextEncoder().encode(login_message);
      const signed = await wallet.signMessage(encoded_message);
      const signature = bs58.encode(signed.signature);

      console.log("✅ Message signed:", login_message);
      console.log("📝 Signature:", signature);

      // 6. Send to backend with correct parameters
      const response = await fetch("http://localhost:3001/api/logins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pubkey: userPubkey.toBase58(),
          domain: `${domain}`,
          site: currentSite,
          timestamp: timestamp,
          login_message: login_message,
          signature: signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Backend error:", errorData);
        throw new Error(`Backend error: ${errorData.error || "Unknown error"}`);
      }

      const result = await response.json();
      console.log("✅ Backend response:", result);

      // 7. UI update
      setIsConnected(true);
      setUserDomain(`${domain}`);
      console.log("✅ Logged in successfully to", currentSite);

      // Optional: Show success message
      alert(`✅ Successfully logged in to ${currentSite} with ${domain}`);

      const pfpUrl = await getProfilePic(`${domain}`, connection);
      console.log("🖼️ User PFP URL:", pfpUrl);
    } catch (err) {
      console.error("❌ Error signing in:", err);
      alert(`Login failed: ${err.message}`);
    }
  };
  // Animation hook
  const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    return [ref, isVisible] as const;
  };

  const [whyRef, whyVisible] = useScrollAnimation();
  const [devsRef, devsVisible] = useScrollAnimation();
  const [demoRef, demoVisible] = useScrollAnimation();
  const [analyticsRef, analyticsVisible] = useScrollAnimation();
  const [docsRef, docsVisible] = useScrollAnimation();

  // Solana Logo Component
  const SolanaLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 397.7 311.7" fill="currentColor">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1L333.1 73.8c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
    </svg>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden font-inter">
      {/* Exact Background Match */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(150deg, #ffe600 15%, #222 50%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="absolute top-6 right-6 z-20">
          <div className="relative group">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-yellow-400 cursor-pointer hover:border-yellow-300 transition-all duration-300 hover:scale-110">
              {isConnected ? (
                <div>
                  {pfp ? (
                    <img
                      src={pfp}
                      alt="User PFP"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/fallback-avatar.png"; // Optional local fallback
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-blue-500" />
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-500"></div>
              )}
            </div>
            <div className="absolute -bottom-12 right-0 bg-black/90 backdrop-blur-sm text-yellow-400 px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-yellow-400/30 flex items-center gap-2">
              {isConnected ? (
                userDomain
              ) : (
                <>
                  <SolanaLogo className="w-4 h-4" />
                  Sign in with Solana
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="space-y-8 max-w-5xl animate-fade-in">
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight text-yellow-400"
              style={{
                fontFamily:
                  "'HAL Timezone', 'Inter', 'SF Pro Display', -apple-system, sans-serif",
                fontWeight: "400",
                textShadow:
                  "0 0 40px rgba(255, 255, 0, 0.6), 0 0 80px rgba(255, 255, 0, 0.3)",
                WebkitTextStroke: "3px rgba(0, 0, 0, 0.3)",
              }}
            >
              AuthdotSol
            </h1>

            <div className="space-y-6">
              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Put your Solana Identity to use
              </h2>
              <p
                className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                Onboard Solana users to your website with our one line SDK
              </p>
            </div>

            {!showTryItOut ? (
              <Button
                onClick={handleTryItOut}
                className="bg-black/80 backdrop-blur-sm border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Try it out
              </Button>
            ) : (
              <div className="space-y-6 max-w-md mx-auto animate-slide-up">
                <Input
                  placeholder="What's your .sol domain?"
                  className="bg-black/60 backdrop-blur-md text-white border-2 border-yellow-400/60 placeholder:text-gray-300 text-center py-4 text-lg rounded-xl focus:border-yellow-400 transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  value={userDomain}
                  onChange={(e) => setUserDomain(e.target.value)}
                />
                <div className="relative group">
                  <Button
                    onClick={handleSignIn}
                    className="w-full bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <SolanaLogo className="w-5 h-5" />
                    Sign in with Solana
                  </Button>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-yellow-400 px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-yellow-400/30">
                    Powered by AuthdotSol
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Why AuthdotSol Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              ref={whyRef}
              className={`transition-all duration-1000 ${
                whyVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2
                className="text-4xl md:text-6xl font-light text-center text-white mb-20 tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Why AuthdotSol?
              </h2>
              <div className="space-y-8">
                {[
                  "Preserves user privacy",
                  "Lightweight integration — just one line of code",
                  "No third-party data collection",
                  "Ideal for crypto-native apps and builders",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-6 transition-all duration-700 ${
                      whyVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="w-2 h-2 bg-black rounded-full flex-shrink-0 shadow-lg"></div>
                    <p
                      className="text-white/95 font-medium text-xl md:text-2xl leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What's in it for Devs Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div
              ref={devsRef}
              className={`transition-all duration-1000 ${
                devsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2
                className="text-4xl md:text-6xl font-light text-center text-white mb-20 tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                What's in it for the Devs?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  "Only one function to integrate into your site's login flow",
                  "Supports both Phantom and Solflare wallets",
                  "No need to manage password resets or email verification",
                  "Receive verifiable user identity without exposing private keys",
                  "Get complete analytics of login activity per domain",
                  "Cool Pfp in your Website",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 hover:bg-white/10 ${
                      devsVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-black rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                      <p
                        className="text-white/90 font-medium text-lg leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SDK Demo Video Section */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div
              ref={demoRef}
              className={`transition-all duration-1000 ${
                demoVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="bg-black/20 backdrop-blur-md rounded-3xl p-12 border border-white/10">
                <h3
                  className="text-3xl md:text-4xl font-medium text-yellow-400 mb-8 tracking-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Demo: Solana Sign-in flow using AuthdotSol
                </h3>
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-12 min-h-[350px] flex items-center justify-center border border-white/5">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-yellow-400/30">
                      <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[24px] border-b-black ml-1"></div>
                    </div>
                    <p
                      className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      A light-themed website shows integration steps — from
                      clicking the button, entering .sol, wallet popup approval,
                      and seeing PFP after login.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Domain Analytics Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div
              ref={analyticsRef}
              className={`transition-all duration-1000 ${
                analyticsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2
                className="text-4xl md:text-6xl font-light text-white mb-8 tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Track Your Site's Solana Logins
              </h2>
              <p
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                See real-time insights on which users signed in with their .sol
                domains.
              </p>
              <Link href="/dashboard?site=yourdomain.xyz">
                <Button
                  className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Open Owner Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Docs and Contact Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div
              ref={docsRef}
              className={`grid md:grid-cols-2 lg:grid-cols-5 gap-6 text-center transition-all duration-1000 ${
                docsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {[
                { text: "Integration Guide", href: "#" },
                {
                  text: "View SDK on GitHub",
                  href: "https://github.com/HimakshP",
                },
                {
                  text: "Get Domain Analytics",
                  href: "/dashboard?site=yourdomain.xyz",
                },
                { text: "Developer Docs", href: "#" },
                {
                  text: "Contact Us",
                  href: "https://twitter.com/ThatGrizzly_Dev",
                },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-yellow-400/40 transition-all duration-500 hover:scale-105 hover:bg-white/10 group ${
                    docsVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <p
                    className="text-white/90 font-medium text-lg group-hover:text-yellow-400 transition-colors duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p
              className="text-white/60 text-lg font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              © 2025 AuthdotSol. Built for the Solana ecosystem.
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");

        @import url("https://fonts.cdnfonts.com/css/hal-timezone");

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
