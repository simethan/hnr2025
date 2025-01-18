import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          CS Major Cooked-ness Calculator
        </h1>
        <p className="text-xl mb-8">
          Find out how "cooked" you are as a CS major and get suggestions to un-cook yourself!
        </p>
        <div className="flex space-x-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

