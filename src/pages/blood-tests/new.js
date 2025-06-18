import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export default function NewBloodTest() {
  const router = useRouter();
  const [form, setForm] = useState({
    owner_id: "",
    pet_id: "",
    test_date: "",
    material: "",
    method: "",
    erythrocytes: "",
    hemoglobin: "",
    hematocrit: "",
    hcm: "",
    chcm: "",
    vcm: "",
    leukocytes: "",
    total_neutrophils: "",
    metamyelocytes: "",
    rods: "",
    segments: "",
    basophiles: "",
    eosinophils: "",
    total_lymphocytes: "",
    typical: "",
    atypical: "",
    monocytes: "",
    platelet_count: "",
    hematozoa_research: "",
    plasma_protein: "",
    comments: "",
  });
  const [pets, setPets] = useState([]);

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleOwnerChange = async (selectedOption) => {
    handleInputChange("owner_id", selectedOption?.value || "");

    if (selectedOption?.value) {
      const token = Cookies.get("authToken");
      try {
        const response = await fetch(
          `/api/v1/pets?owner_id=${selectedOption.value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch pets");

        const petsData = await response.json();
        const petsOptions = petsData.map((pet) => ({
          value: pet.id,
          label: pet.name,
        }));
        setPets(petsOptions);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setPets([]);
      }
    } else {
      setPets([]);
    }
  };

  const fetchOwners = async (inputValue) => {
    if (!inputValue) return [];
    const token = Cookies.get("authToken");
    try {
      const response = await fetch(`/api/v1/customers?search=${inputValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch owners");

      const owners = await response.json();
      return owners.map((owner) => ({
        value: owner.id,
        label: owner.name,
      }));
    } catch (error) {
      console.error("Error fetching owners:", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");

    try {
      const response = await fetch("/api/v1/blood_tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/blood-tests");
      } else {
        console.error("Failed to create a blood test");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Exame de Sangue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Proprietário</label>
          <AsyncSelect
            placeholder="Buscar proprietário..."
            isClearable
            isSearchable
            loadOptions={fetchOwners}
            onChange={handleOwnerChange}
            className="react-select-container"
            classNamePrefix="react-select"
            noOptionsMessage={() => "Nenhum proprietário encontrado"}
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Pet</label>
          <Select
            placeholder="Selecione um pet..."
            isClearable
            options={pets}
            onChange={(option) =>
              handleInputChange("pet_id", option?.value || "")
            }
            className="react-select-container"
            classNamePrefix="react-select"
            noOptionsMessage={() => "Nenhum pet encontrado"}
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data do Exame</label>
          <input
            type="date"
            name="test_date"
            placeholder="DD/MM/YYYY"
            value={form.test_date}
            onChange={(e) => handleInputChange("test_date", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Material</label>
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={form.material}
            onChange={(e) => handleInputChange("material", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Método</label>
          <input
            type="text"
            name="method"
            placeholder="Método"
            value={form.method}
            onChange={(e) => handleInputChange("method", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <h2 className="text-xl text-primary font-bold mb-4">ERITROGRAMA</h2>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Eritrócitos</label>
          <input
            type="number"
            name="erythrocytes"
            placeholder="0.00"
            value={form.erythrocytes || null}
            onChange={(e) => handleInputChange("erythrocytes", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Hemoglobina</label>
          <input
            type="number"
            name="hemoglobin"
            placeholder="0.00"
            value={form.hemoglobin || null}
            onChange={(e) => handleInputChange("hemoglobin", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Hematocrito</label>
          <input
            type="number"
            name="hematocrit"
            placeholder="0.00"
            value={form.hematocrit || null}
            onChange={(e) => handleInputChange("hematocrit", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">H.C.M.</label>
          <input
            type="number"
            name="hcm"
            placeholder="0.00"
            value={form.hcm || null}
            onChange={(e) => handleInputChange("hcm", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">V.C.M.</label>
          <input
            type="number"
            name="vcm"
            placeholder="0.00"
            value={form.vcm || null}
            onChange={(e) => handleInputChange("vcm", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">C.H.C.M.</label>
          <input
            type="number"
            name="chcm"
            placeholder="0.00"
            value={form.chcm || null}
            onChange={(e) => handleInputChange("chcm", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <h2 className="text-xl text-primary font-bold mb-4">LEUCOGRAMA</h2>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Leucócitos</label>
          <input
            type="number"
            name="leukocytes"
            placeholder="0"
            value={form.leukocytes || null}
            onChange={(e) => handleInputChange("leukocytes", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Neutrófilos Total</label>
          <input
            type="number"
            name="total_neutrophils"
            placeholder="0"
            value={form.total_neutrophils || null}
            onChange={(e) =>
              handleInputChange("total_neutrophils", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Metamielócitos</label>
          <input
            type="number"
            name="metamyelocytes"
            placeholder="0"
            value={form.metamyelocytes || null}
            onChange={(e) =>
              handleInputChange("metamyelocytes", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Bastonetes</label>
          <input
            type="number"
            name="rods"
            placeholder="0"
            value={form.rods || null}
            onChange={(e) => handleInputChange("rods", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Segmentos</label>
          <input
            type="number"
            name="segments"
            placeholder="0"
            value={form.segments || null}
            onChange={(e) => handleInputChange("segments", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Basofilos</label>
          <input
            type="number"
            name="basophiles"
            placeholder="0"
            value={form.basophiles || null}
            onChange={(e) => handleInputChange("basophiles", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Eosinófilos</label>
          <input
            type="number"
            name="eosinophils"
            placeholder="0"
            value={form.eosinophils || null}
            onChange={(e) => handleInputChange("eosinophils", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Linfócitos Total</label>
          <input
            type="number"
            name="total_lymphocytes"
            placeholder="0"
            value={form.total_lymphocytes || null}
            onChange={(e) =>
              handleInputChange("total_lymphocytes", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Típicos</label>
          <input
            type="number"
            name="typical"
            placeholder="0"
            value={form.typical || null}
            onChange={(e) => handleInputChange("typical", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Atípicos</label>
          <input
            type="number"
            name="atypical"
            placeholder="0"
            value={form.atypical || null}
            onChange={(e) => handleInputChange("atypical", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Monócitos</label>
          <input
            type="number"
            name="monocytes"
            placeholder="0"
            value={form.monocytes || null}
            onChange={(e) => handleInputChange("monocytes", e.target.value)}
            className="input input-bordered w-full"
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
            type="number"
            name="platelet_count"
            placeholder="0"
            value={form.platelet_count || null}
            onChange={(e) =>
              handleInputChange("platelet_count", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">
            Pesquisa de Hematozoários
          </label>
          <input
            type="text"
            name="hematozoa_research"
            placeholder="Pesquisa de Hematozoários"
            value={form.hematozoa_research}
            onChange={(e) =>
              handleInputChange("hematozoa_research", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Proteína Plasmática</label>
          <input
            type="number"
            name="plasma_protein"
            placeholder="0"
            value={form.plasma_protein || null}
            onChange={(e) =>
              handleInputChange("plasma_protein", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Observações</label>
          <textarea
            name="comments"
            placeholder="Comentários adicionais..."
            value={form.comments || ""}
            onChange={(e) => handleInputChange("comments", e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-xl flex space-x-6">
          <div className="max-w-xl">
            <button
              type="submit"
              className="btn btn-primary mt-6 text-white w-32"
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
      </form>
    </div>
  );
}
