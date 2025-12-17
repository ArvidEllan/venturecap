import { auth } from "@/lib/auth"
import Link from "next/link"
import { signOut } from "@/lib/auth"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              VC Platform
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/resources"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Resources
                </Link>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin/resources"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
                <form action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}>
                  <button
                    type="submit"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

