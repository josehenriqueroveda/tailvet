import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import moment from "moment";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX, LuEye, LuPencil, LuPlus, LuSearch } from "react-icons/lu";

export default function PetsList() {
  const router = useRouter();
  const { data, error } = useSWR("/api/v1/pets", authenticatedFetcher);
  const [search, setSearch] = useState("");

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">Erro! Falha ao buscar pets.</span>
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

  const filteredPets = data
    .filter((pet) =>
      pet.owner_name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.owner_name?.localeCompare(b.owner_name));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pets</h1>
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
            onClick={() => router.push(`/pets/new`)}
            className="btn btn-sm btn-accent text-white ml-6"
          >
            <LuPlus />
            Cadastrar Pet
          </button>
        </div>
      </div>
      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Proprietário</th>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Gênero</th>
            <th>Data de Nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets.map((pet) => {
            return (
              <tr key={pet.id}>
                <td>{pet.owner_name || "Desconhecido"}</td>
                <td>{pet.name}</td>
                <td>{pet.species}</td>
                <td>{pet.gender}</td>
                <td>{moment.utc(pet.birth_date).format("DD/MM/YYYY")}</td>
                <td>
                  <button
                    onClick={() => router.push(`/pets/${pet.id}`)}
                    className="btn btn-sm btn-default"
                  >
                    <LuEye />
                  </button>
                  <button
                    onClick={() => router.push(`/pets/${pet.id}/edit`)}
                    className="btn btn-sm btn-secondary ml-2"
                  >
                    <LuPencil />
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
