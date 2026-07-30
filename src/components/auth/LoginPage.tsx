'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Compass,
  HelpCircle,
  LogIn,
  Sun,
  Moon,
  ShieldAlert,
  BookOpen
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, theme, setTheme } = useERP();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    // Small timeout for native look and feel
    setTimeout(() => {
      const success = login(email, password);
      setIsSubmitting(false);
      if (!success) {
        setErrorMsg('Invalid login credentials. Please use the demo accounts below for instant access.');
      }
    }, 450);
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      login(demoEmail, demoPass);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#FAF9F6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250 relative overflow-hidden font-sans select-none">
      {/* Absolute Decorative Background Patterns */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Top bar with Theme Switcher */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-[#D97706] border border-amber-500/20">
            <BookOpen className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <h1 className="font-display font-black tracking-tight text-xs sm:text-sm text-slate-900 dark:text-white uppercase">
              ISKCON Retail ERP
            </h1>
            <p className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest">
              Temple Commerce Network
            </p>
          </div>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 transition-colors"
          title="Toggle system theme colors"
          id="btn_theme_toggle_login"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-[460px] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 transition-all relative">
          
          {/* Header Title Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/40 text-[#D97706] border border-amber-200/40 dark:border-amber-900/40 mb-1">
              <Compass className="w-6 h-6 text-[#D97706] animate-spin-slow" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Devotee Staff Portal
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
              Access the Mayapur Central Logistics & POS checkout suite. Secure authentication required.
            </p>
          </div>

          {/* Error Message banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="input_login_email" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input_login_email"
                  type="email"
                  required
                  placeholder="name@aura-retail.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="input_login_password" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Devotee Passcode
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Forgot passcode?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input_login_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-[#111827] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  id="btn_password_toggle"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn_login_submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/15 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection section */}
          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 space-y-3">
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center">
              TEMPLE STAFF DEMO ACCOUNTS
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('store.manager@aura-retail.org', 'radha108')}
                className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/5 dark:hover:bg-amber-500/5 border border-slate-200/60 dark:border-slate-800/60 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-colors flex items-center justify-between"
                id="btn_autofill_manager"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Radha Govinda Das</p>
                  <p className="text-[10px] text-slate-400">Store Manager • Mayapur HQ</p>
                </div>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[9px] font-mono font-bold uppercase">
                  Log In
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('srirama@aura-retail.org', 'ram108')}
                className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-500/5 dark:hover:bg-amber-500/5 border border-slate-200/60 dark:border-slate-800/60 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-colors flex items-center justify-between"
                id="btn_autofill_cashier"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sri Rama Das</p>
                  <p className="text-[10px] text-slate-400">Festival Stall Coordinator</p>
                </div>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[9px] font-mono font-bold uppercase">
                  Log In
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center z-10 text-[10px] text-slate-400 font-mono">
        <p>© 2026 ISKCON Devotional Literature & Books Distribution Society.</p>
        <p className="text-[9px] text-slate-500 mt-1 uppercase">
          SECURED BY SHA-256 DIGITAL LEDGER SIGNATURES
        </p>
      </footer>
    </div>
  );
};
