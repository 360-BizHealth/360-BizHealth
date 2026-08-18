import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  Plus,
  Minus,
  Sparkles,
  ExternalLink
} from "lucide-react";

const FR = "https://framerusercontent.com/images";
const img = {
  elena: `${FR}/kVI5rNJF2u29dE47wJKBMhBHIVc.png`,
  james: `${FR}/g9u5lc8a7bhRVYmAcLaz2V8Vd0.png`,
  sarah: `${FR}/eqelcmPilFO99lTneGHDJtQO7w.png`,
};

export default function Contact({ onNavigate }: { onNavigate: (page: string) => void }) {
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Accordion State for Contact FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      alert("Please fill in the required fields.");
      return;
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: ""
    });
    setIsSubmitted(false);
  };

  const categories = [
    { label: "General Inquiry", value: "General Inquiry" },
    { label: "Product Demo", value: "Product Demo" },
    { label: "Sales & Pricing", value: "Sales & Pricing" },
    { label: "Partnership", value: "Partnership" },
    { label: "Careers", value: "Careers" }
  ];

  const faqs = [
    {
      q: "How fast does your team respond?",
      a: "Our customer success team average response time is under 10 minutes for active support hours. For general inquiries, we respond within 2 hours."
    },
    {
      q: "Can I request a custom product demo?",
      a: "Absolutely! Choose the 'Product Demo' category chip above, fill out the form, and our sales team will reach out to schedule a live, personalized walkthrough of the 360 BizHealth platform."
    },
    {
      q: "Do you offer customizable enterprise pricing?",
      a: "Yes! For larger teams and organizations (100+ employees), we offer flexible custom SLAs, dedicated account managers, and tailor-made pricing configurations to fit your exact budget and scale."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-slate-800 relative overflow-x-hidden">
      <Header onNavigate={onNavigate} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 top-0 h-[600px] pointer-events-none opacity-45 bg-[linear-gradient(to_right,#E8DDD3_1px,transparent_1px),linear-gradient(to_bottom,#E8DDD3_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Decorative Orbs */}
      <div className="absolute top-28 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-96 right-0 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <main className="relative mx-auto max-w-[1180px] px-6 pt-32 pb-24 z-10">

        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect with 360 BizHealth</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 leading-tight">
            Let's Start a <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Conversation</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-500">
            Have questions about our HR software, statutory compliance, or need advisory services? Get in touch and see how we can assist you.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">

          {/* Left Column: Contact Cards & Map */}
          <div className="lg:col-span-5 space-y-6">

            {/* Info Cards */}
            <div className="space-y-4">

              {/* Online Support Card */}
              <div className="rounded-3xl border border-[#E8DDD3] bg-gradient-to-br from-white to-[#FEF4EA]/40 p-6 shadow-sm flex items-center justify-between transition-transform duration-300 hover:scale-[1.01]">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img src={img.sarah} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" alt="Sarah" />
                    <img src={img.james} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" alt="James" />
                    <img src={img.elena} className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" alt="Elena" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Support Team is Online
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Average response: under 10 minutes</p>
                  </div>
                </div>
              </div>

              {/* Card 1: Email */}
              <div className="group rounded-3xl border border-[#E8DDD3] bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Email Our Team</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Direct query and custom cases</p>
                  <div className="mt-2.5 space-y-1">
                    <a href="mailto:360bizhealth@gmail.com" className="text-sm font-semibold text-primary hover:underline block">
                      360bizhealth@gmail.com
                    </a>
                    <a href="mailto:info@360bizhealth.io" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors block">
                      info@360bizhealth.io
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Call */}
              <div className="group rounded-3xl border border-[#E8DDD3] bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Talk to Support</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Mon–Fri, 9am–6pm IST</p>
                  <a href="tel:+911145678910" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors mt-2 block">
                    +91 (11) 4567-8910
                  </a>
                </div>
              </div>

              {/* Card 3: Visit */}
              <div className="group rounded-3xl border border-[#E8DDD3] bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Support Hours</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Always here to help you scale</p>
                  <p className="text-sm font-semibold text-slate-700 mt-2">
                    24/7 Monitoring & Emergency Support
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Interactive Location Map Card */}
            <div className="rounded-3xl border border-[#E8DDD3] bg-white p-6 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-slate-900">Headquarters</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Connaught+Place+New+Delhi+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View on Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 relative bg-slate-100">
                <iframe
                  title="360 BizHealth Headquarters Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.272201924844!2d77.206584!3d28.627393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5d3450fdfd%3A0x6b1f2edbc6d93425!2sConnaught+Place%2C+New+Delhi%2C+Delhi+110001!5e0!3m2!1sen!2sin!4v1580000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  className="grayscale contrast-[1.1] opacity-95 hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs font-semibold text-slate-800">360 BizHealth Office</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Connaught Place, Business District, New Delhi, India</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form & FAQs */}
          <div className="lg:col-span-7 space-y-10">

            {/* Form Card */}
            <div className="rounded-3xl border border-[#E8DDD3] bg-white p-8 md:p-10 shadow-sm relative min-h-[520px] flex flex-col justify-center transition-all duration-300">

              {!isSubmitted ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-primary" />
                      Send us a message
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Fill out the details below and our experts will reach out to you.</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Category Selector Chips */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                        Inquiry Topic <span className="text-primary">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                          const isSelected = formData.subject === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, subject: cat.value })}
                              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border duration-200 cursor-pointer active:scale-95 ${isSelected
                                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name <span className="text-primary">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full rounded-2xl border border-[#E8DDD3] bg-slate-50/50 px-4 py-3 text-sm outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full rounded-2xl border border-[#E8DDD3] bg-slate-50/50 px-4 py-3 text-sm outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address <span className="text-primary">*</span></label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@company.com"
                          className="w-full rounded-2xl border border-[#E8DDD3] bg-slate-50/50 px-4 py-3 text-sm outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </div>

                    {/* Subject field (visible but automatically populated by chips, editable as well) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject Detail</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Select a topic above or write custom subject..."
                        className="w-full rounded-2xl border border-[#E8DDD3] bg-slate-50/50 px-4 py-3 text-sm outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Message <span className="text-primary">*</span></label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your requirements in detail..."
                        className="w-full rounded-2xl border border-[#E8DDD3] bg-slate-50/50 px-4 py-3 text-sm outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group w-full py-4 text-sm font-bold text-white bg-primary rounded-full hover:bg-primary/95 transition-all shadow-[0_8px_24px_-4px_rgba(255,92,53,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      Send Message
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </>
              ) : (
                /* Interactive Success State */
                <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Message Sent Successfully!</h2>
                  <p className="text-slate-500 mt-3 max-w-md mx-auto">
                    Thank you, <span className="font-bold text-slate-800">{formData.firstName}</span>. Our expert team has received your message and will reach out to you within 10 minutes.
                  </p>

                  <div className="mt-8 pt-8 border-t border-slate-100 max-w-xs mx-auto">
                    <button
                      onClick={handleReset}
                      className="w-full py-3 text-sm font-bold border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer active:scale-95"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Help / Accordion FAQ */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 px-1">Common Questions</h3>

              <div className="space-y-2.5">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="rounded-2xl border border-[#E8DDD3] bg-white overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="text-sm md:text-[15px]">{faq.q}</span>
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-400"}`}>
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3 animate-in fade-in duration-200">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
