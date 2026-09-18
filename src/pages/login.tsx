import { useState } from "react";
import logoImg from "@/assets/logo.png";
import {
  ArrowLeft,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Activity
} from "lucide-react";

export default function Login({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Simulate login loader
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirect to home after 1.5s success animation
      setTimeout(() => {
        onNavigate("/");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex relative overflow-hidden w-full">
      
      {/* Back to Home button (floating at top-left, clean white capsule button) */}
      <button
        onClick={() => onNavigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4.5 py-2.5 rounded-full border border-[#E8DDD3] bg-white text-sm font-semibold text-slate-700 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-primary" />
        <span className="text-slate-800 hover:text-primary transition-colors">Back to Home</span>
      </button>

      {/* Main Splitscreen Container */}
      <div className="w-full flex">
        
        {/* Left Side: Brand Showcase (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex lg:w-[42%] bg-[#FEF4EA] p-12 flex-col justify-between relative overflow-hidden border-r border-[#E8DDD3]">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#E8DDD3_1px,transparent_1px),linear-gradient(to_bottom,#E8DDD3_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          {/* Soft primary light blob */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>

          {/* Logo (Standard colorful logo for clean visibility) */}
          <div className="z-10 flex items-center mt-12">
            <img
              src={logoImg}
              alt="360 BizHealth"
              className="h-[60px] w-auto object-contain"
            />
          </div>

          {/* Branding Content */}
          <div className="z-10 my-auto space-y-8 max-w-sm">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-900" style={{ color: '#0f172a' }}>
                Unified. Secure. Reliable.
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Log in to access your organization's centralized workspace. Managed with bank-grade security protocols.
              </p>
            </div>

            {/* Value Proposition Cards in Left Column */}
            <div className="space-y-4 pt-4 border-t border-[#E8DDD3]">
              
              {/* Value 1 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DDD3] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800" style={{ color: '#1e293b' }}>Bank-Grade Security</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">AES-256 encryption and regular compliance auditing.</p>
                </div>
              </div>

              {/* Value 2 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DDD3] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800" style={{ color: '#1e293b' }}>99.99% Uptime Guarantee</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">High-availability cloud infrastructure for your business.</p>
                </div>
              </div>

              {/* Value 3 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E8DDD3] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800" style={{ color: '#1e293b' }}>ISO 27001 Standard</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Highest security protocols for employee & fiscal records.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Info */}
          <div className="z-10 text-xs text-slate-400 font-semibold">
            <p>© {new Date().getFullYear()} 360 BizHealth. Safe & Secure SSO.</p>
          </div>
        </div>

        {/* Right Side: Login Form Panel */}
        <div className="w-full lg:w-[58%] bg-[#FFFBF8] flex items-center justify-center p-6 md:p-12 z-10 relative">
          
          {/* Subtle grid pattern background on right side */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#E8DDD3_1px,transparent_1px),linear-gradient(to_bottom,#E8DDD3_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          {/* Card Login Container */}
          <div className="w-full max-w-[460px] bg-white border border-[#E8DDD3] rounded-3xl p-8 md:p-10 shadow-lg shadow-primary/5 relative z-10 min-h-[500px] flex flex-col justify-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            
            {!isSuccess ? (
              <>
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    Welcome back
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Enter your credentials to access your business dashboard.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition duration-200 hover:border-primary/30 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password <span className="text-primary">*</span>
                      </label>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert("Password reset functionality is under maintenance."); }}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition duration-200 hover:border-primary/30 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Remember Me Option */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        disabled={isLoading}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary/20 h-4 w-4"
                      />
                      <span>Remember this device</span>
                    </label>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full py-3.5 text-sm font-bold text-white bg-primary rounded-full hover:bg-primary/95 transition-all shadow-[0_8px_24px_-4px_rgba(255,92,53,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Divider Line */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3.5 text-slate-400 font-bold tracking-wider">Or continue with</span>
                  </div>
                </div>

                {/* Third Party SSO Buttons */}
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => alert("Google SSO integration is coming soon.")}
                    className="flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 hover:border-primary/20 hover:bg-orange-50/10 rounded-full text-xs font-semibold text-slate-600 transition-colors active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    onClick={() => alert("Microsoft SSO integration is coming soon.")}
                    className="flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 hover:border-primary/20 hover:bg-orange-50/10 rounded-full text-xs font-semibold text-slate-600 transition-colors active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z" />
                      <path fill="#80a300" d="M12 0h11v11H12z" />
                      <path fill="#00a1f1" d="M0 12h11v11H0z" />
                      <path fill="#ffb900" d="M12 12h11v11H12z" />
                    </svg>
                    <span>Microsoft</span>
                  </button>
                </div>

                {/* Link to Contact Support for Registering */}
                <div className="mt-8 text-center text-xs text-slate-500 font-medium">
                  <span>Don't have an enterprise account? </span>
                  <a
                    href="/contact"
                    onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    Contact Support
                  </a>
                </div>
              </>
            ) : (
              /* Success Redirection State */
              <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Signed In Successfully</h2>
                <p className="text-slate-500 mt-3 max-w-sm mx-auto">
                  Preparing your business workspace dashboard...
                </p>
                <div className="mt-6 flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
