
import {
  ShieldCheck,
  LayoutDashboard,
  ScanSearch,
  History,
  Settings,
  Activity,
  ShieldAlert,
  Globe,
  Mail,
  MessageSquare,
  Bell,
  Search,
  ArrowUpRight,
  Zap,
  Radar,
} from "lucide-react";

import { UserButton, useUser } from "@clerk/react";

import { Link } from "react-router-dom";


const events = [
  {
    time: "10:42:18",
    name: "URL scan completed",
    type: "SAFE",
  },
  {
    time: "10:40:32",
    name: "Suspicious link detected",
    type: "ALERT",
  },
  {
    time: "10:38:10",
    name: "Email analyzed",
    type: "SAFE",
  },
  {
    time: "10:35:44",
    name: "Risk assessment completed",
    type: "LOW",
  },
  {
    time: "10:30:12",
    name: "Message analysis",
    type: "SAFE",
  },
];


const scans = [
  {
    name: "example-shopping.com",
    type: "URL",
    score: 12,
    status: "SAFE",
    time: "Today, 10:30 AM",
  },
  {
    name: "Unknown promotional message",
    type: "SMS",
    score: 89,
    status: "DANGEROUS",
    time: "Today, 09:15 AM",
  },
  {
    name: "Account verification email",
    type: "EMAIL",
    score: 65,
    status: "SUSPICIOUS",
    time: "Yesterday",
  },
  {
    name: "Online shopping offer",
    type: "MESSAGE",
    score: 18,
    status: "SAFE",
    time: "Yesterday",
  },
];


export default function Dashboard() {

  const { user } = useUser();

  const firstName = user?.firstName || "User";


  return (

    <div className="min-h-screen bg-[#030711] text-white flex">

      {/* SIDEBAR */}

      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/[0.07] bg-[#060B16] flex-col">

        <Link to="/" className="flex items-center gap-3 px-6 py-7 border-b border-white/[0.07]">

          <div className="bg-cyan-400/10 border border-cyan-400/20 p-2 rounded-xl">
            <ShieldCheck className="text-cyan-400" size={23} />
          </div>

          <span className="text-xl font-semibold">
            Trust<span className="text-cyan-400">Lens</span>
          </span>

        </Link>


        <div className="px-4 py-8 flex-1">

          <p className="text-[10px] text-gray-600 tracking-[0.25em] px-3 mb-5">
            MAIN MENU
          </p>


          <nav className="space-y-2">

            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm"
            >
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <a href="#quick-scan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition">
              <ScanSearch size={18} />
              New Scan
            </a>

            <a href="#history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition">
              <History size={18} />
              Scan History
            </a>

            <a href="#analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition">
              <Activity size={18} />
              Analytics
            </a>

          </nav>


          <p className="text-[10px] text-gray-600 tracking-[0.25em] px-3 mt-12 mb-5">
            SYSTEM
          </p>


          <nav className="space-y-2">

            <a href="#events" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition">
              <Radar size={18} />
              Event Monitor
            </a>

            <a href="#settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition">
              <Settings size={18} />
              Settings
            </a>

            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition">
              <ArrowUpRight size={18} />
              Home
            </Link>

          </nav>

        </div>


        <div className="p-5 border-t border-white/[0.07] flex items-center gap-3">

          <UserButton />

          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {firstName}
            </p>

            <p className="text-xs text-gray-600">
              Security User
            </p>
          </div>

        </div>

      </aside>


      {/* MAIN AREA */}

      <main className="flex-1 min-w-0">


        {/* TOP NAVBAR */}

        <header className="h-[76px] border-b border-white/[0.07] flex items-center justify-between px-5 md:px-9 bg-[#060B16]">

          <div className="flex items-center gap-3">

            <ShieldCheck className="text-cyan-400 lg:hidden" />

            <div>
              <p className="text-xs text-gray-600">
                TRUSTLENS / SECURITY CENTER
              </p>

              <h1 className="font-semibold text-lg">
                Security Overview
              </h1>
            </div>

          </div>


          <div className="flex items-center gap-4">

            <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-2 rounded-lg">
              <Search size={15} className="text-gray-500" />

              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-24 text-white placeholder:text-gray-600"
              />
            </div>

            <button className="text-gray-400 hover:text-cyan-400">
              <Bell size={19} />
            </button>

            <div className="lg:hidden">
              <UserButton />
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="p-5 md:p-9">


          {/* WELCOME */}

          <div className="flex flex-wrap justify-between items-center gap-5 mb-9">

            <div>

              <p className="text-xs text-cyan-400 tracking-widest mb-2">
                SYSTEM STATUS: OPERATIONAL
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold">
                Welcome back, {firstName}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Here's your digital security overview.
              </p>

            </div>


            <Link
              to="/dashboard#quick-scan"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-3 rounded-lg transition"
            >
              <ScanSearch size={18} />
              Start New Scan
            </Link>

          </div>


          {/* STAT CARDS */}

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {[
              {
                label: "TOTAL SCANS",
                value: "128",
                icon: ScanSearch,
                change: "+12% this week",
                color: "text-cyan-400",
              },
              {
                label: "THREATS DETECTED",
                value: "13",
                icon: ShieldAlert,
                change: "Requires attention",
                color: "text-red-400",
              },
              {
                label: "SAFE CONTENT",
                value: "86",
                icon: ShieldCheck,
                change: "67.2% of scans",
                color: "text-green-400",
              },
              {
                label: "SUSPICIOUS ITEMS",
                value: "29",
                icon: Activity,
                change: "Needs verification",
                color: "text-yellow-400",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (

                <div key={item.label} className="bg-[#0A1221] border border-white/[0.07] rounded-xl p-5 hover:border-cyan-400/30 transition">

                  <div className="flex justify-between">

                    <p className="text-[10px] text-gray-500 tracking-widest">
                      {item.label}
                    </p>

                    <Icon className={item.color} size={20} />

                  </div>

                  <h3 className="text-3xl font-semibold mt-5">
                    {item.value}
                  </h3>

                  <p className={`text-xs mt-3 ${item.color}`}>
                    {item.change}
                  </p>

                </div>

              );

            })}

          </div>


          {/* RISK + SYSTEM STATUS */}

          <div id="analytics" className="grid lg:grid-cols-3 gap-5 mb-8">


            {/* RISK SCORE */}

            <div className="bg-[#0A1221] border border-white/[0.07] rounded-xl p-6">

              <p className="text-xs text-gray-500 tracking-widest">
                OVERALL RISK SCORE
              </p>

              <div className="flex justify-center py-7">

                <div className="relative w-44 h-44 rounded-full flex items-center justify-center"
                  style={{
                    background: "conic-gradient(#22D3EE 0deg 43deg, #17243A 43deg 360deg)",
                  }}
                >

                  <div className="absolute inset-3 rounded-full bg-[#0A1221] flex flex-col items-center justify-center">

                    <span className="text-4xl font-bold text-cyan-400">
                      12
                    </span>

                    <span className="text-xs text-gray-500">
                      OUT OF 100
                    </span>

                  </div>

                </div>

              </div>

              <div className="text-center">

                <span className="text-green-400 text-sm font-semibold">
                  LOW RISK
                </span>

                <p className="text-xs text-gray-600 mt-2">
                  Your overall security status is healthy.
                </p>

              </div>

            </div>


            {/* SYSTEM HEALTH */}

            <div className="lg:col-span-2 bg-[#0A1221] border border-white/[0.07] rounded-xl p-6">

              <div className="flex justify-between items-center mb-7">

                <div>
                  <h3 className="font-semibold">
                    System Monitoring
                  </h3>

                  <p className="text-xs text-gray-600 mt-1">
                    Security infrastructure overview
                  </p>
                </div>

                <span className="text-cyan-400 text-xs">
                  ● OPERATIONAL
                </span>

              </div>


              {[
                ["URL Detection Engine", "Active", 95],
                ["Email Analysis Engine", "Active", 90],
                ["Message Detection Engine", "Active", 88],
                ["AI Risk Analysis", "Active", 92],
              ].map((item) => (

                <div key={item[0]} className="mb-7">

                  <div className="flex justify-between text-xs mb-3">

                    <span className="text-gray-300">
                      {item[0]}
                    </span>

                    <span className="text-cyan-400">
                      {item[1]}
                    </span>

                  </div>

                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">

                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      style={{ width: `${item[2]}%` }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* QUICK SCAN */}

          <section id="quick-scan" className="bg-[#0A1221] border border-white/[0.07] rounded-xl p-6 mb-8">

            <div className="flex justify-between items-center mb-6">

              <div>

                <h3 className="font-semibold">
                  Security Scanner
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Select content to analyze.
                </p>

              </div>

              <ScanSearch className="text-cyan-400" />

            </div>


            <div className="grid sm:grid-cols-3 gap-4">

              {[
                {
                  name: "Scan URL",
                  desc: "Analyze suspicious websites.",
                  icon: Globe,
                },
                {
                  name: "Analyze Email",
                  desc: "Detect phishing attempts.",
                  icon: Mail,
                },
                {
                  name: "Check Message",
                  desc: "Analyze suspicious messages.",
                  icon: MessageSquare,
                },
              ].map((item) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.name}
                    className="text-left border border-white/10 bg-[#0D192B] hover:border-cyan-400/40 p-5 rounded-xl transition"
                  >

                    <Icon className="text-cyan-400 mb-4" size={24} />

                    <h4 className="font-semibold text-sm">
                      {item.name}
                    </h4>

                    <p className="text-xs text-gray-500 mt-2">
                      {item.desc}
                    </p>

                    <ArrowUpRight className="ml-auto mt-4 text-cyan-400" size={17} />

                  </button>

                );

              })}

            </div>

          </section>


          {/* NETWORK + EVENT LOG */}

          <div id="events" className="grid xl:grid-cols-3 gap-5 mb-8">


            {/* NETWORK ACTIVITY */}

            <div className="xl:col-span-2 bg-[#0A1221] border border-white/[0.07] rounded-xl p-6">

              <div className="flex justify-between mb-7">

                <div>
                  <h3 className="font-semibold">
                    Network Activity
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Scan activity visualization
                  </p>
                </div>

                <span className="text-xs text-cyan-400">
                  LAST 24 HOURS
                </span>

              </div>


              <div className="h-48 flex items-end gap-2 border-b border-l border-white/10 px-2">

                {[40, 55, 35, 70, 50, 85, 60, 40, 75, 55, 90, 65, 45, 80, 95, 60, 75, 50, 70, 90, 55, 80, 65, 95].map((height, i) => (

                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600/20 to-cyan-400"
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

            <div className="bg-[#0A1221] border border-white/[0.07] rounded-xl p-6">

              <div className="flex justify-between items-center mb-7">

                <h3 className="font-semibold">
                  Event Log
                </h3>

                <Activity size={18} className="text-cyan-400" />

              </div>


              <div className="space-y-5">

                {events.map((event, i) => (

                  <div key={i} className="flex gap-3 border-b border-white/[0.05] pb-4">

                    <span className="text-[10px] text-gray-600 pt-1">
                      {event.time}
                    </span>

                    <div>

                      <p className="text-xs text-gray-300">
                        {event.name}
                      </p>

                      <p className={`text-[10px] mt-2 ${
                        event.type === "ALERT"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}>
                        {event.type}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* RECENT SCANS */}

          <section id="history" className="bg-[#0A1221] border border-white/[0.07] rounded-xl overflow-hidden">

            <div className="p-6 border-b border-white/[0.07] flex justify-between items-center">

              <div>

                <h3 className="font-semibold">
                  Recent Security Analysis
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Your latest scan activity
                </p>

              </div>

              <History className="text-cyan-400" />

            </div>


            <div className="overflow-x-auto">

              <table className="w-full text-left min-w-[650px]">

                <thead className="text-[10px] tracking-widest text-gray-600 bg-white/[0.02]">

                  <tr>
                    <th className="px-6 py-4">CONTENT</th>
                    <th className="px-6 py-4">TYPE</th>
                    <th className="px-6 py-4">RISK SCORE</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">TIME</th>
                  </tr>

                </thead>


                <tbody>

                  {scans.map((scan, i) => (

                    <tr key={i} className="border-t border-white/[0.05] hover:bg-white/[0.02]">

                      <td className="px-6 py-5 text-sm text-gray-300">
                        {scan.name}
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {scan.type}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {scan.score}/100
                      </td>

                      <td className="px-6 py-5">

                        <span className={`text-[10px] px-3 py-1.5 rounded-full ${
                          scan.status === "SAFE"
                            ? "bg-green-400/10 text-green-400"
                            : scan.status === "DANGEROUS"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}>
                          {scan.status}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {scan.time}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>


          <p className="text-center text-[10px] text-gray-700 mt-8">
            TRUSTLENS SECURITY MONITORING SYSTEM · 2026
          </p>

        </div>

      </main>

    </div>

  );

}