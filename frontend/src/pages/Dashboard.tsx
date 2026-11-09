import { useState, useEffect, useRef, type FormEvent } from "react";

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
  Radar,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquareText,
} from "lucide-react";

import { UserButton, useUser } from "@clerk/react";

import { Link } from "react-router-dom";


// TYPES

type ScanResult = {
  success: boolean;
  scannedUrl: string;
  riskScore: number;
  riskLevel: string;
  reasons: string[];
  disclaimer?: string;
};

type ScanRecord = {
  name: string;
  type: string;
  score: number;
  status: string;
  time: string;
};

type EventRecord = {
  time: string;
  name: string;
  type: string;
};


export default function Dashboard() {

  const { user } = useUser();

  const firstName = user?.firstName || "User";


  // STATES

  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] = useState<ScanResult | null>(null);

  const [selectedScanner, setSelectedScanner] = useState("");
const scannerFormRef = useRef<HTMLDivElement>(null);

// MESSAGE SCANNER STATES

const [message, setMessage] = useState("");

const [messageLoading, setMessageLoading] = useState(false);

const [messageError, setMessageError] = useState("");

const [messageResult, setMessageResult] = useState<any>(null);

// EMAIL SCANNER STATES
const [senderEmail, setSenderEmail] = useState("");
const [emailSubject, setEmailSubject] = useState("");
const [emailBody, setEmailBody] = useState("");

const [emailLoading, setEmailLoading] = useState(false);
const [emailError, setEmailError] = useState("");
const [emailResult, setEmailResult] = useState<any>(null);
useEffect(() => {
  if (selectedScanner === "URL") {
    scannerFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, [selectedScanner]);

  const [scans, setScans] = useState<ScanRecord[]>([]);

  const [events, setEvents] = useState<EventRecord[]>([]);
   const [scanHistory, setScanHistory] = useState<any[]>([]);
   const [loadingHistory, setLoadingHistory] = useState(true);
   // MESSAGE SCAN HISTORY

const [messageHistory, setMessageHistory] = useState<any[]>([]);
const [loadingMessageHistory, setLoadingMessageHistory] = useState(true);
// EMAIL SCAN HISTORY
const [emailHistory, setEmailHistory] = useState<any[]>([]);
const [loadingEmailHistory, setLoadingEmailHistory] = useState(true);

  const fetchScanHistory = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/scan/history");
    const data = await response.json();

    if (data.success) {
      setScanHistory(data.scans);
    }
  } catch (error) {
    console.error("Error fetching scan history:", error);
  } finally {
    setLoadingHistory(false);
  }
};

// FETCH MESSAGE SCAN HISTORY

const fetchMessageHistory = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/scan/message-history"
    );

    const data = await response.json();

    if (data.success) {
      setMessageHistory(data.scans);
    }
  } catch (error) {
    console.error("Error fetching message history:", error);
  } finally {
    setLoadingMessageHistory(false);
  }
};
const fetchEmailHistory = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/scan/email-history"
    );

    const data = await response.json();

    if (data.success) {
      setEmailHistory(data.scans);
    }
  } catch (error) {
    console.error("Error fetching email history:", error);
  } finally {
    setLoadingEmailHistory(false);
  }
};

const handleDeleteScan = async (id: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this scan?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/scan/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (data.success) {
      setScanHistory((prev) =>
        prev.filter((scan) => scan.id !== id)
      );
    } else {
      alert(data.message || "Unable to delete scan.");
    }
  } catch (error) {
    console.error("Delete scan error:", error);
    alert("Something went wrong while deleting the scan.");
  }
};

useEffect(() => {
  fetchScanHistory();
  fetchMessageHistory();
  fetchEmailHistory();
}, []);

  // STATISTICS

  const totalScans = scans.length;

  const threatsDetected = scans.filter(
    (scan) => scan.status === "DANGEROUS"
  ).length;

  const safeScans = scans.filter(
    (scan) => scan.status === "SAFE"
  ).length;

  const suspiciousScans = scans.filter(
    (scan) => scan.status === "SUSPICIOUS"
  ).length;


  // RISK SCORE

  const riskScore = result?.riskScore ?? 0;

  const riskLevel = result?.riskLevel ?? "Not Scanned";

  const riskColor =
    riskScore >= 60
      ? "#F87171"
      : riskScore >= 30
      ? "#FACC15"
      : "#22D3EE";


  // URL SCANNER FUNCTION

  const handleScan = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const inputUrl = url.trim();

    if (!inputUrl) {
      setError("Please enter a URL to scan.");
      return;
    }

    // Automatically add HTTPS if the user doesn't provide a protocol.

    const finalUrl = /^https?:\/\//i.test(inputUrl)
      ? inputUrl
      : `https://${inputUrl}`;


    setLoading(true);

    setError("");

    setResult(null);


    try {

      const response = await fetch(
        "http://localhost:5000/api/scan/url",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: finalUrl,
          }),
        }
      );
     // MESSAGE SCANNER FUNCTION



      const data = await response.json();


      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to scan this URL."
        );
      }


      // SAVE RESULT

      setResult(data);


      // CONVERT STATUS TO UPPERCASE

      const status = data.riskLevel.toUpperCase();


      // FORMAT TIME

      const currentTime = new Date();


      const formattedTime = currentTime.toLocaleString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }
      );


      const formattedEventTime = currentTime.toLocaleTimeString(
        "en-IN",
        {
          hour12: false,
        }
      );


      // ADD TO RECENT SCANS

      const newScan: ScanRecord = {
        name: data.scannedUrl,
        type: "URL",
        score: data.riskScore,
        status: status,
        time: formattedTime,
      };


      setScans((previousScans) => [
        newScan,
        ...previousScans,
      ]);


      // ADD TO EVENT LOG

      const newEvent: EventRecord = {
        time: formattedEventTime,
        name: "URL scan completed",
        type:
          status === "DANGEROUS"
            ? "ALERT"
            : status,
      };


      setEvents((previousEvents) => [
        newEvent,
        ...previousEvents,
      ].slice(0, 5));


    } catch (err) {

      console.error("URL Scan Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

// MESSAGE SCANNER FUNCTION

const handleMessageScan = async () => {
  if (!message.trim()) {
    setMessageError("Please enter a message to scan.");
    return;
  }

  setMessageLoading(true);
  setMessageError("");
  setMessageResult(null);

  try {
    const response = await fetch("http://localhost:5000/api/scan/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setMessageError(data.message || "Unable to scan message.");
      return;
    }

    setMessageResult(data);

  } catch (error) {
    console.error("Message scan error:", error);
    setMessageError("Unable to connect to the server. Please try again.");
  } finally {
    setMessageLoading(false);
  }
};

const handleEmailScan = async () => {
  if (!emailSubject.trim() || !emailBody.trim()) {
    setEmailError("Please enter the email subject and content.");
    return;
  }

  setEmailLoading(true);
  setEmailError("");
  setEmailResult(null);

  try {
    const response = await fetch(
      "http://localhost:5000/api/scan/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail,
          subject: emailSubject,
          emailBody,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      setEmailError(data.message || "Unable to analyze email.");
      return;
    }

    setEmailResult(data);
  } catch (error) {
    console.error("Email scan error:", error);
    setEmailError("Unable to connect to the server. Please try again.");
  } finally {
    setEmailLoading(false);
  }
};

  // SCANNER SELECTION

  const handleScannerSelection = (scanner: string) => {

    setSelectedScanner(scanner);

    setError("");

    setResult(null);

    if (scanner !== "URL") {
      setError(
        `${scanner} scanning is coming soon. URL scanning is currently available.`
      );
    }

  };
 

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

            <button
  onClick={() => setSelectedScanner("URL")}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition"
>
  <ScanSearch size={18} />
  New Scan
</button>

<button
  onClick={() => setSelectedScanner("MESSAGE")}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition"
>
  <MessageSquareText size={18} />
  Message Scanner
</button>

<button
  onClick={() => setSelectedScanner("EMAIL")}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition"
>
  <Mail size={18} />
  Email Scanner
</button>

           <a
  href="#history"
  onClick={() =>
    document.getElementById("history")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-cyan-400 text-sm transition"
>
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


            <a
              href="#quick-scan"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-3 rounded-lg transition"
            >
              <ScanSearch size={18} />
              Start New Scan
            </a>

          </div>


          {/* STAT CARDS */}

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {[
              {
                label: "TOTAL SCANS",
                value: totalScans,
                icon: ScanSearch,
                change: "This session",
                color: "text-cyan-400",
              },
              {
                label: "THREATS DETECTED",
                value: threatsDetected,
                icon: ShieldAlert,
                change: "Dangerous URLs",
                color: "text-red-400",
              },
              {
                label: "SAFE CONTENT",
                value: safeScans,
                icon: ShieldCheck,
                change: "Safe URL scans",
                color: "text-green-400",
              },
              {
                label: "SUSPICIOUS ITEMS",
                value: suspiciousScans,
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
                LATEST SCAN RISK SCORE
              </p>


              <div className="flex justify-center py-7">

                <div
                  className="relative w-44 h-44 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${riskColor} 0deg ${riskScore * 3.6}deg, #17243A ${riskScore * 3.6}deg 360deg)`,
                  }}
                >

                  <div className="absolute inset-3 rounded-full bg-[#0A1221] flex flex-col items-center justify-center">

                    <span
                      className="text-4xl font-bold"
                      style={{ color: riskColor }}
                    >
                      {riskScore}
                    </span>

                    <span className="text-xs text-gray-500">
                      OUT OF 100
                    </span>

                  </div>

                </div>

              </div>


              <div className="text-center">

                <span
                  className="text-sm font-semibold"
                  style={{
                    color:
                      riskLevel === "Dangerous"
                        ? "#F87171"
                        : riskLevel === "Suspicious"
                        ? "#FACC15"
                        : "#4ADE80",
                  }}
                >
                  {riskLevel === "Not Scanned"
                    ? "NOT SCANNED"
                    : `${riskLevel.toUpperCase()} RISK`}
                </span>


                <p className="text-xs text-gray-600 mt-2">
                  {result
                    ? "Based on the latest URL scan."
                    : "Scan a URL to see its risk score."}
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
                ["Email Analysis Engine", "Active", 93],
                ["Message Detection Engine", "Active", 94],
                ["Risk Analysis Engine", "Active", 95],
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


            {/* SCANNER OPTIONS */}

            <div className="grid sm:grid-cols-3 gap-4">

              {[
                {
                  name: "Scan URL",
                  desc: "Analyze suspicious websites.",
                  icon: Globe,
                  type: "URL",
                },
                {
                  name: "Analyze Email",
                  desc: "Detect phishing attempts.",
                  icon: Mail,
                  type: "EMAIL",
                },
                {
                  name: "Check Message",
                  desc: "Analyze suspicious messages.",
                  icon: MessageSquare,
                  type: "MESSAGE",
                },
              ].map((item) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleScannerSelection(item.type)}
                    className={`text-left border bg-[#0D192B] p-5 rounded-xl transition ${
                      selectedScanner === item.type
                        ? "border-cyan-400"
                        : "border-white/10 hover:border-cyan-400/40"
                    }`}
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


            {/* URL INPUT FORM */}

            {selectedScanner === "URL" && (

              <div
                ref={scannerFormRef}
                className="mt-7 border border-cyan-400/20 bg-[#071323] rounded-xl p-5">

                <div className="flex items-center gap-3 mb-5">

                  <Globe className="text-cyan-400" size={22} />

                  <div>

                    <h4 className="font-semibold">
                      Website Security Scan
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      Enter a website URL to check for basic suspicious patterns.
                    </p>

                  </div>

                </div>


                <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 bg-[#0A1221] border border-white/10 focus:border-cyan-400 outline-none rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600"
                  />


                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-3 rounded-lg transition"
                  >

                    {loading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <ScanSearch size={17} />
                        Scan Now
                      </>
                    )}

                  </button>

                </form>


                {error && (

                  <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">

                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />

                    <p>{error}</p>

                  </div>

                )}

              </div>

            )}

            {/* Message Scanner */}
            {selectedScanner === "MESSAGE" && (

  <div
    ref={scannerFormRef}
    className="mt-7 border border-cyan-400/20 bg-[#071323] rounded-xl p-5"
  >

    {/* HEADER */}

    <div className="flex items-center gap-3 mb-5">

      <MessageSquareText className="text-cyan-400" size={22} />

      <div>
        <h4 className="font-semibold">
          Message Fraud Scan
        </h4>

        <p className="text-xs text-gray-500 mt-1">
          Paste an SMS, WhatsApp message or email text to check for suspicious patterns.
        </p>
      </div>

    </div>

    {/* MESSAGE INPUT */}

    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Paste your suspicious message here..."
      rows={6}
      className="w-full rounded-lg bg-[#0A1221] border border-white/10 p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-y"
    />

    {/* ERROR */}

    {messageError && (
      <div className="mt-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
        {messageError}
      </div>
    )}

    {/* SCAN BUTTON */}

    <button
      onClick={handleMessageScan}
      disabled={messageLoading}
      className="mt-4 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-sm px-6 py-3 rounded-lg transition"
    >

      {messageLoading ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <ScanSearch size={17} />
          Scan Message
        </>
      )}

    </button>

    {/* RESULTS */}

    {messageResult && (

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-5">

        <h5 className="font-semibold mb-3">
          Scan Results
        </h5>

        <p className="text-sm text-gray-300 break-words">
          {messageResult.scannedMessage}
        </p>

        <div className="mt-4 flex flex-wrap gap-6">

          <div>
            <p className="text-xs text-gray-500">
              RISK SCORE
            </p>

            <p className="text-xl font-bold">
              {messageResult.riskScore}/100
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              RISK LEVEL
            </p>

            <p className="font-semibold">
              {messageResult.riskLevel}
            </p>
          </div>

        </div>

        <div className="mt-4">

          <p className="text-sm font-semibold mb-2">
            Reasons
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">

            {messageResult.reasons.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}

          </ul>

        </div>

        <p className="text-xs text-gray-500 mt-4">
          {messageResult.disclaimer}
        </p>

      </div>

    )}

  </div>

)}

{/* Email Scanner UI */}

{/* EMAIL SCANNER */}
{selectedScanner === "EMAIL" && (
  <div className="bg-[#111C2E] border border-white/10 rounded-xl p-6 space-y-5">

    <div>
      <h2 className="text-xl font-semibold text-white">
        Email Fraud Scanner
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Analyze suspicious emails to identify potential phishing and fraud.
      </p>
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Sender Email
      </label>
      <input
        type="email"
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        placeholder="example@email.com"
        className="w-full bg-[#0A1221] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Email Subject
      </label>
      <input
        type="text"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        placeholder="Enter email subject"
        className="w-full bg-[#0A1221] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Email Content
      </label>
      <textarea
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        placeholder="Paste the complete email content here..."
        rows={6}
        className="w-full bg-[#0A1221] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 resize-none"
      />
    </div>

    <button
      onClick={handleEmailScan}
      disabled={emailLoading}
      className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded-lg py-3 transition"
    >
      {emailLoading ? "Analyzing Email..." : "Analyze Email"}
    </button>

    {emailError && (
      <p className="text-red-400 text-sm">{emailError}</p>
    )}

    {emailResult && (
      <div className="bg-[#0A1221] border border-white/10 rounded-lg p-5 space-y-3">

        <h3 className="text-lg font-semibold text-white">
          Email Analysis Results
        </h3>

        <p className="text-gray-300 text-sm">
          Subject: {emailSubject}
        </p>

        <p className="text-white">
          Risk Score: {emailResult.riskScore}/100
        </p>

        <p className="text-white">
          Risk Level: {emailResult.riskLevel}
        </p>

        <div>
          <p className="text-sm text-gray-400 mb-2">Detection Reasons:</p>

          {emailResult.reasons.length > 0 ? (
            emailResult.reasons.map((reason: string, index: number) => (
              <p key={index} className="text-sm text-red-400">
                • {reason}
              </p>
            ))
          ) : (
            <p className="text-sm text-green-400">
              No suspicious indicators detected.
            </p>
          )}
        </div>

        <p className="text-xs text-gray-500">
          {emailResult.disclaimer}
        </p>

      </div>
    )}

  </div>
)}

            {/* SCAN RESULT */}

            {result && (

              <div className="mt-7 border border-white/10 bg-[#071323] rounded-xl p-5">

                <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

                  <div className="flex items-center gap-3">

                    {result.riskLevel === "Dangerous" ? (
                      <XCircle className="text-red-400" size={25} />
                    ) : result.riskLevel === "Suspicious" ? (
                      <AlertTriangle className="text-yellow-400" size={25} />
                    ) : (
                      <CheckCircle2 className="text-green-400" size={25} />
                    )}

                    <div>

                      <h4 className="font-semibold">
                        Scan Completed
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        {result.scannedUrl}
                      </p>

                    </div>

                  </div>


                  <span
                    className={`text-xs font-semibold px-4 py-2 rounded-full ${
                      result.riskLevel === "Dangerous"
                        ? "bg-red-400/10 text-red-400"
                        : result.riskLevel === "Suspicious"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-green-400/10 text-green-400"
                    }`}
                  >
                    {result.riskLevel.toUpperCase()}
                  </span>

                </div>


                <div className="mb-6">

                  <div className="flex justify-between text-sm mb-2">

                    <span className="text-gray-400">
                      Risk Score
                    </span>

                    <span className="font-semibold">
                      {result.riskScore}/100
                    </span>

                  </div>


                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        result.riskLevel === "Dangerous"
                          ? "bg-red-400"
                          : result.riskLevel === "Suspicious"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                      }`}
                      style={{
                        width: `${result.riskScore}%`,
                      }}
                    />

                  </div>

                </div>


                <h5 className="text-sm font-semibold mb-3">
                  Scan Findings
                </h5>


                <div className="space-y-2">

                  {result.reasons.map((reason, index) => (

                    <div key={index} className="flex items-start gap-2 text-xs text-gray-400">

                      <ShieldAlert size={15} className="text-cyan-400 shrink-0" />

                      {reason}

                    </div>

                  ))}

                </div>


                <p className="text-[11px] text-gray-600 mt-5 border-t border-white/10 pt-4">
                  {result.disclaimer ||
                    "This is a basic heuristic check and does not guarantee that a website is safe."}
                </p>

              </div>

            )}

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
                  CURRENT SESSION
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

                {events.length > 0 ? (

                  events.map((event, i) => (

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
                            : event.type === "SUSPICIOUS"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}>
                          {event.type}
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <p className="text-xs text-gray-600">
                    No scan activity yet. Start by scanning a URL.
                  </p>

                )}

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
                    <th className="px-6 py-4">ACTIONS</th>
                  </tr>

                </thead>


                <tbody>
                     {loadingHistory ? (
    <tr>
      <td colSpan={5} className="text-center py-8 text-gray-500">
        Loading scan history...
      </td>
    </tr>
  ) : scanHistory.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center py-8 text-gray-500">
        No scan history available. Start scanning URLs!
      </td>
    </tr>
  ) : (
    scanHistory.map((scan) => (
      <tr
        key={scan.id}
        className="border-t border-white/5 hover:bg-white/[0.02] transition"
      >
        <td className="px-6 py-4 text-sm text-gray-300 break-all">
          {scan.url}
        </td>

        <td className="px-6 py-4 text-sm text-gray-400">
          URL
        </td>

        <td className="px-6 py-4 text-sm text-gray-300">
          {scan.risk_score}/100
        </td>

        <td className="px-6 py-4">
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              scan.risk_level === "Safe"
                ? "bg-green-500/10 text-green-400"
                : scan.risk_level === "Suspicious"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {scan.risk_level}
          </span>
        </td>

        <td className="px-6 py-4 text-xs text-gray-500">
          {new Date(scan.scanned_at).toLocaleString()}
        </td>
        <td className="px-6 py-4 ">
          <button
            onClick={() => handleDeleteScan(scan.id)}
            className="text-red-400 hover:text-red-300 text-xs transition"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  )}

          {messageHistory.map((scan) => (
      <tr
        key={`message-${scan.id}`}
        className="border-t border-white/5 hover:bg-white/[0.02] transition"
      >
        <td className="px-6 py-4 text-sm text-gray-300 break-all">
          {scan.message}
        </td>

        <td className="px-6 py-4 text-sm text-gray-400">
          Message
        </td>

        <td className="px-6 py-4 text-sm text-gray-300">
          {scan.risk_score}/100
        </td>

        <td className="px-6 py-4">
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              scan.risk_level === "Safe"
                ? "bg-green-500/10 text-green-400"
                : scan.risk_level === "Suspicious"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {scan.risk_level}
          </span>
        </td>

        <td className="px-6 py-4 text-xs text-gray-500">
          {new Date(scan.scanned_at).toLocaleString()}
        </td>

        <td className="px-6 py-4 text-xs text-gray-500">
          —
        </td>
      </tr>
    ))}   

        {emailHistory.map((scan) => (
  <tr
    key={`email-${scan.id}`}
    className="border-t border-white/5 hover:bg-white/[0.02] transition"
  >
    <td className="px-6 py-4 text-sm text-white">
      <div>{scan.subject}</div>
      <div className="text-xs text-gray-500">
        {scan.sender_email || "Unknown sender"}
      </div>
    </td>

    <td className="px-6 py-4 text-sm text-gray-400">
      Email
    </td>

    <td className="px-6 py-4 text-sm text-white">
      {scan.risk_score}/100
    </td>

    <td className="px-6 py-4">
      <span
        className={`px-3 py-1 rounded-full text-xs ${
          scan.risk_level === "Safe"
            ? "bg-green-500/10 text-green-400"
            : scan.risk_level === "Suspicious"
            ? "bg-yellow-500/10 text-yellow-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {scan.risk_level}
      </span>
    </td>

    <td className="px-6 py-4 text-sm text-gray-400">
      {new Date(scan.scanned_at).toLocaleString()}
    </td>

    <td className="px-6 py-4 text-sm text-gray-500">
      —
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