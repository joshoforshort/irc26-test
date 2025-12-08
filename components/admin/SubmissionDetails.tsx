type AdminSubmission = {
  id: string;
  gcCode: string;
  cacheName: string;
  suburb: string;
  state: string;
  difficulty: number;
  terrain: number;
  type: string;
  hiddenDate: string;
  notes: string | null;
  createdAt: string;
  gcUsername: string;
  user: {
    id: string;
    email: string | null;
    gcUsername: string | null;
  } | null;
  pledge: {
    id: string;
    title: string | null;
    gcUsername: string;
    cacheType: string;
    cacheSize: string;
    approxSuburb: string;
    approxState: string;
    status: string;
  } | null;
};

type SubmissionDetailsProps = {
  submission: AdminSubmission;
};

function formatDate(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const badgeBase = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold';

const statusColours: Record<string, string> = {
  CONCEPT: 'bg-yellow-100 text-yellow-800',
  HIDDEN: 'bg-green-100 text-green-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
};

function StatusBadge({ status }: { status: string }) {
  const colours = statusColours[status] || 'bg-slate-100 text-slate-800';
  return (
    <span className={`${badgeBase} ${colours}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`${badgeBase} bg-slate-100 text-slate-800`}>
      {type}
    </span>
  );
}

function SizeBadge({ size }: { size: string }) {
  return (
    <span className={`${badgeBase} bg-slate-100 text-slate-800`}>
      {size}
    </span>
  );
}

export function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Submission Section */}
      <section>
        <h4 className="text-lg font-semibold mb-3">Submission</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <dt className="font-medium text-slate-600 text-sm">GC Code</dt>
            <dd className="text-sm font-mono">{submission.gcCode}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">Cache Name</dt>
            <dd className="text-sm">{submission.cacheName}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">GC Username</dt>
            <dd className="text-sm">{submission.gcUsername}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">D / T</dt>
            <dd className="text-sm">{submission.difficulty} / {submission.terrain}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">Type</dt>
            <dd className="text-sm">
              <TypeBadge type={submission.type} />
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">Hidden Date</dt>
            <dd className="text-sm">{formatDate(submission.hiddenDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">Location</dt>
            <dd className="text-sm">{submission.suburb}, {submission.state}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-600 text-sm">Created At</dt>
            <dd className="text-sm">{formatDate(submission.createdAt)}</dd>
          </div>
          {submission.user?.email && (
            <div>
              <dt className="font-medium text-slate-600 text-sm">User Email (Internal)</dt>
              <dd className="text-sm">{submission.user.email}</dd>
            </div>
          )}
        </dl>

        {submission.notes && (
          <div className="mt-4">
            <dt className="font-medium text-slate-600 text-sm mb-1">Notes</dt>
            <dd className="text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded-md border border-slate-200">
              {submission.notes}
            </dd>
          </div>
        )}
      </section>

      {/* Related Pledge Section */}
      {submission.pledge && (
        <section>
          <h4 className="text-lg font-semibold mb-3">Related Pledge</h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <dt className="font-medium text-slate-600 text-sm">GC Username</dt>
              <dd className="text-sm">{submission.pledge.gcUsername}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-600 text-sm">Title</dt>
              <dd className="text-sm">{submission.pledge.title || 'Untitled'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-600 text-sm">Type</dt>
              <dd className="text-sm">
                <TypeBadge type={submission.pledge.cacheType} />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-600 text-sm">Size</dt>
              <dd className="text-sm">
                <SizeBadge size={submission.pledge.cacheSize} />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-600 text-sm">Location</dt>
              <dd className="text-sm">{submission.pledge.approxSuburb}, {submission.pledge.approxState}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-600 text-sm">Status</dt>
              <dd className="text-sm">
                <StatusBadge status={submission.pledge.status} />
              </dd>
            </div>
          </dl>
        </section>
      )}

      {/* Debug Section (Optional) */}
      <details className="mt-6">
        <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
          Show raw JSON (debug)
        </summary>
        <pre className="mt-2 text-xs overflow-auto bg-slate-50 p-3 rounded-md border border-slate-200">
          {JSON.stringify(submission, null, 2)}
        </pre>
      </details>
    </div>
  );
}


