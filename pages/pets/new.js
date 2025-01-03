import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import AsyncSelect from "react-select/async";
import InputMask from "react-input-mask";

export default function NewPet() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    species: "",
    breed: "",
    birth_date: "",
    age: "",
    weight: "",
    color: "",
    is_neutered: false,
    owner_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setForm({ ...form, owner_id: selectedOption?.value || "" });
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const fetchOwners = async (inputValue) => {
    if (!inputValue) return [];
    const token = Cookies.get("authToken");

    try {
      const response = await fetch(`/api/v1/customers?search=${inputValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch owners");
      }

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
      const response = await fetch("/api/v1/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/pets");
      } else {
        console.error("Failed to create pet");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Proprietário</label>
          <AsyncSelect
            placeholder="Buscar proprietário..."
            isClearable
            isSearchable
            loadOptions={fetchOwners}
            onChange={handleSelectChange}
            className="react-select-container"
            classNamePrefix="react-select"
            noOptionsMessage={() => "Nenhum proprietário encontrado"}
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Nome do pet"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Gênero</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Selecione o gênero</option>
            <option value="macho">Macho</option>
            <option value="fêmea">Fêmea</option>
          </select>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Espécie</label>
          <select
            name="species"
            value={form.species}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Selecione a espécie</option>
            <option value="cachorro">Cachorro</option>
            <option value="gato">Gato</option>
            <option value="coelho">Coelho</option>
            <option value="ave">Ave</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Raça</label>
          <input
            type="text"
            name="breed"
            placeholder="Raça do pet"
            value={form.breed}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Cor</label>
          <input
            type="text"
            name="color"
            placeholder="Cor do pet"
            value={form.color}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data de Nascimento</label>
          <InputMask
            mask="99/99/9999"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Idade</label>
          <input
            type="text"
            name="age"
            placeholder="Idade do pet (em texto)"
            value={form.age}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Peso (kg)</label>
          <input
            type="number"
            name="weight"
            step="0.10"
            placeholder="Peso do pet"
            value={form.weight}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="flex items-center space-x-2">
            <span>Castrado?</span>
            <input
              type="checkbox"
              name="is_neutered"
              checked={form.is_neutered}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            <div>{form.is_neutered ? "Sim" : "Não"}</div>
          </label>
        </div>

        <div className="flex justify-center max-w-xl">
          <button type="submit" className="btn btn-primary text-white w-32">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
