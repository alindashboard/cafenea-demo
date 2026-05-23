export const dynamic = 'force-dynamic'

import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { AdminShell } from '@/components/admin/AdminShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmFormButton } from '@/components/admin/ConfirmFormButton'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { markContactResolved, deleteContactRequest } from '@/app/admin/actions'
import type { ContactRequest } from '@/types/database'

export default async function DashboardPage() {
  const supabase = createSupabaseAdminClient()

  const { data: contacts } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const safeContacts = (contacts ?? []) as ContactRequest[]
  const unresolvedCount = safeContacts.filter((c) => !c.resolved).length

  return (
    <AdminShell activeSection="dashboard">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mesaje contact</h1>
            {unresolvedCount > 0 && (
              <p className="text-sm text-amber-600 mt-0.5">{unresolvedCount} mesaje nerezolvate</p>
            )}
          </div>
        </div>

        {safeContacts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border rounded-lg bg-white">
            Nu există mesaje de contact.
          </div>
        ) : (
          <div className="space-y-4">
            {safeContacts.map((contact) => {
              const resolve = markContactResolved.bind(null, contact.id)
              const remove = deleteContactRequest.bind(null, contact.id)

              return (
                <div
                  key={contact.id}
                  className={`bg-white rounded-xl border p-5 ${
                    contact.resolved ? 'opacity-60' : 'border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                          {contact.phone}
                        </a>
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="hover:underline">
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={contact.resolved ? 'secondary' : 'default'}>
                        {contact.resolved ? 'Rezolvat' : 'Nou'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(contact.created_at), 'd MMM yyyy, HH:mm', { locale: ro })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 whitespace-pre-wrap">
                    {contact.message}
                  </p>

                  <div className="flex gap-2 mt-3">
                    {!contact.resolved && (
                      <form action={resolve}>
                        <Button type="submit" size="sm" variant="default">
                          ✓ Marchează rezolvat
                        </Button>
                      </form>
                    )}
                    <ConfirmFormButton
                      action={remove}
                      message={`Ștergi mesajul lui ${contact.name}? Acțiune ireversibilă.`}
                    >
                      Șterge
                    </ConfirmFormButton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
