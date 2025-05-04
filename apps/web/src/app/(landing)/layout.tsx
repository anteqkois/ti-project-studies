interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  // <ReactQueryProvider>
  return (
    <div className="flex min-h-screen flex-col m-t-20">
      {children}
    </div>
  );
  {
    /* </ReactQueryProvider> */
  }
}
