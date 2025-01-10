import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX } from "react-icons/lu";

export default function ViewCustomer() {
  const router = useRouter();
  const { id } = router.query;

  const { data: customerData, error: customerError } = useSWR(
    id ? `/api/v1/customers?id=${id}` : null,
    authenticatedFetcher,
  );

  const { data: petsData, error: petsError } = useSWR(
    id ? `/api/v1/pets?owner_id=${id}` : null,
    authenticatedFetcher,
  );

  if (customerError || petsError) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">
            Erro! Falha ao carregar dados do cliente.
          </span>
        </div>
      </div>
    );
  }
  if (!customerData || !petsData) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Detalhes do Cliente</h1>
      <div className="card bg-base-100 shadow-md p-4 max-w-xl">
        <p>
          <strong>Nome:</strong> {customerData.name}
        </p>
        <p>
          <strong>Gênero:</strong> {customerData.gender || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {customerData.email}
        </p>
        <p>
          <strong>Telefone:</strong> {customerData.phone || "N/A"}
        </p>
        <p>
          <strong>Celular/Whatsapp:</strong> {customerData.cell_phone || "N/A"}
        </p>
        <p>
          <strong>Endereço:</strong> {customerData.address || "N/A"}
        </p>
        <p>
          <strong>Cadastro Ativo?</strong>{" "}
          {customerData.is_active ? "Sim" : "Não"}
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Pets do Cliente</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Espécie</th>
              <th>Gênero</th>
              <th>Idade</th>
            </tr>
          </thead>
          <tbody>
            {petsData.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.species}</td>
                <td>{pet.gender}</td>
                <td>{pet.age || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
