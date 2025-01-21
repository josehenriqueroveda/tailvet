import { useRouter } from "next/router";
import useSWR from "swr";
import authenticatedFetcher from "src/hooks/authenticatedFetcher";
import moment from "moment";
import { LuCircleX } from "react-icons/lu";

export default function ViewPet() {
  const router = useRouter();
  const { id } = router.query;

  const { data: petData, error: petError } = useSWR(
    id ? `/api/v1/pets?id=${id}` : null,
    authenticatedFetcher,
  );

  if (petError) {
    return (
      <div className="p-6">
        <div role="alert" className="alert alert-error">
          <LuCircleX className="text-white" />
          <span className="text-white">
            Erro! Falha ao carregar dados do pet.
          </span>
        </div>
      </div>
    );
  }

  if (!petData) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Pet</h1>
      <div className="card bg-base-100 shadow-md p-4 max-w-xl">
        <p>
          <strong>Proprietário:</strong> {petData.owner_name}
        </p>
        <p>
          <strong>Nome:</strong> {petData.name}
        </p>
        <p>
          <strong>Gênero:</strong> {petData.gender}
        </p>
        <p>
          <strong>Espécie:</strong> {petData.species}
        </p>
        <p>
          <strong>Raça:</strong> {petData.breed || "N/A"}
        </p>
        <p>
          <strong>Cor:</strong> {petData.color || "N/A"}
        </p>
        <p>
          <strong>Data de Nascimento:</strong>{" "}
          {petData.birth_date
            ? moment.utc(petData.birth_date).format("DD/MM/YYYY")
            : "N/A"}
        </p>
        <p>
          <strong>Idade:</strong> {petData.age || "N/A"}
        </p>
        <p>
          <strong>Peso:</strong> {petData.weight || "N/A"}
        </p>
        <p>
          <strong>Castrado?</strong> {petData.is_neutered ? "Sim" : "Não"}
        </p>
        <p>
          <strong>Cadastro Ativo?</strong> {petData.is_active ? "Sim" : "Não"}
        </p>
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
  );
}
