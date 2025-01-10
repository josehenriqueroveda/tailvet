import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { useState } from "react";
import { useRouter } from "next/router";
import { LuPencil, LuPlus, LuSearch, LuCircleX } from "react-icons/lu";

export default function ServicesList() {
  const { data, error } = useSWR("/api/v1/services", authenticatedFetcher);
  const [search, setSearch] = useState("");
  const router = useRouter();

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">Erro! Falha ao buscar serviço.</span>
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

  const filteredServices = data
    .filter((service) =>
      service.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Serviços</h1>
      <div className="flex flex-col md:flex-row max-w-xl">
        <div className="grid flex-grow">
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              placeholder="Buscar pelo nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow"
            />
            <LuSearch className="text-gray-500" />
          </label>
        </div>

        <div className="grid flex mt-2">
          <button
            onClick={() => router.push(`/services/new`)}
            className="btn btn-sm btn-accent text-white ml-6"
          >
            <LuPlus />
            Cadastrar Serviço
          </button>
        </div>
      </div>

      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Unidade</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.price}</td>
              <td>{service.amount}</td>
              <td>{service.unit}</td>
              <td>{service.category}</td>
              <td>
                <button
                  onClick={() => router.push(`/services/${service.id}/edit`)}
                  className="btn btn-sm btn-secondary ml-2"
                >
                  <LuPencil />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
