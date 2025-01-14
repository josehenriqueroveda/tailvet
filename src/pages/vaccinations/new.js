import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import InputMask from "react-input-mask";
import moment from "moment";

export default function NewVaccination() {
  const router = useRouter();
  const [form, setForm] = useState({
    pet_id: "",
    vaccine_id: "",
    vaccination_date: "",
    dose: "",
    next_dose_date: "",
    notes: "",
    price: "",
  });
  const [pets, setPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    const fetchVaccines = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await fetch(`/api/v1/services?category=vacina`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch vaccines");

        const vaccinesData = await response.json();
        const vaccineOptions = vaccinesData.map((vaccine) => ({
          value: vaccine.id,
          label: vaccine.name,
          price: vaccine.price,
        }));
        setVaccines(vaccineOptions);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
        setVaccines([]);
      }
    };

    fetchVaccines();
  }, []);

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleVaccineChange = (selectedOption) => {
    setForm((prevForm) => ({
      ...prevForm,
      vaccine_id: selectedOption?.value || "",
      price: selectedOption?.price || "",
    }));
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
      const response = await fetch("/api/v1/vaccinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/vaccinations");
      } else {
        console.error("Failed to create vaccination");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Vacinação</h1>
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
          <label className="block text-sm mb-2">Vacina</label>
          <Select
            placeholder="Buscar vacina..."
            isClearable
            options={vaccines}
            onChange={handleVaccineChange}
            className="react-select-container"
            classNamePrefix="react-select"
            noOptionsMessage={() => "Nenhuma vacina encontrada"}
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Preço</label>
          <input
            type="number"
            name="price"
            placeholder="R$ 0,00"
            value={form.price || null}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data de Vacinação</label>
          <InputMask
            mask="99/99/9999"
            placeholder="DD/MM/YYYY"
            value={
              form.vaccination_date
                ? moment(form.vaccination_date, "YYYY-MM-DD").format(
                    "DD/MM/YYYY",
                  )
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                "vaccination_date",
                moment(e.target.value, "DD/MM/YYYY").format("YYYY-MM-DD"),
              )
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Dose</label>
          <input
            type="text"
            name="dose"
            placeholder="Ex. 1a"
            value={form.dose || ""}
            onChange={(e) => handleInputChange("dose", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data da Próxima Dose</label>
          <InputMask
            mask="99/99/9999"
            placeholder="DD/MM/YYYY"
            value={
              form.next_dose_date
                ? moment(form.next_dose_date, "YYYY-MM-DD").format("DD/MM/YYYY")
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                "next_dose_date",
                moment(e.target.value, "DD/MM/YYYY").format("YYYY-MM-DD"),
              )
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Observações</label>
          <textarea
            name="notes"
            placeholder="Comentários adicionais..."
            value={form.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-xl flex space-x-6">
          <button
            type="submit"
            className="btn btn-primary mt-6 text-white w-32"
          >
            Salvar
          </button>
          <button
            type="button"
            className="btn btn-info mt-6 w-32"
            onClick={() => router.back()}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
