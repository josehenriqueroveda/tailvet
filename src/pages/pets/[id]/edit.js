// edit.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import InputMask from "react-input-mask";
import moment from "moment";

export default function EditPet() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (id) {
      const token = Cookies.get("authToken");
      fetch(`/api/v1/pets?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setForm(data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birth_date") {
      const isValidDate = moment(value, "DD/MM/YYYY", true).isValid();
      setForm({
        ...form,
        [name]: isValidDate
          ? moment.utc(value, "DD/MM/YYYY").format("YYYY-MM-DD")
          : value,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    const response = await fetch(`/api/v1/pets?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        Object.fromEntries(
          Object.entries(form).filter(([key]) => key !== "owner_name"),
        ),
      ),
    });
    if (response.ok) {
      router.push("/pets");
    } else {
      console.error("Failed to update pet");
    }
  };

  if (!form) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Proprietário</label>
          <p>{form.owner_name}</p>
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
            <option value="canina">Canina</option>
            <option value="felina">Felina</option>
            <option value="outra">Outra</option>
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
            value={
              form.birth_date
                ? moment(form.birth_date, "YYYY-MM-DD").format("DD/MM/YYYY")
                : ""
            }
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

        <div className="max-w-xl">
          <label className="flex items-center space-x-2">
            <span>Cadastro Ativo?</span>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            <div>{form.is_active ? "Sim" : "Não"}</div>
          </label>
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
