import {Table, Text, Card, Spacer} from '@geist-ui/core';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';

const UpcomingInvoices = ({user}) => {

  const [data, setData] = useState(null)

  useEffect(() => {
    if (!user.upcomingInvoices) return setData('none')
    setData([{date: format(new Date(user.upcomingInvoices.lines.data[0].period.start * 1000), 'MMM dd, yyyy'), amountDue: user.upcomingInvoices.amount_due}])
  },[])

  if (!data) return ''

  return (
    <>
      <Text h3>Upcoming Invoices</Text>
      {user.upcomingInvoices && !user.cancelAtPeriodEnd ? <Table hover={false} data={data}>
        <Table.Column label="Date" prop="date"></Table.Column>
        <Table.Column label="Amount Due" prop="amountDue"></Table.Column>
      </Table> : <Card><Text small type="secondary">You have no upcoming invoices at this time.</Text></Card>}
      <Spacer h={1.5} />
    </>
  )
}

export default UpcomingInvoices;