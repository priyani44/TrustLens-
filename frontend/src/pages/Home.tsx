
import {
  Shield,
  ShieldCheck,
  ArrowRight,
  Activity,
  Lock,
  Radar,
  Globe,
  Zap,
  ScanSearch,
  Play,
  Menu,
} from "lucide-react";

import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/react";

import { Link } from "react-router-dom";

const metrics = [
  {
    label: "THREATS BLOCKED",
    value: "8,942",
    status: "Protected",
    icon: Shield,
    color: "#22D3EE",
  },
  {
    label: "RISK SCORE",
    value: "Low",
    status: "Secure Environment",
    icon: ShieldCheck,
    color: "#34D399",
  },
  {
    label: "SYSTEM STATUS",
    value: "Active",
    status: "All Systems Operational",
    icon: Activity,
    color: "#38BDF8",
  },
];

export default function Home() {
  return (
    <div className= "w-full min-h-screen bg-[#030711] text-white overflow-x-hidden">

      {/* NAVBAR */}

      <nav className="relative z-20 w-full border-b border-white/10">
  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between"></div>

        <Link to="/" className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
            <ShieldCheck className="text-cyan-400" size={24} />
          </div>

          <span className="text-xl font-semibold tracking-wide">
            Trust<span className="text-cyan-400">Lens</span>
          </span>

        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm text-gray-400">

          <a href="#features" className="hover:text-cyan-400 transition">
            Features
          </a>

          <a href="#monitor" className="hover:text-cyan-400 transition">
            Live Monitor
          </a>

          <a href="#about" className="hover:text-cyan-400 transition">
            About
          </a>

        </div>

        <div className="flex items-center gap-4">

          <Show when="signed-out">

            <SignInButton mode="modal">
              <button className="hidden sm:block text-sm text-gray-300 hover:text-white">
                Sign In
              </button>
            </SignInButton>

            <SignInButton mode="modal">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition">
                GET APP
              </button>
            </SignInButton>

          </Show>

          <Show when="signed-in">

            <Link
              to="/dashboard"
              className="bg-cyan-500 text-black font-semibold text-sm px-5 py-2.5 rounded-lg"
            >
              Dashboard
            </Link>

            <UserButton />

          </Show>

        </div>

      </nav>


      {/* HERO */}

      <section className="relative w-full pt-24 pb-16 px-5 text-center overflow-hidden">
           <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
    {/* Keep your existing hero content here */}
  </div>
        {/* RADAR BACKGROUND */}

        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">

          <div className="relative w-750px h-750px rounded-full border border-cyan-400/[0.07]">

            <div className="absolute inset-[10%] rounded-full border border-cyan-400/[0.09]" />

            <div className="absolute inset-[22%] rounded-full border border-cyan-400/[0.11]" />

            <div className="absolute inset-[34%] rounded-full border border-cyan-400/[0.13]" />

            <div className="absolute inset-[46%] rounded-full border border-cyan-400/[0.15]" />

            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/20" />

            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/20" />

            <div className="absolute inset-0 rounded-full bg-cyan-500/[0.025] blur-3xl" />

          </div>

        </div>

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full" />


        <div className="relative z-10 max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 rounded-full text-cyan-300 text-xs tracking-widest mb-9">

            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />

            SYSTEM SECURE

          </div>


          <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-tight">

            Trust-Based

            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500">
              Digital Security
            </span>

          </h1>


          <p className="text-gray-400 max-w-xl mx-auto mt-7 leading-7 text-sm md:text-base">

            Unified security platform for smarter digital protection.
            Analyze suspicious links, detect phishing attempts and
            identify potential threats before they harm you.

          </p>


          <div className="flex flex-wrap justify-center gap-4 mt-9">

            <Show when="signed-out">

              <SignInButton mode="modal">
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-7 py-3.5 rounded-lg shadow-[0_0_25px_rgba(34,211,238,0.25)] transition">

                  <ScanSearch size={18} />

                  Start Scanning

                </button>
              </SignInButton>

            </Show>


            <Show when="signed-in">

              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-7 py-3.5 rounded-lg transition"
              >
                <ScanSearch size={18} />
                Start Scanning
              </Link>

            </Show>


            <a
              href="#monitor"
              className="flex items-center gap-2 border border-white/15 bg-white/[0.03] hover:bg-white/10 px-7 py-3.5 rounded-lg text-sm transition"
            >

              <Play size={16} />

              Live Demo

            </a>

          </div>

        </div>

      </section>


      {/* MONITORING DASHBOARD PREVIEW */}

      <section id="monitor" className="relative w-full mx-auto px-5 pb-24">
        <div className="max-w-1400px mx-auto"></div>

        <div className="relative border border-cyan-400/15 bg-[#080E1C]/95 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(8,145,178,0.08)]">

          {/* WINDOW HEADER */}

          <div className="flex justify-between items-center px-5 py-4 border-b border-white/[0.08] bg-[#0B1222]">

            <div className="flex items-center gap-4">

              <div className="flex gap-1.5">

                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />

              </div>

              <span className="text-xs text-gray-400 tracking-widest">
                TRUSTLENS / SECURITY_MONITOR
              </span>

            </div>

            <div className="flex items-center gap-2 text-[10px] text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 rounded-full">

              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />

              LIVE FEED

            </div>

          </div>


          {/* MAIN MONITOR */}

          <div className="p-5 md:p-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

              {metrics.map((metric) => {

                const Icon = metric.icon;

                return (

                  <div
                    key={metric.label}
                    className="bg-[#0D1629] border border-white/[0.07] rounded-xl p-5 hover:border-cyan-400/30 transition"
                  >

                    <div className="flex justify-between items-center">

                      <span className="text-[10px] text-gray-500 tracking-widest">
                        {metric.label}
                      </span>

                      <Icon size={19} style={{ color: metric.color }} />

                    </div>

                    <h3 className="text-3xl font-semibold mt-4 tracking-wide">
                      {metric.value}
                    </h3>

                    <p className="text-xs mt-3" style={{ color: metric.color }}>
                      ● {metric.status}
                    </p>

                    <div className="h-1 bg-white/5 rounded-full mt-5 overflow-hidden">

                      <div
                        className="h-full rounded-full"
                        style={{
                          width: metric.label === "RISK SCORE" ? "25%" : "85%",
                          background: metric.color,
                        }}
                      />

                    </div>

                  </div>

                );

              })}

            </div>


            {/* NETWORK ACTIVITY + EVENT LOG */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 w-full">

              <div className="lg:col-span-2 bg-[#0D1629] border border-white/[0.07] rounded-xl p-5">

                <div className="flex justify-between items-center mb-7">

                  <div>

                    <h3 className="text-sm font-semibold">
                      Network Activity
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Security monitoring overview
                    </p>

                  </div>

                  <span className="text-xs text-cyan-400">
                    LAST 24H
                  </span>

                </div>


                {/* ACTIVITY GRAPH */}

                <div className="h-40 flex items-end gap-2 border-b border-l border-white/10 px-3">

                  {[35, 55, 40, 70, 48, 85, 60, 45, 78, 55, 92, 65, 48, 75, 95, 60, 80, 50, 72, 90, 58, 82, 67, 95].map((height, i) => (

                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-600/20 to-cyan-400/90 hover:from-cyan-400/50 transition"
                      style={{ height: `${height}%` }}
                    />

                  ))}

                </div>


                <div className="flex justify-between text-[10px] text-gray-600 mt-3">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>

              </div>


              {/* EVENT LOG */}

              <div className="bg-[#0D1629] border border-white/[0.07] rounded-xl p-5">

                <div className="flex justify-between mb-6">

                  <h3 className="text-sm font-semibold">
                    Event Log
                  </h3>

                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />

                </div>


                <div className="space-y-5 text-xs">

                  {[
                    ["10:42:18", "URL scan completed", "SAFE"],
                    ["10:40:32", "Suspicious link detected", "ALERT"],
                    ["10:38:10", "Email analyzed", "SAFE"],
                    ["10:35:44", "Threat assessment", "LOW"],
                  ].map((event, i) => (

                    <div key={i} className="flex gap-3 border-b border-white/[0.05] pb-4">

                      <span className="text-gray-600 shrink-0">
                        {event[0]}
                      </span>

                      <div>

                        <p className="text-gray-300">
                          {event[1]}
                        </p>

                        <p className={`mt-1 text-[10px] ${
                          event[2] === "ALERT" ? "text-red-400" : "text-green-400"
                        }`}>
                          {event[2]}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section id="features" className="relative bg-[#060B16] border-t border-white/[0.06] py-24 px-6">

        <div className="ax-w-[1400px] w-full mx-auto">

          <div className="text-center mb-16">

            <p className="text-cyan-400 text-xs tracking-[0.3em] mb-4">
              ADVANCED PROTECTION
            </p>

            <h2 className="text-4xl font-medium">
              One Platform. <span className="text-cyan-400">Total Awareness.</span>
            </h2>

            <p className="text-gray-500 mt-5 max-w-xl mx-auto text-sm leading-7">
              Analyze digital threats with intelligent security tools
              designed to make your online experience safer.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-5">

            {[
              {
                icon: Globe,
                title: "URL Detection",
                description: "Identify suspicious websites and potentially harmful links.",
              },
              {
                icon: Shield,
                title: "Phishing Detection",
                description: "Analyze emails and messages for phishing indicators.",
              },
              {
                icon: Radar,
                title: "AI Risk Analysis",
                description: "Understand suspicious patterns through intelligent analysis.",
              },
              {
                icon: Activity,
                title: "Threat Monitoring",
                description: "Monitor security events and analyze potential threats.",
              },
              {
                icon: Lock,
                title: "Digital Protection",
                description: "Make informed decisions before sharing sensitive information.",
              },
              {
                icon: Zap,
                title: "Instant Reports",
                description: "Get understandable risk scores and safety recommendations.",
              },
            ].map((item, i) => {

              const Icon = item.icon;

              return (

                <div
                  key={i}
                  className="p-7 bg-[#0A1221] border border-white/[0.07] rounded-xl hover:border-cyan-400/30 transition"
                >

                  <Icon className="text-cyan-400 mb-6" size={27} />

                  <h3 className="text-lg font-semibold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-7">
                    {item.description}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer id="about" className="border-t border-white/[0.07] px-6 py-8">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">

          <div className="flex items-center gap-3">

            <ShieldCheck className="text-cyan-400" />

            <span className="font-semibold">
              TrustLens
            </span>

          </div>

          <p className="text-xs text-gray-500">
            © 2026 TrustLens. Think Before You Click.
          </p>

          <span className="text-xs text-cyan-400">
            DIGITAL SECURITY REIMAGINED
          </span>

        </div>

      </footer>

    </div>
  );
}