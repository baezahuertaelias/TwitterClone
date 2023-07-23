import Form from '@/components/Form'
import Header from '@/components/Header'
import PostFeed from '@/components/posts/PostFeed'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
    <Header label="Inicio"/>
    <Form placeholder="Que esta pasando?"/>
    <PostFeed/>
    </>
  )
}
