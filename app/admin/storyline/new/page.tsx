import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewJourneyForm from '@/app/components/admin/NewJourneyForm'

export default function NewStorylinePage() {
  return (
    <div className="px-8 py-8">
      <Link href="/admin/storyline" className="mb-6 flex items-center gap-2 text-sm text-blue-slate hover:text-graphite">
        <ArrowLeft size={14} /> Story Line
      </Link>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-metallic-gold">Create trip</p>
        <h1 className="font-serif text-3xl text-graphite">Add a new <span className="italic text-metallic-gold">Story Line journey.</span></h1>
        <p className="mt-1 text-sm text-blue-slate">This writes directly to Supabase and can be published or featured for the public website.</p>
      </div>
      <NewJourneyForm />
    </div>
  )
}
