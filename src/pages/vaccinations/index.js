import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX, LuPlus, LuSearch } from "react-icons/lu";

export default function VaccinationsList() {
  const router = useRouter();
  const { data, error } = useSWR("/api/v1/vaccinations", authenticatedFetcher);
  const [search, setSearch] = useState("");

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">Erro! Falha ao buscar vacinações.</span>
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

  const filteredVaccinations = data
    .filter((vaccine) =>
      vaccine.customer_name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort(
      (a, b) => new Date(b.application_date) - new Date(a.application_date),
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Vacinações</h1>
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
            onClick={() => router.push(`/vaccinations/new`)}
            className="btn btn-sm btn-accent text-white ml-6"
          >
            <LuPlus />
            Cadastrar Vacinação
          </button>
        </div>
      </div>
      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Proprietário</th>
            <th>Pet</th>
            <th>Vacina</th>
            <th>Data de Vacinação</th>
            <th>Dose</th>
            <th>Próxima Dose</th>
          </tr>
        </thead>
        <tbody>
          {filteredVaccinations.map((vaccine) => {
            return (
              <tr key={vaccine.id}>
                <td>{vaccine.customer_name || "Desconhecido"}</td>
                <td>{vaccine.pet_name}</td>
                <td>{vaccine.vaccine_name}</td>
                <td>
                  {new Intl.DateTimeFormat("pt-BR", {
                    timeZone: "UTC",
                  }).format(new Date(vaccine.application_date))}
                </td>
                <td>{vaccine.dose}</td>
                <td>
                  {vaccine.next_dose_date
                    ? new Intl.DateTimeFormat("pt-BR", {
                        timeZone: "UTC",
                      }).format(new Date(vaccine.next_dose_date))
                    : "Não Aplicável"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
