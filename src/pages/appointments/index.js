import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX, LuEye, LuPlus, LuSearch } from "react-icons/lu";

export default function AppointmentsList() {
  const router = useRouter();
  const { data, error } = useSWR("/api/v1/appointments", authenticatedFetcher);
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

  const filteredAppointments = data
    .filter((appointment) =>
      appointment.owner_name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.owner_name?.localeCompare(b.owner_name));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Atendimentos</h1>
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
            onClick={() => router.push(`/appointments/new`)}
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
            <th>Tipo de Atendimento</th>
            <th>Data do Atendimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => {
            return (
              <tr key={appointment.id}>
                <td>{appointment.owner_name || "Desconhecido"}</td>
                <td>{appointment.pet_name}</td>
                <td>{appointment.appointment_type}</td>
                <td>
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() =>
                      router.push(`/appointments/${appointment.id}`)
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
