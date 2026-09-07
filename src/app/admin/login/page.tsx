type Params = { error?: string };

const MESSAGES: Record<string, string> = {
  invalid: "wrong password.",
  throttled: "too many attempts. wait fifteen minutes.",
  unconfigured: "ADMIN_PASSWORD_HASH is not set on this deployment.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Params> | Params;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center bg-white px-6 text-neutral-900">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-[2rem] font-normal leading-none tracking-tight">
          admin
        </h1>

        {error && (
          <p className="mb-4 text-[15px] text-red-600">
            {MESSAGES[error] ?? "could not sign in."}
          </p>
        )}

        <form
          action="/api/admin/login"
          method="post"
          className="flex items-center gap-2"
        >
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="password"
            className="flex-1 rounded border border-neutral-300 bg-white px-3 py-2 text-[15px] outline-none placeholder:text-neutral-400 focus:border-neutral-500"
          />
          <button
            type="submit"
            className="rounded border border-neutral-300 px-3 py-2 text-[15px] text-neutral-500 transition-colors hover:border-neutral-500 hover:text-neutral-900"
          >
            sign in
          </button>
        </form>
      </div>
    </div>
  );
}
