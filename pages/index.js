import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="My personal portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-20">
          <h1 className="text-6xl font-bold">
            Hello, I'm Jane Doe
          </h1>

          <p className="mt-3 text-2xl">
            I'm a software developer based in New York City.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="p-3 m-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              My Work
            </a>
            <a
              href="#"
              className="p-3 m-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-12">
            <Image
              src="/profile-pic.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
          </div>
        </main>
      </div>
    </>
  );
}
