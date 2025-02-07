import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export default function NewPrescription() {
  const router = useRouter();
  const [form, setForm] = useState({
    owner_id: "",
    pet_id: "",
    prescription_date: new Date().toISOString().split("T")[0],
    medicines: [],
  });

  const [pets, setPets] = useState([]);
  const [medicines, setMedicines] = useState([
    { medicine_name: "", quantity: "", instructions: "" },
  ]);

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

  // Manipular campos do formulário
  const handleInputChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manipular mudanças nos medicamentos
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med,
    );
    setMedicines(updatedMedicines);
  };

  // Adicionar um novo medicamento
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { medicine_name: "", quantity: "", instructions: "" },
    ]);
  };

  // Remover um medicamento
  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Enviar dados ao backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");

    try {
      const response = await fetch("/api/v1/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, medicines }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/prescriptions/${data.prescription_id}`);
      } else {
        console.error("Erro ao criar a receita");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Receita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Proprietário */}
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

        {/* Pet */}
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

        {/* Data da Receita */}
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data da Receita</label>
          <input
            type="date"
            value={form.prescription_date}
            onChange={(e) =>
              handleInputChange("prescription_date", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        {/* Lista de Medicamentos */}
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Medicamentos</label>
          {medicines.map((medicine, index) => (
            <div key={index} className="flex flex-col mb-2">
              <div className="flex flex-row justify-between gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nome do medicamento..."
                  value={medicine.medicine_name}
                  onChange={(e) =>
                    handleMedicineChange(index, "medicine_name", e.target.value)
                  }
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Quantidade..."
                  value={medicine.quantity}
                  onChange={(e) =>
                    handleMedicineChange(index, "quantity", e.target.value)
                  }
                  className="input input-bordered w-1/3"
                />
                <button
                  type="button"
                  className="btn btn-error text-white"
                  onClick={() => removeMedicine(index)}
                >
                  ✕
                </button>
              </div>
              <textarea
                type="text"
                placeholder="Instruções..."
                value={medicine.instructions}
                onChange={(e) =>
                  handleMedicineChange(index, "instructions", e.target.value)
                }
                className="textarea input-bordered w-full"
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={addMedicine}
          >
            + Adicionar Medicamento
          </button>
        </div>

        {/* Botões de ação */}
        <div className="max-w-xl flex space-x-6">
          <button type="submit" className="btn btn-primary text-white w-32">
            Salvar
          </button>
          <button
            type="button"
            className="btn btn-info w-32"
            onClick={() => router.back()}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
