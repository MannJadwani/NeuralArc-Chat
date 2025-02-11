'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log('Auth submission:', { mode, email, password, name });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0.5)_100%)]" />
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-center text-white p-12 space-y-8">
          <div className="relative w-24 h-24">
            <Image
              src="/logo.png"
              alt="NeuralArc Logo"
              width={96}
              height={96}
              className="rounded-2xl"
              priority
            />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to NeuralArc
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Experience the next generation of AI-powered development assistance
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center space-y-4 mb-8">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="NeuralArc Logo"
                width={64}
                height={64}
                className="rounded-2xl"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to NeuralArc
            </h1>
          </div>

          {/* Auth Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200
                  ${mode === 'signin'
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200
                  ${mode === 'signup'
                    ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-gray-400/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-gray-400/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-gray-400/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 