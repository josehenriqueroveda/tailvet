import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuX } from "react-icons/lu";

export default function ViewCustomer() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(
    id ? `/api/v1/customers?id=${id}` : null,
    authenticatedFetcher,
  );

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuX className="text-white" />
          <span className="text-white">Erro! Falha ao carregar o cliente.</span>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Customer Details</h1>
      <div className="card bg-base-100 shadow-md p-4 max-w-xl">
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Gender:</strong> {data.gender || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Phone:</strong> {data.phone || "N/A"}
        </p>
        <p>
          <strong>Cell Phone:</strong> {data.cell_phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {data.address || "N/A"}
        </p>
        <p>
          <strong>Active:</strong> {data.is_active ? "Yes" : "No"}
        </p>
      </div>
      <div className="max-w-xl">
        <button
          className="btn btn-info mt-6 w-32"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
