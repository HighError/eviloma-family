import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className='mx-auto my-10 flex h-screen max-w-md rounded-lg bg-gray-800 p-6 shadow-xl'>
      <div className='ml-6 pt-1'>
        <h1 className='text-center text-4xl font-bold leading-tight text-purple-700'>
          Next.js 13 + Tailwind
        </h1>
        <p className='mb-3 text-center text-base leading-normal text-gray-200'>
          A complete boilerplate for your next project.
        </p>
        <ul>
          <li>Next.js 13 (App routing)</li>
          <li>TypeScript 5.x</li>
          <li>TailWindCSS 3.x</li>
          <li>ESLint</li>
          <li>Prettier</li>
          <li>Husky</li>
          <li>Lint-Staged</li>
        </ul>
        <p className='my-3 text-center text-base leading-normal text-gray-200'>
          Additional modules:
        </p>
        <ul className='text-blue-600 underline duration-300 hover:text-blue-500'>
          <li>
            <Link href='https://www.npmjs.com/package/tailwind-scrollbar'>Tailwind Scrollbar</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
