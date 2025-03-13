import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import { LuCircleX } from "react-icons/lu";

export default function ViewBloodTest() {
  const router = useRouter();
  const { id } = router.query;
  const { data: bloodTestData, error: bloodTestError } = useSWR(
    id ? `/api/v1/blood_tests?id=${id}` : null,
    authenticatedFetcher,
  );

  if (bloodTestError) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">
            Erro! Falha ao carregar dados do exame.
          </span>
        </div>
      </div>
    );
  }

  if (!bloodTestData) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visualizar Exame de Sangue</h1>
      <div className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Proprietário</label>
          <input
            type="text"
            value={bloodTestData.owner_name || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Pet</label>
          <input
            type="text"
            value={bloodTestData.pet_name || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data do Exame</label>
          <input
            type="text"
            value={bloodTestData.test_date || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Material</label>
          <input
            type="text"
            value={bloodTestData.material || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Método</label>
          <input
            type="text"
            value={bloodTestData.method || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div>
          <h2 className="text-xl text-primary font-bold mb-4">ERITROGRAMA</h2>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Eritrócitos</label>
          <input
            type="text"
            value={bloodTestData.erythrocytes || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Hemoglobina</label>
          <input
            type="text"
            value={bloodTestData.hemoglobin || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Hematocrito</label>
          <input
            type="text"
            value={bloodTestData.hematocrit || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">H.C.M.</label>
          <input
            type="text"
            value={bloodTestData.hcm || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">V.C.M.</label>
          <input
            type="text"
            value={bloodTestData.vcm || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">C.H.C.M.</label>
          <input
            type="text"
            value={bloodTestData.chcm || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div>
          <h2 className="text-xl text-primary font-bold mb-4">LEUCOGRAMA</h2>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Leucócitos</label>
          <input
            type="text"
            value={bloodTestData.leukocytes || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Neutrófilos Total</label>
          <input
            type="text"
            value={bloodTestData.total_neutrophils || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Metamielócitos</label>
          <input
            type="text"
            value={bloodTestData.metamyelocytes || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Bastonetes</label>
          <input
            type="text"
            value={bloodTestData.rods || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Segmentos</label>
          <input
            type="text"
            value={bloodTestData.segments || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Basofilos</label>
          <input
            type="text"
            value={bloodTestData.basophiles || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Eosinófilos</label>
          <input
            type="text"
            value={bloodTestData.eosinophils || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Linfócitos Total</label>
          <input
            type="text"
            value={bloodTestData.total_lymphocytes || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Típicos</label>
          <input
            type="text"
            value={bloodTestData.typical || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Atípicos</label>
          <input
            type="text"
            value={bloodTestData.atypical || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Monócitos</label>
          <input
            type="text"
            value={bloodTestData.monocytes || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div>
          <h2 className="text-xl text-primary font-bold mb-4">
            CONTAGEM DE PLAQUETAS
          </h2>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">
            Resultado Contagem de Plaquetas
          </label>
          <input
            type="text"
            value={bloodTestData.platelet_count || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">
            Pesquisa de Hematozoários
          </label>
          <input
            type="text"
            value={bloodTestData.hematozoa_research || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Proteína Plasmática</label>
          <input
            type="text"
            value={bloodTestData.plasma_protein || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Observações</label>
          <textarea
            value={bloodTestData.comments || ""}
            readOnly
            className="textarea textarea-bordered w-full bg-gray-100"
          ></textarea>
        </div>

        <div className="max-w-xl flex space-x-6">
          <div className="max-w-xl">
            <button
              type="button"
              className="btn btn-info mt-6 w-32"
              onClick={() => router.back()}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
