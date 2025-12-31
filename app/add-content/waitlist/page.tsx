/**
 * Waitlist Signups Management Page
 * 
 * View and manage all waitlist signups
 */

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Mail, Phone, Calendar, User } from 'lucide-react'

export default async function WaitlistPage() {
  await assertAdmin()
  const supabase = await createClient()

  const { data: signups, error } = await supabase
    .from('waitlist_signups')
    .select('*')
    .order('signup_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch waitlist signups: ${error.message}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2 cms-text-primary">
            Waitlist Signups
          </h1>
          <p className="text-sm cms-text-secondary">
            View and manage all waitlist signups ({signups?.length || 0} total)
          </p>
        </div>
      </div>

      {signups && signups.length > 0 ? (
        <Card className="cms-card cms-border border">
          <CardHeader>
            <CardTitle className="cms-text-primary" style={{ fontSize: '18px', fontWeight: '600' }}>
              All Signups
            </CardTitle>
            <CardDescription className="cms-text-secondary" style={{ fontSize: '13px' }}>
              Complete list of users who joined the waitlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="cms-border">
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Name
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Email
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Phone
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Age
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Gender
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Looking For
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Status
                    </TableHead>
                    <TableHead 
                      className="whitespace-nowrap cms-text-secondary"
                      style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
                    >
                      Signup Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((signup) => (
                    <TableRow 
                      key={signup.id}
                      className="cms-border"
                    >
                      <TableCell style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 cms-text-secondary" />
                          <span className="cms-text-primary" style={{ fontSize: '13px' }}>
                            {signup.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 cms-text-secondary" />
                          <span className="cms-text-secondary" style={{ fontSize: '13px' }}>
                            {signup.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 cms-text-secondary" />
                          <span className="cms-text-secondary" style={{ fontSize: '13px' }}>
                            {signup.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <Badge 
                          variant="secondary"
                          className="whitespace-nowrap"
                          style={{ 
                            backgroundColor: '#2a2a2a',
                            color: '#ffffff',
                            borderColor: '#3a3a3a',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '4px 10px'
                          }}
                        >
                          {signup.age} years
                        </Badge>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <Badge 
                          variant="secondary"
                          className="whitespace-nowrap"
                          style={{ 
                            backgroundColor: signup.gender === 'Male' ? '#3b82f6' : signup.gender === 'Female' ? '#ec4899' : '#2a2a2a',
                            color: '#ffffff',
                            borderColor: signup.gender === 'Male' ? '#3b82f6' : signup.gender === 'Female' ? '#ec4899' : '#3a3a3a',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '4px 10px'
                          }}
                        >
                          {signup.gender || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <span className="cms-text-secondary" style={{ fontSize: '13px' }}>
                          {signup.looking_for || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <Badge 
                          variant={signup.verified ? 'default' : 'secondary'}
                          className="whitespace-nowrap"
                          style={{ 
                            backgroundColor: signup.verified ? '#10b981' : '#6b7280',
                            color: '#ffffff',
                            borderColor: signup.verified ? '#10b981' : '#6b7280',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '4px 10px'
                          }}
                        >
                          {signup.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ padding: '12px 16px' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 cms-text-secondary" />
                          <span className="cms-text-secondary" style={{ fontSize: '13px' }}>
                            {new Date(signup.signup_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="cms-card cms-border border">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 cms-text-secondary" />
            <p 
              className="mb-2 text-sm font-medium cms-text-primary"
            >
              No waitlist signups yet
            </p>
            <p 
              className="text-xs cms-text-secondary"
            >
              Signups will appear here once users join the waitlist
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

