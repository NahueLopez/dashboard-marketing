import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { DashboardLayout } from './components/Layout/DashboardLayout'
import { OverviewPage } from './pages/Dashboard/OverviewPage'
import { IntegrationsPage } from './pages/Dashboard/IntegrationsPage'
import { WebMetricsPage } from './pages/Dashboard/WebMetricsPage'
import { Eye, EyeOff } from 'lucide-react'
import { MetricsProvider } from './hooks/useMetrics'
import './index.css'

type AuthMode = 'login' | 'register'
type User = { id: number; name: string; email: string }
type AuthForm = { name: string; email: string; password: string; passwordConfirmation: string }

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8000'

const initialForm: AuthForm = { name: '', email: '', password: '', passwordConfirmation: '' }

async function ensureCsrfCookie() {
  const r = await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, { credentials: 'include', headers: { Accept: 'application/json' } })
  if (!r.ok) throw new Error('Error CSRF cookie')
}

// Extrae una cookie por nombre
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() ?? '');
  return null;
}

export async function apiFetch(path: string, init: RequestInit) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {})
  }

  const xsrf = getCookie('XSRF-TOKEN');
  if (xsrf) {
    headers['X-XSRF-TOKEN'] = xsrf;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers,
    ...init,
  })
}

function App() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [form, setForm] = useState<AuthForm>(initialForm)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => { void loadCurrentUser() }, [])

  async function loadCurrentUser() {
    try {
      const response = await apiFetch('/api/auth/user', { method: 'GET' })
      if (response.status === 401) { setUser(null); return }
      const payload = (await response.json()) as { user: User }
      setUser(payload.user)
    } catch { /* ignored */ }
    finally { setBootstrapping(false) }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await ensureCsrfCookie()
      const isLogin = mode === 'login'
      const response = await apiFetch(isLogin ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(isLogin ? { email: form.email, password: form.password } : { ...form, password_confirmation: form.passwordConfirmation }),
      })
      const payload = (await response.json()) as any

      if (!response.ok) {
        if (payload?.errors) {
          const errorsDict = payload.errors as Record<string, string[]>;
          throw new Error(Object.values(errorsDict)[0]?.[0] || 'Validation error');
        }
        throw new Error(payload?.message ?? 'Error inesperado')
      }
      setUser(payload?.user ?? null)
      setForm(initialForm)
    } catch (e: any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  const handleOAuth = async (provider: string) => {
    try {
      const res = await apiFetch(`/api/oauth/${provider}/redirect`, { method: 'GET' })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
    } catch (e) { alert('Error redirecting OAuth') }
  }

  const updateField = (f: keyof AuthForm, v: string) => setForm(c => ({ ...c, [f]: v }))

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error('Logout error', e)
    } finally {
      setUser(null)
    }
  }

  if (bootstrapping) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200">Cargando Naverys...</div>

  // Private Routes Protection Implementation Built-in
  if (user) {
    return (
      <MetricsProvider>
        <DashboardLayout handleLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/metrics" element={<WebMetricsPage />} />
            <Route path="/integrations" element={<IntegrationsPage handleOAuth={handleOAuth} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DashboardLayout>
      </MetricsProvider>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 transition-colors p-4">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Naverys</h1>
          <p className="text-slate-500 dark:text-zinc-400">Marketing Dashboard Panel</p>
        </div>

        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl shadow-blue-900/5">
          <div className="flex gap-2 mb-8 bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg">
            <button className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login' ? 'bg-white dark:bg-zinc-800 shadow text-slate-800 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`} onClick={() => { setMode('login'); setError('') }}>Entrar</button>
            <button className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'register' ? 'bg-white dark:bg-zinc-800 shadow text-slate-800 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`} onClick={() => { setMode('register'); setError('') }}>Registro</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1">Nombre Company</label>
                <input required type="text" className="w-full p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500/50" value={form.name} onChange={e => updateField('name', e.target.value)} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
              <input required type="email" className="w-full p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500/50" value={form.email} onChange={e => updateField('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña <span className="text-red-500">*</span></label>
              <div className="relative">
                <input required type={showPassword ? 'text' : 'password'} className="w-full p-3 pr-10 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500/50" value={form.password} onChange={e => updateField('password', e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
                <div className="relative">
                  <input required type={showConfirmPassword ? 'text' : 'password'} className="w-full p-3 pr-10 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500/50" value={form.passwordConfirmation} onChange={e => updateField('passwordConfirmation', e.target.value)} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>}

            <button disabled={submitting} type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50">
              {submitting ? 'Procesando request...' : mode === 'login' ? 'Conectar Seguro' : 'Crear Cuenta Segura'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
