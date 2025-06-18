import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX } from "react-icons/lu";

export default function ViewPrescription() {
  const router = useRouter();
  const { id } = router.query;
  const { data: prescriptionData, error: prescriptionError } = useSWR(
    id ? `/api/v1/prescriptions?id=${id}` : null,
    authenticatedFetcher,
  );
  const { data: petData, error: petError } = useSWR(
    prescriptionData ? `/api/v1/pets?id=${prescriptionData.pet_id}` : null,
    authenticatedFetcher,
  );

  const handlePrint = () => {
    window.print();
  };

  if (prescriptionError || petError) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">Erro! Falha ao carregar receita.</span>
        </div>
      </div>
    );
  }
  if (!prescriptionData || !petData) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col items-center">
      <div
        id="prescription-content"
        className="bg-white shadow p-6 w-a4 h-a4 mx-auto flex flex-col justify-between print:w-full print:h-full print:bg-white print:shadow-none"
      >
        <div>
          <h1 className="text-2xl font-bold text-center text-primary">
            Clínica Veterinária {process.env.NEXT_PUBLIC_COMPANY_NAME}
          </h1>
          <div className="mb-4">
            <p className="text-base text-center text-gray-600">
              {process.env.NEXT_PUBLIC_VETERINARY} - CRMV N.
              {process.env.NEXT_PUBLIC_CRMV}
            </p>
            <p className="text-sm text-center text-gray-600">
              Endereço: {process.env.NEXT_PUBLIC_ADDRESS}
            </p>
            <p className="text-sm text-center text-gray-600">
              Telefone: {process.env.NEXT_PUBLIC_PHONE} Celular:{" "}
              {process.env.NEXT_PUBLIC_CELL_PHONE}
            </p>
          </div>

          <hr className="mb-4" />
          <div className="flex flex-row justify-between">
            <p>
              <strong>Proprietário:</strong> {prescriptionData.owner_name}
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
              }).format(new Date(prescriptionData.prescription_date))}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p>
              <strong>Animal:</strong> {prescriptionData.pet_name}
            </p>

            <p>
              <strong>Espécie:</strong> {petData.species}
            </p>
          </div>

          <hr className="my-4" />

          <h2 className="text-xl text-primary font-semibold mt-4 mb-6">
            Medicamentos:
          </h2>
          <ul className="list-disc pl-6 space-y-10">
            {prescriptionData.medicines.map((med) => (
              <li key={med.id}>
                <div className="flex flex-row justify-between">
                  <p>
                    <strong>{med.medicine_name}</strong>
                  </p>
                  <p>{med.quantity}</p>
                </div>
                <div>{med.instructions}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Assinatura sempre no rodapé */}
        <div className="mt-auto text-center print:absolute print:bottom-10 print:left-1/2 print:-translate-x-1/2 w-full">
          <p className="italic">Assinatura do Veterinário</p>
          <div className="border-t border-gray-400 w-48 mx-auto mt-2"></div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4 print:hidden">
        <button onClick={handlePrint} className="btn btn-secondary">
          Imprimir
        </button>
        <button
          onClick={() => router.push("/prescriptions")}
          className="btn btn-info"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
