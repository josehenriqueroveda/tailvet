import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX, LuEye, LuPlus, LuSearch } from "react-icons/lu";

export default function BloodTestsList() {
  const router = useRouter();
  const { data, error } = useSWR("/api/v1/blood_tests", authenticatedFetcher);
  const [search, setSearch] = useState("");

  if (error) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">
            Erro! Falha ao buscar exame de sangue.
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

  const filteredBloodTests = data
    .filter((bloodTest) =>
      bloodTest.owner_name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => new Date(b.test_date) - new Date(a.test_date));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Exames de Sangue</h1>
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

        <div className="flex mt-2">
          <button
            onClick={() => router.push(`/blood-tests/new`)}
            className="btn btn-sm btn-accent text-white ml-6"
          >
            <LuPlus />
            Cadastrar Exame de Sangue
          </button>
        </div>
      </div>
      <table className="table w-full mt-6">
        <thead>
          <tr>
            <th>Proprietário</th>
            <th>Pet</th>
            <th>Data do Exame</th>
            <th>Material</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredBloodTests.map((bloodTest) => {
            return (
              <tr key={bloodTest.id}>
                <td>{bloodTest.owner_name || "Desconhecido"}</td>
                <td>{bloodTest.pet_name}</td>
                <td>{new Date(bloodTest.test_date).toLocaleDateString()}</td>
                <td>{bloodTest.material}</td>
                <td>
                  <button
                    onClick={() => router.push(`/blood-tests/${bloodTest.id}`)}
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
