import { Table, Text } from "@geist-ui/core";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const RecentInvoices = ({ user }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (!user.recentInvoices) return;
    const invoices = user.recentInvoices.map((element) => {
      return {
        date: format(new Date(element.period_start * 1000), "MMM dd, yyyy"),
        number: element.number,
        status:
          element.status.charAt(0).toUpperCase() + element.status.slice(1),
        amountDue: element.amount_due === 0 ? "$0.00" : element.amount_due,
        amountPaid: element.amount_paid === 0 ? "$0.00" : element.amoumt_paid,
        link: element.hosted_invoice_url,
      };
    });
    console.log(invoices);
    setData(invoices);
  }, []);

  const handleRowClick = (rowData) => {
    window.open(rowData.link);
  };

  if (!data) return "";

  return (
    <>
      <Text h3>Recent Invoices</Text>
      <Table data={data} onRow={handleRowClick}>
        <Table.Column label="Date" prop="date"></Table.Column>
        <Table.Column label="Invoice #" prop="number"></Table.Column>
        <Table.Column label="Status" prop="status"></Table.Column>
        <Table.Column label="$ due" prop="amountDue"></Table.Column>
        <Table.Column label="$ paid" prop="amountPaid"></Table.Column>
      </Table>
    </>
  );
};

export default RecentInvoices;
