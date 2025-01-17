import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";

export default function AppointmentDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await fetch(`/api/v1/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch appointment");

        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!appointment) {
    return <p>Atendimento não encontrado.</p>;
  }

  const {
    owner,
    pet,
    appointment_date,
    appointment_type,
    main_complaint,
    anamnesis,
    temperature,
    weight,
    neurological_system,
    digestive_system,
    cardiorespiratory_system,
    urinary_system,
    diagnosis,
    observations,
    return_date,
    extra_services = [],
  } = appointment;

  const totalPrice = extra_services.reduce(
    (total, service) => total + service.price,
    0,
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Atendimento</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-bold">Proprietário</h2>
          <p>{owner?.name || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Pet</h2>
          <p>{pet?.name || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Tipo de Atendimento</h2>
          <p>{appointment_type || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Data do Atendimento</h2>
          <p>
            {appointment_date
              ? moment(appointment_date).format("DD/MM/YYYY")
              : "Não informado"}
          </p>
        </div>

        <div>
          <h2 className="font-bold">Queixa Principal</h2>
          <p>{main_complaint || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Anamnese</h2>
          <p>{anamnesis || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Temperatura</h2>
          <p>{temperature ? `${temperature} °C` : "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Peso</h2>
          <p>{weight ? `${weight} kg` : "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Sistema Neurológico</h2>
          <p>{neurological_system || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Sistema Digestório</h2>
          <p>{digestive_system || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Sistema Cardiorespiratório</h2>
          <p>{cardiorespiratory_system || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Sistema Urinário</h2>
          <p>{urinary_system || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Diagnóstico</h2>
          <p>{diagnosis || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Observações Adicionais</h2>
          <p>{observations || "Não informado"}</p>
        </div>

        <div>
          <h2 className="font-bold">Data para Retorno</h2>
          <p>
            {return_date
              ? moment(return_date).format("DD/MM/YYYY")
              : "Não informado"}
          </p>
        </div>

        <div>
          <h2 className="font-bold">Serviços Extras</h2>
          {extra_services.length > 0 ? (
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Serviço</th>
                  <th className="border px-4 py-2">Preço</th>
                  <th className="border px-4 py-2">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {extra_services.map((service, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{service.name}</td>
                    <td className="border px-4 py-2">
                      R${service.price.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">{service.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum serviço adicional registrado.</p>
          )}
        </div>

        <div className="stats shadow mt-6">
          <div className="stat">
            <div className="stat-title">Valor Total</div>
            <div className="stat-value">R${totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <button
          onClick={() => router.push("/appointments")}
          className="btn btn-primary mt-6"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
