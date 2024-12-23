import Link from "next/link";

export default function Home() {
  return (
    <>
         <h1>Words Filling Game</h1>
   <Link href={{ pathname: '/Game', query: { name: 'easy' } }}>Easy</Link>
      <Link href={{ pathname: '/Game', query: { name: 'med' } }}>Medium</Link>
      <Link href={{ pathname: '/Game', query: { name: 'hard' } }}>Hard</Link>
    </>


  );
}
