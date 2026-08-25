import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import real asset images from the project assets directory for feature columns
import hrTechnology from "@/assets/hr-technology.jpg";
import statutoryCompliance from "@/assets/statutory-compliance-2.jpg";
import financialTaxation from "@/assets/tds-labour.jpg";
import insuranceAdvisory from "@/assets/insurance-advisory.jpg";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import integrateImg from "@/assets/company-registration.jpg";
import gaugeImg from "@/assets/ipr-brand.jpg";
import envelopeImg from "@/assets/team-retreats.jpg";
import webSeoImg from "@/assets/web-seo.jpg";
import integrateHowItWorks from "@/assets/integrate.jpg";
import gaugeHowItWorks from "@/assets/gauge.jpg";
import envelopeHowItWorks from "@/assets/envelope.jpg";

import {
  Calendar,
  CreditCard,
  Receipt,
  BarChart3,
  Briefcase,
  ShieldCheck,
  Building2,
  Calculator,
  Laptop,
  Scale,
  HeartPulse,
  Coffee,
  BookOpen,
  CheckSquare,
  Users2,
  Mail,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Shield,
  Layers,
  Star,
  Users,
  Check,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  Eye,
  Lock,
  RotateCcw,
  Smartphone,
  MapPin,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface DetailProps {
  currentPath: string;
  onNavigate: (page: string) => void;
}

// ----------------- DYNAMIC HIGH-FIDELITY CLONE MOCKUPS IN CSS -----------------

// Mockup 1: Leave Management Smartphone & Cards (exact clone)
function LeaveManagementHeroMockup() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-start scale-90 md:scale-100 origin-center">
      {/* Smartphone frame */}
      <div className="relative w-[210px] h-[375px] bg-[#1e1e24] rounded-[36px] p-2.5 border-[5px] border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden shrink-0 z-20">
        <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono pb-1 border-b border-slate-800">
          <span>09:41</span>
          <div className="w-16 h-3 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5"></div>
          <div className="flex gap-1">
            <span>5G</span>
            <div className="w-3.5 h-2 bg-slate-400 rounded-sm"></div>
          </div>
        </div>
        
        <div className="flex-1 py-3 text-left space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-200 tracking-wide">My Leaves</span>
            <span className="text-[7px] text-[#FF5C35] font-bold">Details</span>
          </div>

          {/* Leaf Status rings */}
          <div className="bg-[#2a2a32] p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[7px] font-bold text-emerald-400">
              15.0
            </div>
            <div className="text-[7px] text-slate-300 leading-tight">
              <p className="font-extrabold text-[8px]">Privileged Leaves</p>
              <p className="text-slate-400 mt-0.5">Accrued: 15 | Used: 2.5</p>
            </div>
          </div>

          {/* Application list */}
          <div className="space-y-1.5">
            <h5 className="text-[7px] font-black uppercase text-slate-500 tracking-wider">Leave Applications</h5>
            {[
              { type: "Casual Leave", date: "05-03-23 to 08-03-23", status: "Level 1 Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { type: "Casual Leave", date: "12-02-23 to 12-02-23", status: "Approved", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { type: "Privilege Leave", date: "09-02-23 to 10-02-23", status: "Approved", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
            ].map((app, idx) => (
              <div key={idx} className="p-2 bg-[#25252d] border border-slate-800 rounded-lg flex items-center justify-between text-[7px]">
                <div>
                  <p className="font-extrabold text-slate-200">{app.type}</p>
                  <p className="text-slate-400 mt-0.5">{app.date}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full border text-[6px] font-bold ${app.color}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Plus Action Button */}
        <div className="flex justify-end p-1">
          <button className="w-7 h-7 rounded-full bg-[#FF5C35] text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-[#FF5C35]/30">
            +
          </button>
        </div>
      </div>

      {/* Floating Card 1: Monthly Leave balance table */}
      <div className="absolute left-[130px] top-[15px] w-[230px] bg-white text-slate-800 rounded-[20px] p-4 border border-slate-100 shadow-2xl text-[8px] z-30 transition-all hover:translate-y-[-2px]">
        <h5 className="font-black text-slate-900 mb-2 border-b border-slate-50 pb-1.5">Monthly Leave Balance Details</h5>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100">
              <th className="py-1">Month</th>
              <th className="py-1 text-right">Opening</th>
              <th className="py-1 text-right">Accrued</th>
              <th className="py-1 text-right">Taken</th>
              <th className="py-1 text-right">Ending</th>
            </tr>
          </thead>
          <tbody>
            {[
              { m: "May 2026", o: "64.5", a: "0.0", t: "0.0", e: "64.5" },
              { m: "June 2026", o: "64.5", a: "0.0", t: "0.0", e: "64.5" },
              { m: "July 2026", o: "64.5", a: "0.0", t: "0.0", e: "64.5" }
            ].map((r, idx) => (
              <tr key={idx} className="border-b border-slate-50 text-slate-600">
                <td className="py-1 font-bold">{r.m}</td>
                <td className="py-1 text-right text-rose-500 font-mono">{r.o}</td>
                <td className="py-1 text-right font-mono">{r.a}</td>
                <td className="py-1 text-right font-mono">{r.t}</td>
                <td className="py-1 text-right text-rose-500 font-mono font-bold">{r.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Card 2: Kedar Kadam approval card */}
      <div className="absolute left-[140px] top-[145px] w-[220px] bg-white text-slate-800 rounded-[18px] p-3.5 border border-slate-100 shadow-2xl text-[8px] z-30 transition-all hover:translate-y-[-2px] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black">
            KK
          </div>
          <div>
            <p className="font-black text-slate-900">Kedar Kadam | SC009</p>
            <p className="text-slate-400 mt-0.5">Wed, 29-07-2026 | Half Day: Yes</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            Level 2 Approval Pending
          </span>
          <div className="flex gap-1.5">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2 py-1 rounded">Pending</button>
            <button className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-2 py-1 rounded">Reject</button>
          </div>
        </div>
      </div>

      {/* Floating Card 3: Sunil Mittal approved card */}
      <div className="absolute left-[165px] top-[225px] w-[205px] bg-white text-slate-850 rounded-[18px] p-3 border border-slate-100 shadow-2xl text-[8px] z-30 transition-all hover:translate-y-[-2px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">SM</div>
          <div>
            <p className="font-extrabold text-slate-900">Sunil Mittal | SC021</p>
            <p className="text-slate-400">Fri, 16-06-2026 | Half Day: No</p>
          </div>
        </div>
        <span className="text-[7.5px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-black px-2 py-0.5 rounded-full">
          Approved
        </span>
      </div>

      {/* Floating Card 4: Summary circular widget */}
      <div className="absolute left-[150px] top-[295px] w-[215px] bg-white text-slate-800 rounded-[20px] p-3.5 border border-slate-100 shadow-2xl text-[8px] z-30 transition-all hover:translate-y-[-2px] flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border-[3.5px] border-sky-400 border-t-transparent flex items-center justify-center font-black text-sky-600">
          7.5 Bal
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Opening Balance:</span>
            <span className="font-bold text-slate-700">29.5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Accrued Balance:</span>
            <span className="font-bold text-slate-700">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Leaves Taken:</span>
            <span className="font-bold text-slate-700">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mockup 2: Labour Compliance Cog, Task Cards & Score Cards (exact clone)
function LabourComplianceHeroMockup() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-start scale-90 md:scale-100 origin-center text-slate-800">
      {/* Cog Badge top left */}
      <div className="absolute left-0 top-[20px] w-24 h-24 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-xl z-20 transition-all hover:scale-105">
        <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-primary relative">
          <Building2 className="w-8 h-8 stroke-[1.8]" />
          {/* Floating Calculator element */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow">
            <Calculator className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Task status cards top right */}
      <div className="absolute left-[110px] top-[15px] flex gap-2.5 z-20">
        {[
          { label: "Upcoming", val: "03", bg: "bg-amber-500" },
          { label: "Open", val: "07", bg: "bg-orange-500" },
          { label: "Complete", val: "95", bg: "bg-emerald-500" }
        ].map((item) => (
          <div key={item.label} className="w-[60px] h-[72px] bg-white border border-slate-100 rounded-2xl p-2 text-center shadow-lg transition-all hover:translate-y-[-2px] flex flex-col justify-between">
            <span className="text-[7.5px] uppercase font-extrabold text-slate-400 tracking-wider">{item.label}</span>
            <span className={`text-lg font-black text-white ${item.bg} px-2 py-0.5 rounded-lg inline-block w-fit mx-auto`}>
              {item.val}
            </span>
          </div>
        ))}
      </div>

      {/* Central Score Card left */}
      <div className="absolute left-0 top-[125px] w-[160px] bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-2xl text-center z-20 transition-all hover:translate-y-[-2px]">
        <h5 className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider mb-3">Current Score</h5>
        <div className="w-20 h-20 rounded-full border-[5px] border-emerald-500 border-t-transparent flex items-center justify-center mx-auto mb-3">
          <span className="text-lg font-extrabold text-emerald-600">77%</span>
        </div>
        <p className="text-[8.5px] font-black text-slate-800">Labour Compliance Score</p>
        <p className="text-[7px] text-slate-400 mt-1 font-mono">Submission Date: 02-03-2026</p>
      </div>

      {/* Actions card center */}
      <div className="absolute left-[175px] top-[105px] w-[165px] bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-2xl z-20 transition-all hover:translate-y-[-2px] space-y-3">
        <h5 className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-50 pb-1.5">Labour Auditor Actions</h5>
        <div className="space-y-2 text-[8px] text-slate-600">
          {[
            { label: "View Audit", icon: Eye, color: "text-blue-500 bg-blue-50 border-blue-100" },
            { label: "View Inputs", icon: FileText, color: "text-orange-500 bg-orange-50 border-orange-100" },
            { label: "Lock Audit Cycle", icon: Lock, color: "text-amber-500 bg-amber-50 border-amber-100" }
          ].map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} className="flex items-center gap-2 hover:translate-x-0.5 transition-transform cursor-pointer">
                <span className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 ${act.color}`}>
                  <Icon className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className="font-bold text-slate-800">{act.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overdue Card right */}
      <div className="absolute left-[350px] top-[105px] w-[65px] h-[95px] bg-rose-600 text-white rounded-2xl p-3 flex flex-col justify-between shadow-2xl text-center z-20 transition-all hover:translate-y-[-2px]">
        <span className="text-[7.5px] uppercase font-extrabold text-rose-200 tracking-wider">Overdue</span>
        <span className="text-2xl font-black block">02</span>
        <span className="text-[7px] text-rose-100">Tasks</span>
      </div>

      {/* Bottom reports card */}
      <div className="absolute left-[40px] top-[265px] w-[155px] bg-white rounded-[16px] p-2.5 border border-slate-100 shadow-xl flex items-center gap-2.5 z-20 transition-all hover:translate-y-[-2px] cursor-pointer">
        <span className="w-7 h-7 rounded-xl bg-orange-50 text-[#FF5C35] flex items-center justify-center">
          <Download className="w-4 h-4" />
        </span>
        <div className="text-left text-[8px]">
          <p className="font-black text-slate-900">Labour Audit Reports</p>
          <p className="text-slate-400 mt-0.5">Download Reports</p>
        </div>
      </div>

      {/* Bottom inputs card */}
      <div className="absolute left-[205px] top-[265px] w-[155px] bg-white rounded-[16px] p-2.5 border border-slate-100 shadow-xl flex items-center gap-2.5 z-20 transition-all hover:translate-y-[-2px] cursor-pointer">
        <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <RotateCcw className="w-4 h-4" />
        </span>
        <div className="text-left text-[8px]">
          <p className="font-black text-slate-900">Company Inputs</p>
          <p className="text-slate-400 mt-0.5">Resubmit Inputs</p>
        </div>
      </div>
    </div>
  );
}

// Mockup 3: Active Employees sheet, process controls & charts (exact clone of Payroll)
function PayrollOutsourcingHeroMockup() {
  return (
    <div className="relative w-full h-[400px] flex flex-col justify-between scale-90 md:scale-100 origin-center text-slate-800">
      
      {/* Top Active Employees Table */}
      <div className="w-full bg-white rounded-[24px] border border-slate-100 shadow-2xl p-4 text-[7px] text-left z-20 transition-all hover:translate-y-[-2px]">
        <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-slate-50">
          <div className="flex gap-2">
            <span className="font-black text-slate-900 border-b border-primary pb-0.5">Active Employees</span>
            <span className="text-slate-400 font-bold">FNF Employees</span>
            <span className="text-slate-400 font-bold">Hold Employees</span>
          </div>
          <Search className="w-3 h-3 text-slate-400" />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 font-bold border-b border-slate-100">
              <th className="py-1">Employee Name</th>
              <th className="py-1 text-center">LOP Days</th>
              <th className="py-1 text-center">Variables</th>
              <th className="py-1 text-center">Arrears</th>
              <th className="py-1 text-center">F&F Input</th>
              <th className="py-1 text-center">IT/PT/TDS</th>
              <th className="py-1 text-right">Pre-Payroll</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: "Aastha Jain - E0107", lop: "0.0", v: "A: Rs 0.0\nD: Rs 0", arr: "No Arrears Added", fnf: "00", it: "Unchanged", pre: "A: Rs 0\nD: Rs 0" },
              { n: "Aastha Jain - E0107", lop: "0.0", v: "A: Rs 0.0\nD: Rs 0", arr: "No Arrears Added", fnf: "00", it: "Unchanged", pre: "A: Rs 0\nD: Rs 0" },
              { n: "Aastha Jain - E0107", lop: "0.0", v: "A: Rs 0.0\nD: Rs 0", arr: "No Arrears Added", fnf: "00", it: "Unchanged", pre: "A: Rs 0\nD: Rs 0" }
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-slate-50 text-slate-600 font-medium">
                <td className="py-1.5 font-bold text-slate-800">{row.n}</td>
                <td className="py-1.5 text-center font-mono text-rose-500">{row.lop}</td>
                <td className="py-1.5 text-center font-mono whitespace-pre text-[6px] leading-tight">{row.v}</td>
                <td className="py-1.5 text-center text-slate-400 font-bold">{row.arr}</td>
                <td className="py-1.5 text-center font-mono">{row.fnf}</td>
                <td className="py-1.5 text-center font-mono">{row.it}</td>
                <td className="py-1.5 text-right font-mono text-[6.5px] leading-tight">{row.pre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Middle row: Process checklist + Circular statistics charts */}
      <div className="flex gap-4 z-20">
        
        {/* Left side checklist */}
        <div className="w-[140px] bg-white rounded-[22px] border border-slate-100 shadow-xl p-3.5 text-left transition-all hover:translate-y-[-2px] space-y-2">
          {[
            { label: "View Payroll", ok: true },
            { label: "Re-Run Payroll", ok: false, active: true },
            { label: "Clear Payroll", ok: false },
            { label: "Register", ok: false, fill: true }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded-lg text-[8px] font-black text-center cursor-pointer flex items-center justify-between border ${
                item.fill
                  ? "bg-[#FF5C35] text-white border-primary shadow-sm hover:bg-[#FF5C35]/95"
                  : item.active
                  ? "bg-orange-50/50 text-[#FF5C35] border-orange-100"
                  : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50"
              }`}
            >
              <span>{item.label}</span>
              {item.ok && <Check className="w-3 h-3 text-emerald-500" />}
            </div>
          ))}
        </div>

        {/* Center charts */}
        <div className="flex-1 bg-white rounded-[22px] border border-slate-100 shadow-xl p-3.5 text-left transition-all hover:translate-y-[-2px] flex items-center justify-around gap-2">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent flex items-center justify-center font-black text-emerald-600 text-[10px] mx-auto">
              56
            </div>
            <span className="text-[7.5px] text-slate-400 block font-bold mt-1.5">Processed</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent flex items-center justify-center font-black text-rose-600 text-[10px] mx-auto">
              30
            </div>
            <span className="text-[7.5px] text-slate-400 block font-bold mt-1.5">Unprocessed</span>
          </div>
        </div>

        {/* Right side check status list */}
        <div className="w-[140px] flex flex-col gap-2">
          {[
            { label: "Completed Sept 24", desc: "Rs. 17,17,692", ok: true },
            { label: "Incomplete Apr 24", desc: "--", err: true },
            { label: "Pending Sept 24", desc: "--", pending: true }
          ].map((c, idx) => (
            <div
              key={idx}
              className={`p-2 border rounded-xl flex items-center gap-2 text-left transition-all hover:translate-x-0.5 ${
                c.ok
                  ? "bg-emerald-50/30 border-emerald-100 text-emerald-800"
                  : c.err
                  ? "bg-rose-50/30 border-rose-100 text-rose-800"
                  : "bg-amber-50/30 border-amber-100 text-amber-800"
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                c.ok ? "bg-emerald-500 text-white" : c.err ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="text-[7.5px]">
                <p className="font-extrabold">{c.label}</p>
                <p className="text-[7px] text-slate-400 font-mono mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

function renderHeroGraphic(currentPath: string, title: string) {
  if (currentPath === "/products/attendance-leave" || currentPath === "/services/hrms") {
    return <LeaveManagementHeroMockup />;
  }
  if (currentPath === "/services/statutory-compliance") {
    return <LabourComplianceHeroMockup />;
  }
  if (currentPath === "/products/payroll-salary") {
    return <PayrollOutsourcingHeroMockup />;
  }
  // Default mockup
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center flex flex-col justify-center items-center h-[340px] relative overflow-hidden text-slate-800">
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[radial-gradient(#FF5C35_1.5px,transparent_1.5px)] bg-[size:16px_16px]"></div>
      <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 relative z-10 animate-bounce">
        <Sparkles className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h4 className="text-sm font-black text-slate-900 mb-2 relative z-10">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed relative z-10">
        High-fidelity CSS dashboard layouts and interactive components are active. Book a consultation call to review the system panel.
      </p>
    </div>
  );
}

const detailPagesData: Record<
  string,
  {
    heroCategory: string;
    heroHeadline: string;
    heroSubtitle: string;
    heroImage: any;
    trustLogoText: string;
    introParagraph: string;
    features: {
      title: string;
      desc: string;
      featureImage: any;
      bullets: { boldText: string; normalText: string }[];
    }[];
    testimonials: {
      quote: string;
      author: string;
      role: string;
      company: string;
    };
    faqs: { q: string; a: string }[];
  }
> = {
  "/services/hrms": {
    heroCategory: "HRMS & Payroll Suite",
    heroHeadline: "All-in-One HRMS Software: Attendance, Payroll, Expenses & Performance",
    heroSubtitle: "Streamline your entire employee lifecycle. From recruitment and onboarding to geofenced attendance, automated payroll processing, expense tracking, and performance reviews—all integrated into a single unified cloud dashboard.",
    heroImage: hrTechnology,
    trustLogoText: "Powering Operations & Employee Management for 500+ Indian Corporates",
    introParagraph: "Managing multiple fragmented HR tools leads to errors, compliance gaps, and wasted hours. 360 BizHealth's unified HRMS suite brings your team's attendance records, payroll calculators, timesheets, and appraisals under one roof. Automated workflows ensure that field geofenced clock-ins and leave calculations feed directly into your monthly payroll payouts for zero-error salaries.",
    features: [
      {
        title: "Attendance & Leave Management (GPS Tracker)",
        desc: "Ditch manual registers and spreadsheet inputs. Secure real-time shift scheduling, location-bound geofenced clock-ins, biometric integrations, and automated leave approvals.",
        featureImage: heroDashboard,
        bullets: [
          { boldText: "GPS Geofencing", normalText: "Define coordinates to restrict clock-ins to physical offices or verified client sites." },
          { boldText: "Automated Roster Engine", normalText: "Manage rotative schedules, evening shifts, and Factories Act grace periods." },
          { boldText: "Real-time Sync", normalText: "Sync logs from physical biometric devices directly with cloud servers instantly." }
        ]
      },
      {
        title: "Payroll & Salary Processing",
        desc: "Process compliant salaries in under 15 minutes. Automate EPF, ESIC, Professional Tax, and TDS calculations. Generate direct bank transfer files and issue itemized digital payslips.",
        featureImage: financialTaxation,
        bullets: [
          { boldText: "Dual Regime Tax Planner", normalText: "Compare Old vs New Tax Regime calculations on employee portals." },
          { boldText: "Statutory Filing Files", normalText: "Generate government portal-ready files for monthly EPF/ESIC return uploads." },
          { boldText: "Full & Final Settlement", normalText: "Automate calculation of pro-rata payouts, gratuity, and notice period payouts." }
        ]
      },
      {
        title: "Expense Claims & Project Timesheets",
        desc: "Allow employees to submit travel expense bills via smartphone scans. Track billable project hours on visual timesheets, with automated manager approval levels.",
        featureImage: webSeoImg,
        bullets: [
          { boldText: "OCR Receipt Reader", normalText: "Extract date, merchant, and amount details automatically from uploaded receipt photos." },
          { boldText: "Corporate Policy Compliance", normalText: "Alert managers if a submission exceeds predefined category budgets." },
          { boldText: "Salary Integration", normalText: "Flow approved reimbursements directly into the monthly payroll cycle." }
        ]
      },
      {
        title: "Performance Management (PMS)",
        desc: "Align your organization around core metrics. Set clear KPIs, manage quarterly appraisals, and gather 360-degree feedback with simple appraisal forms.",
        featureImage: hrTechnology,
        bullets: [
          { boldText: "Goal Tracking", normalText: "Define key result areas (KRAs) and track performance metrics in real time." },
          { boldText: "Continuous Feedback", normalText: "Enable weekly check-ins and performance reviews between team leads and members." },
          { boldText: "Appraisal Calibration", normalText: "Map appraisal scores directly into compensation revision workflows." }
        ]
      },
      {
        title: "Recruitment & Onboarding",
        desc: "From job postings to digital offer letters. Streamline your hiring pipeline with applicant tracking tools and paperless new hire onboarding.",
        featureImage: integrateImg,
        bullets: [
          { boldText: "Applicant Tracking (ATS)", normalText: "Manage resumes, schedule interviews, and track application stages in one panel." },
          { boldText: "Digital Document Collection", normalText: "Collect PAN, Aadhaar, and education certificates before day one." },
          { boldText: "First-day Integration", normalText: "Auto-create login accounts, email IDs, and attendance profiles upon onboarding approval." }
        ]
      }
    ],
    testimonials: {
      quote: "By consolidating our attendance tracking, expense claims, and payroll processing into 360 BizHealth's HRMS, we eliminated calculation discrepancies entirely and saved 5 working days for our HR team every month.",
      author: "Rajesh Kumar",
      role: "VP of HR Operations",
      company: "Indo Tech Logics"
    },
    faqs: [
      { q: "Is the HRMS system fully integrated with payroll?", a: "Yes, geofenced logs, shift records, leave requests, and approved expense claims all sync automatically to calculate accurate payouts." },
      { q: "Can we buy modules individually or as a bundle?", a: "We offer both options. You can start with attendance tracking and payroll, and easily enable other modules as your team scales." },
      { q: "How secure is employee data on the platform?", a: "We use enterprise-grade bank encryption and strictly adhere to compliance and data protection guidelines in India." }
    ]
  },
  "/products/attendance-leave": {
    heroCategory: "Attendance & Leave Software",
    heroHeadline: "Complete Online Leave Management System & GPS Attendance Tracker",
    heroSubtitle: "Ditch manual registers and Excel sheets. Secure real-time shift scheduling, geofenced mobile clock-ins, and automated leave balance deductions. Seamlessly integrated with payroll to compute accurate LOP calculations.",
    heroImage: hrTechnology,
    trustLogoText: "Automating Daily Shifts & Roster Calendars for 1000+ HR Teams",
    introParagraph: "Managing a hybrid workforce, dynamic factory shifts, and remote sales representatives can lead to major leakage in billing and salary computation. 360 BizHealth's advanced attendance tracker offers real-time geofence checking, biometric scanner integrations, and complex shift cycle parameters. The system automatically computes late check-ins, early exits, overtime hours, and leaves under the Factories Act guidelines, feeding error-free data straight to payroll accounts.",
    features: [
      {
        title: "GPS Geofencing & Location-Bound Mobile Clock-in",
        desc: "Limit where your team members can check-in. Define location boundaries on coordinates to ensure absolute log accuracy. Prevent location spoofing and ensure reporting validity.",
        featureImage: heroDashboard,
        bullets: [
          { boldText: "Precision Geofencing", normalText: "Configure custom geofence radii down to 15 meters for separate office branches." },
          { boldText: "Anti-Location Spoofing", normalText: "Built-in system checks block mock-GPS and location-altering apps automatically." },
          { boldText: "IP Address Restriction", normalText: "Restrict check-ins to authorized office Wi-Fi networks to ensure physical presence." }
        ]
      },
      {
        title: "Factories Act Compliant Shift & Roster Engine",
        desc: "Create and assign unlimited shift configurations, rotative schedules, evening shifts, and night rosters. Automate calculations for grace periods, late-mark salary deductions, and overtime wage files.",
        featureImage: integrateHowItWorks,
        bullets: [
          { boldText: "Shift Rotations", normalText: "Create automated rotation calendars and push instant notifications to employee apps." },
          { boldText: "Overtime Audits", normalText: "Set custom overtime formulas based on working hours, double wages, or compensatory offs." },
          { boldText: "Biometric Integration", normalText: "Sync logs from physical biometric devices directly with cloud servers instantly." }
        ]
      }
    ],
    testimonials: {
      quote: "Our proxy clock-ins dropped to zero, and the HR department saves 4 working days every month because checked logs sync directly with monthly payroll.",
      author: "Prakash Deshmukh",
      role: "VP of People Operations",
      company: "Indo Tech Logics"
    },
    faqs: [
      { q: "How does geofencing work for field sales executives?", a: "For field sales, you can enable custom 'out-of-office client visit' profiles that log check-ins along with Google Map location pins without blocking check-ins." },
      { q: "Can we integrate this with physical biometric hardware?", a: "Yes, our cloud system has pre-configured APIs to sync data from major face scanners, card scanners, and fingerprint machines instantly." }
    ]
  },
  "/products/payroll-salary": {
    heroCategory: "Payroll & Salary Software",
    heroHeadline: "Error-Free Indian Payroll Software with Direct Bank Payouts",
    heroSubtitle: "Automate salary processing, tax planning, statutory deductions, and bonus payouts. Generate direct bank files and distribute digital payslips in less than 15 minutes.",
    heroImage: heroDashboard,
    trustLogoText: "Processing Compliant Salaries for 50,000+ Employees Monthly",
    introParagraph: "Indian payroll involves complex tax declarations, state-specific labor laws, and monthly compliance deadlines. 360 BizHealth's payroll software automates the entire process, including salary revisions, arrears, mid-month joins, and exit payouts. Employees can submit tax declarations and view payslips on their portal, while admins generate compliant bank sheets with a single click.",
    features: [
      {
        title: "Automated Tax Planners & Dual Regime Support",
        desc: "Empower your workforce to plan their taxes while automating TDS calculations based on Central Board of Direct Taxes (CBDT) rules.",
        featureImage: hrTechnology,
        bullets: [
          { boldText: "Dual Regime Comparison", normalText: "Let employees compare tax liabilities under Old vs New Tax Regimes instantly on portals." },
          { boldText: "Investment Declarations", normalText: "Collect investment proofs (Section 80C, 80D, HRA) digitally during tax filing cycles." },
          { boldText: "TDS Auditing", normalText: "Automate monthly TDS calculations to prevent end-of-year tax deductions shocks." }
        ]
      },
      {
        title: "Statutory Deductions & Direct Disbursements",
        desc: "Ensure absolute compliance by auto-deducting state and central shares and generating bank-ready payment logs.",
        featureImage: financialTaxation,
        bullets: [
          { boldText: "Compliance Rules", normalText: "Calculate PF, ESIC, LWF, and Professional Tax shares per State notifications automatically." },
          { boldText: "Direct Payout Files", normalText: "Download banking spreadsheets compatible with major national banking platforms." },
          { boldText: "Downloadable Payslips", normalText: "Send interactive, itemized digital payslips to employee apps immediately." }
        ]
      }
    ],
    testimonials: {
      quote: "Salary processing now takes us less than 15 minutes instead of 3 tense days. Our audit reports are generated instantly.",
      author: "Aditi Sen",
      role: "Head of Finance & Accounts",
      company: "Karta Tech Labs"
    },
    faqs: [
      { q: "Does the payroll software handle mid-month joins and exits?", a: "Yes, the system automatically calculates pro-rata salaries based on working days, mid-month increments, arrears, and full-and-final exit settlements." }
    ]
  },
  "/products/expense-timesheet": {
    heroCategory: "Expense & Timesheet Software",
    heroHeadline: "Digitize Expense Payouts & Track Project Billable Hours",
    heroSubtitle: "Allow team members to upload receipts on the fly via mobile OCR, track timesheet hours for projects, and sync approved claims directly with payroll.",
    heroImage: financialTaxation,
    trustLogoText: "Tracking Billable Hours for Leading Consultants & Tech Agencies",
    introParagraph: "Business travel expenses and project hour allocations can quickly spiral out of control without a centralized tracker. Our software allows employees to capture receipt photos on their smartphones, while managers approve billable hours on visual timesheets. This data is unified with payroll for seamless expense reimbursements.",
    features: [
      {
        title: "OCR Receipt Scanning & Expense Workflows",
        desc: "Convert physical receipt sheets into structured ledger claims paperlessly using advanced computer vision.",
        featureImage: webSeoImg,
        bullets: [
          { boldText: "Automated OCR Reading", normalText: "Auto-capture vendor details, dates, and currency parameters directly from images." },
          { boldText: "Policy Enforcement Caps", normalText: "Alert managers if claims exceed set budgets for travel categories." },
          { boldText: "Consolidated Payouts", normalText: "Approved expenses flow straight to salary registers for single-click payouts." }
        ]
      }
    ],
    testimonials: {
      quote: "Timesheet logging and travel receipts are fully integrated. Out-of-pocket reimbursements take a fraction of the time.",
      author: "Rohan Kapoor",
      role: "Operations Director",
      company: "Stark Business Consulting"
    },
    faqs: [
      { q: "Can we configure different validation rules for travel?", a: "Yes, you can define expense limits by grade, location tier, or project allocations." }
    ]
  },
  "/services/statutory-compliance": {
    heroCategory: "Statutory Compliance Services",
    heroHeadline: "Keep Your Business Protected with Expert Labour Compliance Advisory",
    heroSubtitle: "Outsource PF, ESIC, LWF, Professional Tax, and labor law audits. We manage monthly deposits, handle inspector queries, and keep your business 100% compliant.",
    heroImage: statutoryCompliance,
    trustLogoText: "100% Audit Protection Guaranteed for 500+ Corporate Clients",
    introParagraph: "Failing to comply with central and state labor regulations can lead to hefty penalties, legal notices, and business interruptions. 360 BizHealth's dedicated compliance team manages the entire regulatory cycle. We audit contractor records, calculate monthly PF/ESIC deposits, file timely returns, and represent your business during labor inspections.",
    features: [
      {
        title: "Managed Labour Compliance & Filings",
        desc: "Outsource statutory risk management to experienced compliance specialists and avoid legal notices.",
        featureImage: integrateHowItWorks,
        bullets: [
          { boldText: "Provident Fund (PF) Return Filing", normalText: "Monthly processing and deposit files for PF, ESI, LWF, and Professional Tax." },
          { boldText: "Inspection Liaison", normalText: "Expert legal representation during regional inspections and labor department reviews." },
          { boldText: "Mock Audits", normalText: "Identify vulnerabilities in payroll data, wages, and contractor registries beforehand." }
        ]
      }
    ],
    testimonials: {
      quote: "Our labor compliance audit reports are clean, and mock audit practices keep us fully protected from penalties.",
      author: "Bipin Shah",
      role: "Compliance and Risk Director",
      company: "Apex Warehousing Ltd"
    },
    faqs: [
      { q: "Do you handle local state-level compliance?", a: "Yes, we handle compliance requirements across central and all state-specific notifications." }
    ]
  },
  "/services/company-registration": {
    heroCategory: "Company Registration",
    heroHeadline: "Fast & Professional Company Registration in India",
    heroSubtitle: "Register Private Limited, LLP, Partnership, GST, PAN, TAN, and Startup India licenses. Complete documentation and registry filings under expert guidance.",
    heroImage: integrateImg,
    trustLogoText: "Helping 500+ Startups Establish Legal Foundations Successfully",
    introParagraph: "Starting a new business should be exciting, not bogged down by confusing paperwork and corporate registry regulations. 360 BizHealth makes company incorporation simple. We guide you through digital signature setups, director identification number (DIN) registrations, name approvals, memorandum drafting, and post-incorporation tax registrations.",
    features: [
      {
        title: "End-to-End Incorporation & Licensing",
        desc: "Get corporate registration approvals, tax registrations, and legal licenses processed under one roof.",
        featureImage: gaugeHowItWorks,
        bullets: [
          { boldText: "Company Registration", normalText: "Establish Pvt Ltd, LLP, OPC, or Partnership Deeds with the MCA." },
          { boldText: "Tax Registrations", normalText: "GST returns, PAN/TAN, and MSME registrations." },
          { boldText: "Startup India Setup", normalText: "Obtain DPIIT recognition to claim tax exemptions." }
        ]
      }
    ],
    testimonials: {
      quote: "The team guided us through Memorandum drafts and name approvals in less than 7 days. Excellent customer support.",
      author: "Nitesh Kumar",
      role: "Founder",
      company: "ByteWave Technologies"
    },
    faqs: [
      { q: "How long does it take to register a Private Limited Company?", a: "Typically, MCA approvals, DIN generation, and certificate issuances take between 7 to 10 working days, subject to government processing times." }
    ]
  },
  "/services/group-insurance": {
    heroCategory: "Group Insurance Advisory",
    heroHeadline: "Custom Group Health Insurance & Corporate Benefits",
    heroSubtitle: "Attract and protect talent with group health insurance policies. We negotiate premiums, set up cashless networks, and manage claims for your workforce.",
    heroImage: insuranceAdvisory,
    trustLogoText: "Protecting 20,000+ Employee Lives with Premium Coverages",
    introParagraph: "Offering corporate health benefits is key to attracting top talent and building a secure workforce. We partner with leading insurers to negotiate customized Group Health Insurance, Accidental Coverage, and Term plans. Our team manages cashless hospital network setups, handles new joiner additions, and guides staff through claim settlements.",
    features: [
      {
        title: "Tailored Employee Benefits & Claims Support",
        desc: "Set up cashless health programs, accidental benefits, and critical illness policies at competitive corporate premiums.",
        featureImage: envelopeHowItWorks,
        bullets: [
          { boldText: "Group Health Policy", normalText: "Configure cashless medical insurance for employees and immediate dependents." },
          { boldText: "Accident & Term Plans", normalText: "Secure disability and term plans to protect families." },
          { boldText: "Dedicated Claims Help", normalText: "24/7 support coordinates hospital clearances and reimbursement checks." }
        ]
      }
    ],
    testimonials: {
      quote: "Our cashless medical claims are settled smoothly, and adding new hires takes just a click on our admin panel.",
      author: "Amit Roy",
      role: "HR Director",
      company: "Nova Healthcare Solutions"
    },
    faqs: [
      { q: "What is the minimum team size for group insurance?", a: "Corporate group health policies can be set up for teams as small as 7 to 10 employees." }
    ]
  }
};

interface ToolkitItem {
  title: string;
  desc: string;
  category: "Template" | "Calculator" | "Checklist" | "Guide";
  colorClass: string;
  btnColor: string;
}

const hrToolkitsList: ToolkitItem[] = [
  {
    title: "Gratuity Payout Calculator",
    desc: "Calculate statutory gratuity payouts based on salary components and years of service under the Payment of Gratuity Act 1972.",
    category: "Calculator",
    colorClass: "bg-blue-50 text-blue-600 border-blue-100",
    btnColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "EPF & Pension Compounding Tool",
    desc: "Estimate employee and employer EPF contributions and calculate compound interest accumulations for retirement planning.",
    category: "Calculator",
    colorClass: "bg-blue-50 text-blue-600 border-blue-100",
    btnColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "HRA Exemption Tax Planner",
    desc: "Evaluate HRA tax-exempt limits by inputting basic salary, HRA received, and actual rent paid under Section 10(13A).",
    category: "Calculator",
    colorClass: "bg-blue-50 text-blue-600 border-blue-100",
    btnColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "Standard Employment Offer Letter",
    desc: "Download customizable offer letter templates containing probation, confidentiality, and compensation clauses.",
    category: "Template",
    colorClass: "bg-purple-50 text-purple-600 border-purple-100",
    btnColor: "bg-purple-600 hover:bg-purple-700"
  },
  {
    title: "Employee Non-Disclosure Agreement (NDA)",
    desc: "Secure intellectual property and trade secrets with standard legally vetted confidentiality agreement drafts.",
    category: "Template",
    colorClass: "bg-purple-50 text-purple-600 border-purple-100",
    btnColor: "bg-purple-600 hover:bg-purple-700"
  },
  {
    title: "Monthly Payroll Compliance Check-sheet",
    desc: "Audit monthly deadlines for PF deposits, ESIC contributions, Professional Tax filings, and quarterly TDS returns.",
    category: "Checklist",
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    btnColor: "bg-emerald-600 hover:bg-emerald-700"
  },
  {
    title: "Statutory Labor Audit Register",
    desc: "Keep records aligned for inspector checks. Track contractor lists, overtime registers, and child labor declarations.",
    category: "Checklist",
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    btnColor: "bg-emerald-600 hover:bg-emerald-700"
  },
  {
    title: "Startup India Tax Exemption Guide",
    desc: "Vetted step-by-step guidebook to registering with DPIIT and claiming section 80-IAC tax holidays for startups.",
    category: "Guide",
    colorClass: "bg-amber-50 text-amber-600 border-amber-100",
    btnColor: "bg-amber-600 hover:bg-amber-700"
  }
];

const quikchexFeatureData = [
  {
    title: "Streamlined Onboarding",
    description: "Optimize the onboarding experience with structured tasks, self-onboarding, and first-day essentials",
    image: "https://quikchex.in/wp-content/uploads/2025/08/Streamlined-Onboarding.webp",
    imageAlt: "Streamlined Onboarding",
    imageFirst: true,
    bullets: [
      ["Task Assignments", "Define tasks to guide new hires and internal team members through each onboarding step"],
      ["Self-Onboarding", "Empower employees to complete onboarding steps independently"],
      ["HR Policy Acknowledgement", "Ensure employees review and acknowledge HR policies"],
      ["Automated Tracking", "Monitor completion of onboarding tasks and onboarding processes through a dashboard"]
    ]
  },
  {
    title: "Offboarding Workflow",
    description: "Manage exits with a structured workflow, from separation initiation to exit interviews, for a seamless offboarding process",
    image: "https://quikchex.in/wp-content/uploads/2025/08/Offboarding-Workflow.webp",
    imageAlt: "Offboarding Workflow",
    imageFirst: false,
    bullets: [
      ["Employee Separation Requests", "Enable employees to initiate separation requests through the ESS portal"],
      ["Exit Interviews", "Gather insights through structured exit interviews, facilitating organizational improvements"],
      ["Checklist Management", "Assign tasks to all stakeholders in the exit process for smooth transitions"],
      ["Attrition Analysis", "Define and identify separation reason for each departing employee"]
    ]
  },
  {
    title: "Centralized Employee Database",
    description: "Maintain a complete, secure repository of employee information with customizable fields and document storage",
    image: "https://quikchex.in/wp-content/uploads/2024/11/screely-1732768593425.png",
    imageAlt: "Centralized Employee Database",
    imageFirst: true,
    bullets: [
      ["Customizable Data Fields", "Capture essential employee details unique to your organization’s needs"],
      ["Document Management", "Securely store documents, certificates, and other important records"],
      ["Easy Access & Updates", "Retrieve and update employee information quickly when needed"],
      ["Data Change Requests", "Empower employees to modify their personal information from their ESS portals"]
    ]
  },
  {
    title: "Confirmation Workflow",
    description: "Automate employee confirmation processes, from assessment to final decision-making, for timely confirmations",
    image: "https://quikchex.in/wp-content/uploads/2025/08/Confirmation-Workflow.png",
    imageAlt: "Confirmation Workflow",
    imageFirst: false,
    bullets: [
      ["Customizable Milestones", "Define criteria for employee confirmations based on company policies"],
      ["Confirmation Assessments", "Conduct and record performance assessments for confirmation decisions"],
      ["Automated Reminders", "Notify managers and HR when probation periods are nearing completion"],
      ["Efficient Approvals", "Streamline the approval process for faster decision-making"]
    ]
  },
  {
    title: "Letter Generation & E-Signing",
    description: "Create, manage, and digitally sign employee letters, reducing paperwork and ensuring secure documentation",
    image: "https://quikchex.in/wp-content/uploads/2025/08/Letter-Generation-E-Signing.png",
    imageAlt: "Letter Generation and E-Signing",
    imageFirst: true,
    bullets: [
      ["Customizable Letter Templates", "Generate offer letters, confirmation letters, and more with ease"],
      ["Digital Signing Options", "Enable employees and managers to sign documents electronically"],
      ["Centralized Storage", "Keep a record of all generated and signed documents for easy retrieval"]
    ]
  }
];

const quikchexFaqs = [
  ["Can employees initiate their own separation requests?", "Yes, employees can initiate separation requests directly through their Employee Self-Service (ESS) portal, streamlining the offboarding process and allowing for smoother communication."],
  ["How does the onboarding workflow help new employees settle in?", "The onboarding workflow includes task assignments, self-onboarding options, first-day induction, and an onboarding survey. It also enables new hires to acknowledge HR policies, ensuring a smooth and compliant start to their employment."],
  ["Is it possible to customize the employee master database fields?", "Absolutely! The employee master database allows for customizable data fields, making it easy to capture and organize employee details that are specific to your organization’s needs."],
  ["Can managers track and assess probation completions for employee confirmations?", "Yes, the confirmation workflow includes customizable milestones and an assessment feature, helping managers conduct structured performance assessments to make timely confirmation decisions."],
  ["Does the system support digital signing for employee letters?", "Yes, our module enables digital generation and signing of documents like offer letters and confirmation letters, with centralized storage for secure and easy access to all signed records."],
  ["Are exit interviews part of the offboarding workflow?", "Yes, exit interviews are included as part of the offboarding process to capture valuable insights, allowing HR to gather feedback for continuous improvement."],
  ["Can we manage company-wide and regional policies within the onboarding process?", "Yes, you can assign HR policies within the onboarding workflow, allowing new hires to review and acknowledge relevant company and regional policies during their onboarding process."]
];

const quikchexTestimonials = [
  {
    quote: "The Quikchex HRMS platform has been a valuable addition to our HR processes at IIDE. The employee directory works seamlessly, and the leave process setup is intuitive, helping streamline approvals efficiently. The payroll and attendance management modules have also been reliable and easy, making our HR operations smoother.",
    name: "Anushka Rajani Jhaveri",
    role: "Chief Operating Officer",
    company: "IIDE",
    image: "https://quikchex.in/wp-content/uploads/2024/08/anushka-rajani-150x150.jpg"
  },
  {
    quote: "The user-friendly Quikchex interface has streamlined our processes, saving valuable time. The payroll and attendance system ensures accurate, timely processing. We are particularly impressed with the Mobile App’s attendance capture, eliminating the need for biometric punching. From employee onboarding to performance management, the platform has significantly improved our efficiency. Grateful for the team’s support.",
    name: "Bhavna Manchanda",
    role: "Senior Manager - HR",
    company: "SEED Global Education",
    image: "https://quikchex.in/wp-content/uploads/2024/08/bhavna-Seed-Global-1-150x150.jpeg"
  },
  {
    quote: "It’s been over five years since we started using Quikchex software, and it has proven to be incredibly user-friendly and efficient. The platform has consistently made our processes smoother and more streamlined, contributing significantly to our operational ease.",
    name: "Sneha Gajjar",
    role: "Human Resource – Business Partner",
    company: "Equentia Natural Resources",
    image: "https://quikchex.in/wp-content/uploads/2024/08/1538723131503-150x150.jpg"
  },
  {
    quote: "We have been using Quikchex Payroll and Employee Management Software since 2017. It is very user-friendly, and the support provided by the team on every module, along with the training, is amazing. The GPS-based attendance module has significantly reduced our payroll processing time from 7 days to 1 day. I have recommended this software to many of my HR colleagues.",
    name: "Vilas Desai",
    role: "Head – HR",
    company: "SID Hospitality Pvt Ltd",
    image: "https://quikchex.in/wp-content/uploads/2024/08/Vilas-Desai-150x150.png"
  },
  {
    quote: "Quikchex provides outstanding support, with a highly knowledgeable and personable team that resolves issues promptly and effectively. Their software handles all payroll and HRMS needs seamlessly, allowing the HR team to focus on innovation. Always just a call away, the Quikchex team handles situations efficiently and positively, making it a brilliant solution backed by an exceptional team.",
    name: "Mr. Nilesh Chandole",
    role: "Head HR",
    company: "Waterways Leisure Tourism Private Limited",
    image: "https://quikchex.in/wp-content/uploads/2024/08/nilesh-chandole-150x150.png"
  }
];

function QuikchexFooter({ onNavigate }: { onNavigate: (page: string) => void }) {
  const productLinks = ["HR Software", "Payroll Software", "Attendance Management Software", "Leave Management System", "Expense Management Software", "Performance Management Software", "Recruitment Management Software", "Employee Engagement", "Employee Timesheet Software", "Flexi Benefits"];
  const serviceLinks = ["Payroll Outsourcing", "Labour Compliance Management", "Compliance Audit", "Vendor Audit"];
  const aboutLinks = ["Company Overview", "Partners", "Trust Center", "Plans", "Contact Us"];
  const linkTo = (label: string) => label === "Contact Us" ? "/contact" : "#";

  return (
    <footer className="bg-white pb-8 pt-20 text-[#444444]">
      <div className="quikchex-content-width">
        <div className="quikchex-cta-card mb-20 overflow-hidden rounded-[24px] border border-[#7F7F7F2B] px-6 py-20 text-center">
          <div className="relative z-10 mx-auto max-w-[550px]">
            <h2 className="mx-auto max-w-[540px] text-4xl font-semibold leading-tight text-white md:text-[56px]">Ready to optimize your HR operations?</h2>
            <p className="mx-auto mt-5 max-w-[550px] text-base leading-relaxed text-white">Sign up today and join thousands of businesses that trust our solution to manage their HR and payroll needs efficiently.</p>
            <button onClick={() => onNavigate("/contact")} className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#213343] px-6 py-3.5 text-base text-white transition hover:bg-[#172630]">Book a Demo <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid gap-12 border-b border-slate-200 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
          <div>
            <img src="https://quikchex.in/wp-content/uploads/2024/08/Quikchex-logo.png" alt="Quikchex" className="mb-5 h-10 w-auto object-contain object-left" />
            <h5 className="max-w-[260px] text-base font-normal leading-relaxed text-[#444444]">HRMS, Payroll and Compliance Solutions for India. Modern HR solution for Indian Businesses.</h5>
            <div className="mt-6 h-px max-w-[260px] bg-slate-200" />
          </div>
          <div>
            <h3 className="mb-5 text-base font-semibold text-[#070707]">Products</h3>
            <ul className="space-y-3 text-sm">{productLinks.map((link) => <li key={link}><a href="#" className="hover:text-[#FF5C35]">{link}</a></li>)}</ul>
          </div>
          <div>
            <h3 className="mb-5 text-base font-semibold text-[#070707]">Services</h3>
            <ul className="space-y-3 text-sm">{serviceLinks.map((link) => <li key={link}><a href="#" className="hover:text-[#FF5C35]">{link}</a></li>)}</ul>
          </div>
          <div>
            <h3 className="mb-5 text-base font-semibold text-[#070707]">About Us</h3>
            <ul className="space-y-3 text-sm">{aboutLinks.map((link) => <li key={link}><a href={linkTo(link)} onClick={link === "Contact Us" ? (event) => { event.preventDefault(); onNavigate("/contact"); } : undefined} className="hover:text-[#FF5C35]">{link}</a></li>)}</ul>
            <h3 className="mb-5 mt-8 text-base font-semibold text-[#070707]">Resources</h3>
            <ul className="space-y-3 text-sm"><li><a href="#" className="hover:text-[#FF5C35]">HR Toolkit</a></li><li><a href="#" className="hover:text-[#FF5C35]">Blog</a></li></ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2"><span>© Quikchex 2026.</span><span>All Rights Reserved.</span><a href="https://quikchex.in/terms-and-conditions/" className="hover:text-[#FF5C35]">Terms and conditions</a><a href="https://quikchex.in/privacy-policy/" className="hover:text-[#FF5C35]">Privacy policy</a></div>
          <div className="flex items-center gap-7 text-lg font-semibold text-[#213343]"><a href="https://in.linkedin.com/company/quikchex-private-limited" aria-label="LinkedIn" className="hover:text-[#FF5C35]">in</a><a href="https://x.com/quikchex" aria-label="X" className="hover:text-[#FF5C35]">𝕏</a><a href="https://www.facebook.com/quikchex/" aria-label="Facebook" className="hover:text-[#FF5C35]">f</a></div>
        </div>
      </div>
    </footer>
  );
}

function QuikchexHrmsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonial = quikchexTestimonials[testimonialIndex];

  return (
    <div className="quikchex-page min-h-screen overflow-x-hidden bg-white text-[#444444]">
      <Header onNavigate={onNavigate} />
      <main>
        <section className="quikchex-hero">
          <div className="quikchex-hero-layout">
            <div className="quikchex-hero-copy flex flex-col justify-center text-left">
              <h1 className="max-w-[416px] text-4xl font-normal leading-[1.2] text-white md:text-[44px]">All-in-One HR Software Solution for Modern Businesses</h1>
              <p className="max-w-[480px] pb-10 pt-5 text-base leading-[1.6] text-[#E4E7EB]">Our comprehensive HRMS covers every stage—from onboarding to retirement. It serves as a central repository for all employee data.</p>
              <button onClick={() => onNavigate("/contact")} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FF5C35] px-6 py-3.5 text-base text-white transition hover:bg-[#e94e2c]">Book A Demo <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="quikchex-hero-art"><img src="https://quikchex.in/wp-content/uploads/2025/01/HR-Software-Collage-3-scaled.webp" alt="Quikchex HR software dashboard" /></div>
          </div>
        </section>

        <section className="py-14 text-center">
          <div className="quikchex-content-width">
            <p className="mb-9 text-base text-[#444444]"><strong>Trusted by over 5000+ HR Managers</strong></p>
            <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-3 lg:grid-cols-6 lg:gap-10">
              {["https://quikchex.in/wp-content/uploads/2024/09/Acko_General_Insurance_logo.svg.png", "https://quikchex.in/wp-content/uploads/2024/09/Mad-over-donuts.jpg", "https://quikchex.in/wp-content/uploads/2025/02/crossword_logo_small_2d787591-0993-421e-999c-246295b476c4_small.svg", "https://quikchex.in/wp-content/uploads/2026/06/pittie-group-logo.png", "https://quikchex.in/wp-content/uploads/2024/12/coverfox.png", "https://quikchex.in/wp-content/uploads/2024/09/LogiNext_Logo.png"].map((logo) => <div key={logo} className="flex h-10 items-center justify-center"><img className="h-[70px] w-[130px] object-contain" src={logo} alt="Customer logo" /></div>)}
            </div>
          </div>
        </section>

        <section className="pb-12 pt-8 text-center">
          <div className="quikchex-content-width">
            <h2 className="mx-auto max-w-[665px] text-[28px] font-semibold leading-[1.3] text-[#000000]">Advanced HR Software Features and Integrations</h2>
            <p className="mx-auto max-w-[520px] pb-12 pt-4 text-base leading-[1.6] text-[#444444]">HR Software and Talent Management System Integration. Organize and simplify your employee lifecycle through automated workflows</p>
          </div>
        </section>

        <section>
          <div className="quikchex-content-width">
            {quikchexFeatureData.map((feature) => (
              <div key={feature.title} className={`quikchex-feature-row ${feature.imageFirst ? "" : "flex-row-reverse"}`}>
                <div className="quikchex-feature-visual"><img src={feature.image} alt={feature.imageAlt} /></div>
                <div className="text-left">
                  <h2 className="text-[28px] font-semibold leading-[1.3] text-[#000000]">{feature.title}</h2>
                  <p className="pt-4 text-base leading-[1.6] text-[#444444]">{feature.description}</p>
                  <ul className="space-y-4 pt-6">{feature.bullets.map(([label, text]) => <li key={label} className="flex items-start gap-3 text-base leading-[1.6] text-[#444444]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF5C35]" /><span><strong className="text-[#000000]">{label}:</strong> {text}</span></li>)}</ul>
                  <button onClick={() => onNavigate("/contact")} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#213343] px-[18px] py-[13px] text-base text-white transition hover:bg-[#172630]">Learn More <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[#7F7F7F2B] py-12">
          <div className="quikchex-content-width">
            <div className="quikchex-testimonial-card relative rounded-[24px] px-6 py-10 text-center text-white shadow-[0_6px_12px_-2px_rgba(0,0,0,.04)] md:px-20">
              <span className="inline-flex rounded-full border border-[#FBFBFD12] bg-[#FBFBFD12] px-4 py-1.5 text-sm text-[#FDA29B]">Testimonials</span>
              <h2 className="mt-5 text-[28px] font-semibold text-white">Hear from our users</h2>
              <div className="mt-9 flex items-center justify-between gap-4">
                <button onClick={() => setTestimonialIndex((testimonialIndex - 1 + quikchexTestimonials.length) % quikchexTestimonials.length)} aria-label="Previous testimonial" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" /></button>
                <div className="max-w-[790px]">
                  <p className="text-lg italic leading-[1.6] text-white">“{testimonial.quote}”</p>
                  <div className="mt-7 flex items-center justify-center gap-3"><img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" /><div className="text-left"><p className="text-sm font-semibold text-white">{testimonial.name}</p><p className="text-xs text-white/70">{testimonial.role} · {testimonial.company}</p></div></div>
                </div>
                <button onClick={() => setTestimonialIndex((testimonialIndex + 1) % quikchexTestimonials.length)} aria-label="Next testimonial" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="quikchex-content-width grid gap-12 lg:grid-cols-2">
            <div className="text-left lg:pl-12"><h2 className="max-w-[420px] text-[28px] font-semibold leading-[1.3] text-[#000000]">Frequently asked questions</h2><p className="max-w-[360px] pt-5 text-base leading-[1.6] text-[#444444]">Have any questions? Don’t hesitate to contact us!</p><button onClick={() => onNavigate("/contact")} className="mt-7 rounded-full bg-[#FF5C35] px-6 py-3.5 text-base text-white transition hover:bg-[#e94e2c]">Contact Us</button></div>
            <div className="rounded-xl bg-[#7F7F7F0D] p-4">{quikchexFaqs.map(([question, answer], index) => { const isOpen = faqOpen === index; return <div key={question} className="mb-2.5 rounded-2xl bg-white p-4 last:mb-0"><button onClick={() => setFaqOpen(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-[#000000]"><span>{question}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#A0A0AB7A] text-xl font-normal leading-none text-[#A0A0AB]">{isOpen ? "−" : "+"}</span></button>{isOpen && <p className="mt-1.5 pr-5 text-sm leading-[1.6] text-[#444444]">{answer}</p>}</div>; })}</div>
          </div>
        </section>
      </main>
      <QuikchexFooter onNavigate={onNavigate} />
    </div>
  );
}

// ----------------- RENDER RESOURCE/TOOLKIT GRID LAYOUT -----------------
export default function DetailPage({ currentPath, onNavigate }: DetailProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [toolkitFilter, setToolkitFilter] = useState<string>("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  // Determine if it is a toolkit/resources page
  const isToolkitPage =
    currentPath.startsWith("/resources/") ||
    currentPath.includes("careers") ||
    currentPath.includes("about");

  if (currentPath === "/services/hrms") {
    return <QuikchexHrmsPage onNavigate={onNavigate} />;
  }

  // Fetch Page Data OR Fallback
  const fallbackKey = "/products/attendance-leave";
  const data = detailPagesData[currentPath] || {
    ...detailPagesData[fallbackKey],
    heroCategory: currentPath.split("/").pop()?.replace("-", " ").toUpperCase() || "MANAGED SERVICE",
    heroHeadline: `Expert ${currentPath.split("/").pop()?.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())} Solutions`,
    heroImage: heroDashboard,
    features: [
      {
        title: "Standard Platform Modules",
        desc: "Access cloud dashboards and dedicated operational specialists to automate business tasks.",
        featureImage: hrTechnology,
        bullets: [
          { boldText: "Automated Systems", normalText: "Configure validation checks to ensure records align with regional labor laws." },
          { boldText: "Dedicated Managers", normalText: "Direct support lines to resolve system queries within set SLAs." },
          { boldText: "Downloadable Logs", normalText: "Generate custom compliance spreadsheets and financial audit files." }
        ]
      }
    ]
  };

  // Determine background color of the hero banner based on the route (exact Quikchex colors)
  const getHeroBgColor = (path: string) => {
    if (path === "/products/attendance-leave") return "bg-[#714B67]"; // Plum/wine
    if (path === "/services/hrms") return "bg-[#5D3A6A]"; // Deep Purple/Wine
    if (path === "/services/statutory-compliance") return "bg-[#3D3C5C]"; // Deep navy/slate-blue
    if (path === "/products/payroll-salary") return "bg-[#585754]"; // Charcoal Slate
    if (path === "/products/expense-timesheet") return "bg-[#4F5D75]"; // Steel Blue
    if (path === "/products/performance-management") return "bg-[#3D5A80]"; // Deep Teal Blue
    if (path === "/products/recruitment-onboarding") return "bg-[#2E5F7A]"; // Teal
    return "bg-[#4D4C49]"; // Warm charcoal
  };

  const getToolkitCardClasses = (category: string) => {
    if (category === "Calculator") {
      return {
        cardBg: "bg-[#EDF5FF] border-[#DCE9FF] hover:border-[#1E70E8]/40 hover:shadow-xl hover:shadow-[#1E70E8]/5",
        iconBg: "bg-white text-[#1E70E8] shadow-sm border border-slate-100/50",
        badge: "text-[#1E70E8] border-[#B8D7FF] bg-white",
        button: "bg-[#1E70E8] hover:bg-[#155EC2] shadow-sm shadow-[#1E70E8]/10"
      };
    }
    if (category === "Template") {
      return {
        cardBg: "bg-[#F6EEFF] border-[#EAD3FF] hover:border-[#843AE8]/40 hover:shadow-xl hover:shadow-[#843AE8]/5",
        iconBg: "bg-white text-[#843AE8] shadow-sm border border-slate-100/50",
        badge: "text-[#843AE8] border-[#D1ADFF] bg-white",
        button: "bg-[#843AE8] hover:bg-[#6A28C7] shadow-sm shadow-[#843AE8]/10"
      };
    }
    if (category === "Checklist") {
      return {
        cardBg: "bg-[#EEFBF3] border-[#D2F5DF] hover:border-[#17A55A]/40 hover:shadow-xl hover:shadow-[#17A55A]/5",
        iconBg: "bg-white text-[#17A55A] shadow-sm border border-slate-100/50",
        badge: "text-[#17A55A] border-[#A8ECBE] bg-white",
        button: "bg-[#17A55A] hover:bg-[#0F8444] shadow-sm shadow-[#17A55A]/10"
      };
    }
    // Guide
    return {
      cardBg: "bg-[#FFF6EC] border-[#FFE8CC] hover:border-[#D88A1F]/40 hover:shadow-xl hover:shadow-[#D88A1F]/5",
      iconBg: "bg-white text-[#D88A1F] shadow-sm border border-slate-100/50",
      badge: "text-[#D88A1F] border-[#FFD4A3] bg-white",
      button: "bg-[#D88A1F] hover:bg-[#BF7314] shadow-sm shadow-[#D88A1F]/10"
    };
  };

  const filteredToolkits =
    toolkitFilter === "All"
      ? hrToolkitsList
      : hrToolkitsList.filter((item) => item.category === toolkitFilter);

  // ----------------- RENDER RESOURCE/TOOLKIT GRID LAYOUT -----------------
  if (isToolkitPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-x-hidden">
        <Header onNavigate={onNavigate} />

        <main className="mx-auto max-w-[1180px] px-6 pt-32 pb-14 text-left relative z-10">
          
          {/* Header Description */}
          <div className="max-w-3xl mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF5C35] bg-[#FF5C35]/15 border border-[#FF5C35]/20 px-3 py-1 rounded-full mb-3">
              HR Tools & Resources
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl leading-tight mb-3 animate-fade-in">
              Tools, Calculators & Legal Templates for Daily Operations
            </h1>
            <p className="text-sm text-slate-500 md:text-base leading-relaxed">
              Verify computations, draft legally vetted employee contracts, and stay compliant with central labor guidelines using our curated calculators and toolkit downloads.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 mb-8">
            {["All", "Calculator", "Template", "Checklist", "Guide"].map((filter) => (
              <button
                key={filter}
                onClick={() => setToolkitFilter(filter)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  toolkitFilter === filter
                    ? "bg-slate-900 text-white shadow-md shadow-slate-950/15"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {filter}s
              </button>
            ))}
          </div>

          {/* Toolkit Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-14">
            {filteredToolkits.map((item, idx) => {
              const styles = getToolkitCardClasses(item.category);
              return (
                <div
                  key={idx}
                  className={`border rounded-[28px] p-6 shadow-sm transition-all duration-300 flex flex-col justify-between text-center relative group ${styles.cardBg}`}
                >
                  {/* Visual Icon block */}
                  <div className={`mx-auto w-14 h-14 rounded-[18px] flex items-center justify-center mb-4 relative group-hover:scale-105 transition-transform duration-300 ${styles.iconBg}`}>
                    {item.category === "Calculator" && <Calculator className="w-6.5 h-6.5 stroke-[1.8]" />}
                    {item.category === "Template" && <FileText className="w-6.5 h-6.5 stroke-[1.8]" />}
                    {item.category === "Checklist" && <CheckSquare className="w-6.5 h-6.5 stroke-[1.8]" />}
                    {item.category === "Guide" && <BookOpen className="w-6.5 h-6.5 stroke-[1.8]" />}
                  </div>

                  <div className="flex-1 flex flex-col justify-start">
                    <span className={`w-fit mx-auto text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-full border mb-3 ${styles.badge}`}>
                      {item.category}
                    </span>
                    <h3 className="font-black text-slate-900 text-sm md:text-base mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                  <div>
                    <div className="h-px bg-slate-900/5 mb-4" />
                    <button
                      onClick={() => onNavigate("/contact")}
                      className={`w-full py-3 rounded-full text-white font-bold text-xs transition active:scale-98 cursor-pointer ${styles.button}`}
                    >
                      Access Tool Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="relative rounded-[2rem] p-8 md:p-10 text-center overflow-hidden bg-[#FEF4EA] border border-[#E8DDD3] text-slate-800 shadow-sm flex flex-col items-center gap-4">
            <h3 className="text-xl font-black text-slate-900">Need Custom Tools or Payroll Reconciliations?</h3>
            <p className="text-slate-600 text-xs max-w-xl leading-relaxed">
              We provide enterprise integrations, customized tax-saver calculators, and dedicated compliance audits for companies with 150+ staff.
            </p>
            <button
              onClick={() => onNavigate("/contact")}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C35] text-white font-bold hover:bg-[#FF5C35]/95 transition active:scale-95 text-xs cursor-pointer"
            >
              <span>Speak to Compensation Experts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  // ----------------- RENDER STANDARD DENSE SERVICE/PRODUCT LAYOUT -----------------
  return (
    <div className="min-h-screen bg-white text-slate-800 relative overflow-x-hidden">
      <Header onNavigate={onNavigate} />

      {/* ----------------- DENSE SPLIT HERO (Unique Background colors) ----------------- */}
      <section className={`${getHeroBgColor(currentPath)} text-white pt-40 pb-24 relative overflow-hidden transition-all duration-300`}>
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="mx-auto max-w-[1180px] px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 text-left">
          {/* Left side details */}
          <div className="flex-1 space-y-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF5C35] bg-[#FF5C35]/15 border border-[#FF5C35]/20 px-3.5 py-1 rounded-full">
              {data.heroCategory}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-[48px] leading-[1.1] text-white animate-fade-in">
              {data.heroHeadline}
            </h1>
            <p className="text-base text-slate-200 md:text-lg max-w-xl leading-relaxed">
              {data.heroSubtitle}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate("/contact")}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF5C35] text-white font-bold hover:bg-[#FF5C35]/95 transition active:scale-95 shadow-lg shadow-[#FF5C35]/20 cursor-pointer text-sm"
              >
                <span>Book A Free Consultation</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white" />
                </span>
              </button>
            </div>
          </div>

          {/* Right side: High fidelity CSS mockups (Cloning Quikchex graphics) */}
          <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
            {renderHeroGraphic(currentPath, data.heroHeadline)}
          </div>
        </div>
      </section>

      {/* ----------------- TRUST LOGOS SECTION ----------------- */}
      <section className="bg-slate-50/60 border-y border-slate-100/80 py-8 relative">
        <div className="mx-auto max-w-[1180px] px-6 text-center">
          <p className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 mb-5">
            {data.trustLogoText}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 opacity-45 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center gap-1 font-sans font-black text-slate-500 text-sm tracking-widest">
              <div className="w-4 h-4 bg-slate-500 rounded-sm animate-pulse"></div><span>STRIPE</span>
            </div>
            <div className="flex items-center gap-1 font-sans font-black text-slate-500 text-sm tracking-widest">
              <div className="w-4 h-4 bg-slate-500 rounded-full"></div><span>SLACK</span>
            </div>
            <div className="flex items-center gap-1 font-sans font-black text-slate-500 text-sm tracking-widest">
              <span className="border border-slate-500 px-1 text-[10px] rounded">X</span><span>AIRBNB</span>
            </div>
            <div className="flex items-center gap-1 font-sans font-black text-slate-500 text-sm tracking-widest">
              <div className="w-4 h-4 bg-slate-500 rounded-tr-sm"></div><span>DELOITTE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- DENSE INTRO/SEO PARAGRAPH SECTION ----------------- */}
      <section className="py-12 bg-slate-50/20 text-left relative">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50/50 border border-slate-200/50 rounded-[28px] p-6 md:p-8 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full filter blur-[40px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="max-w-4xl space-y-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C35] bg-[#FF5C35]/10 px-2.5 py-0.5 rounded-full w-fit">
                Strategic Overview
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight md:text-2xl">
                Optimizing operations and mitigating statutory legal risks in India
              </h2>
              <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-medium">
                {data.introParagraph}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- ALTERNATING FEATURES BLOCKS WITH PHOTOS ----------------- */}
      <section className="py-2 bg-white space-y-0">
        {data.features.map((feature, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`py-14 ${isEven ? "bg-white" : "bg-slate-50/40 border-y border-slate-100/50"}`}
            >
              <div
                className={`mx-auto max-w-[1180px] px-6 flex flex-col lg:flex-row items-center gap-10 text-left ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Feature Content Text */}
                <div className="flex-1 space-y-5">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl leading-tight">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="space-y-3 pt-1">
                    {feature.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5">
                        <span className="mt-0.5 w-4.5 h-4.5 rounded-full bg-orange-50 border border-orange-100/80 flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/10">
                          <Check className="w-2.5 h-2.5 text-[#FF5C35] stroke-[2.5]" />
                        </span>
                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                          <strong className="font-bold text-slate-900">{b.boldText}</strong>
                          {b.normalText && `: ${b.normalText}`}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate("/contact")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white font-bold hover:bg-slate-800 transition active:scale-95 text-xs cursor-pointer shadow-sm"
                    >
                      <span>Learn More</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Feature Image (Real Asset Photo) */}
                <div className="flex-1 w-full max-w-[480px] lg:max-w-none">
                  <div className="rounded-[28px] overflow-hidden shadow-lg shadow-slate-200/40 border border-slate-100 relative group h-[260px] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF5C35]/5">
                    <img
                      src={feature.featureImage}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ----------------- TESTIMONIALS SECTION ----------------- */}
      <section className="py-14 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="bg-gradient-to-br from-[#FEF8F4] via-white to-[#FFF5EF] border border-orange-100/50 rounded-[32px] p-8 md:p-12 text-center shadow-[0_8px_30px_-20px_rgba(255,92,53,0.12)] relative overflow-hidden max-w-3xl mx-auto">
            {/* Background huge quotation marks */}
            <span className="absolute -top-10 -left-6 text-[150px] font-serif text-[#FF5C35]/5 select-none pointer-events-none">“</span>
            <span className="absolute -bottom-24 -right-6 text-[150px] font-serif text-[#FF5C35]/5 select-none pointer-events-none">”</span>
            
            <div className="relative z-10 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-black text-[#FF5C35] bg-[#FF5C35]/10 px-3 py-0.5 rounded-full">
                CUSTOMER REVIEWS
              </span>
              <h3 className="text-xl font-black text-slate-900 md:text-2xl">Trusted by HR Managers</h3>
              <blockquote className="text-base md:text-lg font-medium text-slate-755 italic leading-relaxed">
                "{data.testimonials.quote}"
              </blockquote>
              <div className="pt-4 border-t border-orange-100/60 w-1/3 mx-auto">
                <p className="font-extrabold text-slate-900 text-xs md:text-sm">{data.testimonials.author}</p>
                <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                  {data.testimonials.role} — <span className="text-[#FF5C35] font-bold">{data.testimonials.company}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FAQ SECTION (2 Columns) ----------------- */}
      <section className="py-14 bg-slate-50/20 border-t border-slate-100/80">
        <div className="mx-auto max-w-[1180px] px-6 flex flex-col lg:flex-row gap-10 text-left">
          <div className="lg:w-1/3 space-y-4 shrink-0">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Frequently asked questions
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed">
              Find answers to common questions about setup timelines, customized policies, tax declarations, and integrations.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate("/contact")}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:border-slate-350 hover:text-slate-950 font-bold transition active:scale-95 text-xs cursor-pointer"
              >
                Contact Support Team
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3.5">
            {data.faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className={`border rounded-[18px] overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? "bg-[#FEFBF9] border-[#FF5C35]/30 shadow-sm shadow-[#FF5C35]/5" 
                    : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                }`}>
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer focus:outline-none"
                  >
                    <span className={`font-bold text-xs md:text-sm transition-colors duration-200 ${isOpen ? "text-[#FF5C35]" : "text-slate-950"}`}>{faq.q}</span>
                    <span className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${isOpen ? "rotate-180 bg-[#FF5C35] text-white" : "bg-slate-50 text-slate-400"}`}>
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-350 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-slate-100/50 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5 text-xs text-slate-650 leading-relaxed bg-[#FEFBF9]/60">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------- BOTTOM CTA BANNER ----------------- */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="relative rounded-[2.5rem] p-10 md:p-14 text-center overflow-hidden bg-[#FEF4EA] border border-[#E8DDD3] text-slate-800 shadow-sm flex flex-col items-center gap-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[60px] pointer-events-none translate-x-10 -translate-y-10"></div>
            <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

            <span className="text-xs uppercase tracking-wider font-extrabold bg-[#FF5C35]/10 text-[#FF5C35] border border-[#FF5C35]/20 px-3.5 py-1 rounded-full font-bold">
              Ready to Optimize?
            </span>
            <h3 className="text-3xl font-black leading-tight md:text-4xl text-slate-900 max-w-2xl">
              Partner with 360 BizHealth for Error-Free Workflows
            </h3>
            <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
              Automate calculations, eliminate legal compliance risks, and establish premium employee benefits under a single unified dashboard.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate("/contact")}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF5C35] text-white font-bold hover:bg-[#FF5C35]/95 transition active:scale-95 shadow-md shadow-[#FF5C35]/15 cursor-pointer text-sm"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
