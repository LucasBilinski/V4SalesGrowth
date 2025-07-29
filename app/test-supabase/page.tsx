'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('🔍 Testando conexão com Supabase...')
      
      // Testar URL e chave
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      console.log('URL:', url)
      console.log('Key:', key ? 'Present' : 'Missing')
      
      const supabase = createClient()
      
      // Testar conexão básica
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('❌ Erro Supabase:', error)
        setResult(`❌ ERRO: ${error.message}`)
      } else {
        console.log('✅ Sucesso Supabase:', data)
        setResult(`✅ CONEXÃO OK! Data: ${JSON.stringify(data)}`)
      }
      
    } catch (err: any) {
      console.error('❌ Erro geral:', err)
      setResult(`❌ ERRO GERAL: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔍 Teste Supabase</h1>
      
      <div className="mb-4">
        <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Missing'}</p>
        <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
      </div>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? 'Testando...' : 'Testar Conexão'}
      </button>
      
      {result && (
        <div className="p-4 bg-gray-800 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  )
}
