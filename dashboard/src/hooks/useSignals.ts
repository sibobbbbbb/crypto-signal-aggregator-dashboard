import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Signal } from '../types/signal'

export const useSignals = () => {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Initial Fetch
    const fetchInitial = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setSignals(data as Signal[])
      setLoading(false)
    }

    fetchInitial()

    // 2. Realtime Subscription
    const channel = supabase
      .channel('realtime_signals')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals' }, (payload) => {
        const newSignal = payload.new as Signal
        setSignals((prev) => [newSignal, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { signals, loading }
}