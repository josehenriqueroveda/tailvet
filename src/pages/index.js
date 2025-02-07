export default function Home() {
  return (
    <div>
      <div className="p-6 text-3xl font-sans font-bold mb-4">
        {process.env.NEXT_PUBLIC_COMPANY_NAME}
      </div>
    </div>
  );
}
