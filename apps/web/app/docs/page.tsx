import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Documentation - Next newt',
  description: 'Read the latest documentation and tutorials about Next newt',
};

export default function DocsPage() {
  redirect('/docs/installation');
}
