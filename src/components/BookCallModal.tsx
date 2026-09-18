import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ChevronDown, X, CheckCircle2 } from "lucide-react";
import logoImg from "@/assets/logo.png";

interface BookCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookCallModal({ open, onOpenChange }: BookCallModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: "",
          email: "",
          countryCode: "+91",
          phone: "",
          company: "",
          service: "",
          message: "",
        });
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[490px] p-0 overflow-visible border-0 bg-transparent shadow-none font-['Poppins'] [&>button:last-child]:hidden">
        
        {/* Outer relative wrapper so close button can float on top corner */}
        <div className="relative w-full">

          {/* Floating circular Close button on top-right corner */}
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="absolute -top-3.5 -right-3.5 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 transition-transform hover:scale-110 cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Main Card with subtle crisp curve (rounded-lg) and zero white border */}
          <div className="w-full bg-[#1F0436] rounded-lg shadow-2xl overflow-hidden border-0">
            
            {/* Top Header Banner Strip - perfectly seamless */}
            <div className="w-full bg-gradient-to-r from-[#1F0436] via-[#350a4e] to-[#FC326C] px-6 py-3 flex items-center text-white select-none">
              <span className="text-sm font-semibold tracking-wide">
                360 Biz Health Consultation
              </span>
            </div>

            {/* Modal Body */}
            <div className="bg-white p-6 sm:p-7">
              {/* Package / Service Summary Header Row */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
            <img
              src={logoImg}
              alt="360 Biz Health"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate leading-tight">
                Corporate HR, Compliance &amp; Benefits
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-700">
                  1-on-1 Expert Advisory
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded">
                  Free Session
                </span>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="py-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">
                Request Received!
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Our enterprise specialist will connect with you at <strong className="text-slate-900">{formData.email || formData.phone}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="mt-6 w-full rounded-lg bg-[#FC326C] hover:bg-[#e0245e] px-4 py-3 text-sm font-semibold text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form Inputs with rounded-md (6px) */
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              
              {/* Full Name */}
              <div>
                <input
                  required
                  type="text"
                  placeholder="Full Name*"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[#FC326C] focus:outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  required
                  type="email"
                  placeholder="Work Email*"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[#FC326C] focus:outline-none transition"
                />
              </div>

              {/* Phone Row with +91 Country Code Box */}
              <div className="flex gap-2">
                <div className="flex items-center justify-between gap-1 w-[88px] px-3 py-3 rounded-md border border-slate-300 bg-slate-50 text-sm font-medium text-slate-700 shrink-0 select-none">
                  <span>+91</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  required
                  type="tel"
                  placeholder="Your Phone*"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[#FC326C] focus:outline-none transition"
                />
              </div>

              {/* 2-Column Row: Company Name + Service Requirement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  placeholder="Company Name*"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[#FC326C] focus:outline-none transition"
                />

                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 focus:border-[#FC326C] focus:outline-none transition cursor-pointer"
                >
                  <option value="" disabled>Select Requirement*</option>
                  <option value="HRMS & Payroll Suite">HRMS &amp; Payroll Suite</option>
                  <option value="Group Health & Benefits">Group Health &amp; Benefits</option>
                  <option value="Statutory & Labour Compliance">Statutory &amp; Labour Compliance</option>
                  <option value="IPR & Brand Protection">IPR &amp; Brand Protection</option>
                  <option value="Corporate Offsites">Corporate Offsites</option>
                </select>
              </div>

              {/* Message Box */}
              <div>
                <textarea
                  rows={3}
                  placeholder="Message / Specific Requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[#FC326C] focus:outline-none transition resize-none"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-[#FC326C] hover:bg-[#e0245e] py-3.5 text-base font-semibold text-white transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-70 active:scale-[0.99]"
                >
                  {isSubmitting ? "Connecting..." : "Connect with an Expert"}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>

      </DialogContent>
    </Dialog>
  );
}

export default BookCallModal;
