import Link from 'next/link';
import React from 'react';

function ErrorPage({ statusCode }) {
  if (statusCode === 404) {
    return <h1>Page not found</h1>;
  }

  return (<div>
  <h1>Something went wrong</h1>
    <Link href="/"/></div>
  );
}

ErrorPage.getInitialProps = ({ err, res }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 500;
  return { statusCode };
};

export default ErrorPage;
