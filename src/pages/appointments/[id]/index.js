import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX } from "react-icons/lu";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function ViewAppointment() {
  const router = useRouter();
  const { id } = router.query;
  const [paymentStatus, setPaymentStatus] = useState("");

  const {
    data: appointmentData,
    error: appointmentError,
    mutate: mutateAppointment,
  } = useSWR(id ? `/api/v1/appointments?id=${id}` : null, authenticatedFetcher);
  const { data: servicesData, error: servicesError } = useSWR(
    id ? `/api/v1/appointment_services?appointment_id=${id}` : null,
    authenticatedFetcher,
  );

  useEffect(() => {
    if (appointmentData) {
      setPaymentStatus(appointmentData.payment_status);
    }
  }, [appointmentData]);

  // Função para atualizar o status de pagamento
  const handlePaymentStatusUpdate = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`/api/v1/appointments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          payment_status: paymentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status de pagamento");
      }

      // Atualiza os dados em cache
      await mutateAppointment();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status de pagamento");
    }
  };

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Atendimento</h1>
      <div className="card bg-base-100 shadow-md p-4 max-w-full">
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
            ? new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
              }).format(new Date(appointmentData.appointment_date))
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
            ? new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
              }).format(new Date(appointmentData.return_date))
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
                <th className="border px-4 py-2">Categoria</th>
                <th className="border px-4 py-2">Preço Unitário</th>
                <th className="border px-4 py-2">Quantidade</th>
                <th className="border px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {servicesData.services.map((service, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {service.service_name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {service.service_category || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    R${parseFloat(service.service_price).toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">{service.quantity ?? 1}</td>
                  <td className="border px-4 py-2">
                    R${parseFloat(service.item_total_price).toFixed(2)}
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

          <div className="max-w-xl mt-6">
            <label className="block text-sm mb-2">Status de Pagamento</label>
            <select
              name="payment_status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="A Pagar">A Pagar</option>
              <option value="Pago em Dinheiro">Pago em Dinheiro</option>
              <option value="Pago no Pix">Pago no Pix</option>
              <option value="Pago no Cartão">Pago no Cartão</option>
            </select>
          </div>
        </div>

        <div className="max-w-xl flex space-x-6">
          <div className="max-w-xl">
            <button
              onClick={handlePaymentStatusUpdate}
              className="btn btn-primary mt-6 text-white w-32"
              disabled={
                !paymentStatus ||
                paymentStatus === appointmentData?.payment_status
              }
            >
              Salvar
            </button>
          </div>
          <div className="max-w-xl">
            <button
              type="button"
              className="btn btn-info mt-6 w-32"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
