import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX, LuEye, LuPlus, LuSearch } from "react-icons/lu";

export default function PrescriptionsList() {
  const router = useRouter();
  const { data, error } = useSWR("/api/v1/prescriptions", authenticatedFetcher);
  const [search, setSearch] = useState("");

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">
            Erro! Falha ao buscar receituários.
          </span>
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

  const filteredPrescriptions = data
    .filter((prescription) =>
      prescription.owner_name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort(
      (a, b) => new Date(b.prescription_date) - new Date(a.prescription_date),
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Receituários</h1>
      <div className="flex flex-col md:flex-row max-w-xl">
        <div className="grid flex-grow">
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              placeholder="Buscar pelo proprietário"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow"
            />
            <LuSearch className="text-gray-500" />
          </label>
        </div>
        <div className="grid flex mt-2">
          <button
            onClick={() => router.push(`/prescriptions/new`)}
            className="btn btn-sm btn-accent text-white ml-6"
          >
            <LuPlus />
            Cadastrar Receita
          </button>
        </div>
      </div>
      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Proprietário</th>
            <th>Pet</th>
            <th>Data da Receita</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.map((prescription) => {
            return (
              <tr key={prescription.id}>
                <td>{prescription.owner_name || "Desconhecido"}</td>
                <td>{prescription.pet_name}</td>
                <td>
                  {new Intl.DateTimeFormat("pt-BR", {
                    timeZone: "UTC",
                  }).format(new Date(prescription.prescription_date))}
                </td>
                <td>
                  <button
                    onClick={() =>
                      router.push(`/prescriptions/${prescription.id}`)
                    }
                    className="btn btn-sm btn-default"
                  >
                    <LuEye />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
