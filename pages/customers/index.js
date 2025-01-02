import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { useState } from "react";
import { useRouter } from "next/router";
import { LuEye, LuPencil, LuPlus, LuSearch, LuX } from "react-icons/lu";

export default function CustomersList() {
  const { data, error } = useSWR("/api/v1/customers", authenticatedFetcher);
  const [search, setSearch] = useState("");
  const router = useRouter();

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuX className="text-white" />
          <span className="text-white">Erro! Falha ao buscar clientes.</span>
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

  const filteredCustomers = data
    .filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Clientes</h1>
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
            onClick={() => router.push(`/customers/new`)}
            className="btn btn-sm btn-accent text-white ml-6"
          >
            <LuPlus />
            Cadastrar Cliente
          </button>
        </div>
      </div>

      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Celular/Whatsapp</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.cell_phone}</td>
              <td>
                <button
                  onClick={() => router.push(`/customers/${customer.id}`)}
                  className="btn btn-sm btn-default"
                >
                  <LuEye />
                </button>
                <button
                  onClick={() => router.push(`/customers/${customer.id}/edit`)}
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
