import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import moment from "moment";
import { LuCircleX } from "react-icons/lu";

export default function ViewAppointment() {
  const router = useRouter();
  const { id } = router.query;
  const { data: appointmentData, error: appointmentError } = useSWR(
    id ? `/api/v1/appointments?id=${id}` : null,
    authenticatedFetcher,
  );
  const { data: servicesData, error: servicesError } = useSWR(
    id ? `/api/v1/appointment_services?appointment_id=${id}` : null,
    authenticatedFetcher,
  );

  if (appointmentError || servicesError) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">
            Erro! Falha ao carregar dados do atendimento.
          </span>
        </div>
      </div>
    );
  }

  if (!appointmentData || !servicesData) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Detalhes do Atendimento</h1>
      <div className="card bg-base-100 shadow-md p-4 max-w-xl">
        <p>
          <strong>Proprietário:</strong> {appointmentData.owner_name}
        </p>

        <p>
          <strong>Pet:</strong> {appointmentData.pet_name}
        </p>

        <p>
          <strong>Tipo de Atendimento:</strong>{" "}
          {appointmentData.appointment_type}
        </p>

        <p>
          <strong>Data do Atendimento:</strong>{" "}
          {appointmentData.appointment_date
            ? moment.utc(appointmentData.appointment_date).format("DD/MM/YYYY")
            : "N/A"}
        </p>

        <p>
          <strong>Queixa Principal:</strong> {appointmentData.main_complaint}
        </p>

        <p>
          <strong>Anamnese:</strong> {appointmentData.anamnesis}
        </p>

        <p>
          <strong>Temperatura:</strong> {appointmentData.temperature} °C
        </p>

        <p>
          <strong>Peso:</strong> {appointmentData.weight} Kg
        </p>

        <p>
          <strong>Sistema Neurológico:</strong>{" "}
          {appointmentData.neurological_system}
        </p>

        <p>
          <strong>Sistema Digestório:</strong>{" "}
          {appointmentData.digestive_system}
        </p>

        <p>
          <strong>Sistema Cardiorespiratório:</strong>{" "}
          {appointmentData.cardiorespiratory_system}
        </p>

        <p>
          <strong>Sistema Urinário:</strong> {appointmentData.urinary_system}
        </p>

        <p>
          <strong>Diagnóstico:</strong> {appointmentData.diagnosis}
        </p>

        <p>
          <strong>Observações Adicionais:</strong>{" "}
          {appointmentData.observations}
        </p>

        <p>
          <strong>Data para Retorno:</strong>{" "}
          {appointmentData.return_date
            ? moment.utc(appointmentData.return_date).format("DD/MM/YYYY")
            : "N/A"}
        </p>

        <div className="mt-6">
          <h2 className="text-lg font-bold">Serviços Prestados</h2>
          <table className="table-auto w-full border mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">
                  Materiais, Medicamentos e Serviços
                </th>
                <th className="border px-4 py-2">Preço</th>
                <th className="border px-4 py-2">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {servicesData.services.map((service, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {service.service_name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    R${service.service_price}
                  </td>
                  <td className="border px-4 py-2">
                    {service.service_category || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="stats shadow mt-6">
            <div className="stat">
              <div className="stat-title">Valor total</div>
              <div className="stat-value">
                R${servicesData.total_price.toFixed(2)}
              </div>
            </div>
          </div>
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
    </div>
  );
}
