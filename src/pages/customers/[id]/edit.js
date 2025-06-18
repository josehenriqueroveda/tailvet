import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import InputMask from "react-input-mask";

export default function EditCustomer() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (id) {
      const token = Cookies.get("authToken");
      fetch(`/api/v1/customers?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setForm(data));

      fetch(`/api/v1/pets?owner_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setPets(data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const token = Cookies.get("authToken");
    const response = await fetch(`/api/v1/customers?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      router.push(`/customers`);
    } else {
      console.error("Failed to update customer");
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
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
      <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
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
          >
            <option value="">Selecione o gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="username@mail.com"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Telefone</label>
          <InputMask
            mask="(99) 9999-9999"
            name="phone"
            placeholder="(99) 9999-9999"
            value={form.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Celular / Whatsapp</label>
          <InputMask
            mask="(99) 99999-9999"
            name="cell_phone"
            placeholder="(99) 99999-9999"
            value={form.cell_phone}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Endereço</label>
          <textarea
            name="address"
            placeholder="Rua/Avenida, Número, Bairro, Cidade/UF"
            value={form.address}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-xl">
          <label className="flex items-center space-x-2">
            <span>Cadastro Ativo?</span>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="checkbox"
            />
          </label>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Pets do Cliente</h2>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Gênero</th>
                <th>Idade</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td>{pet.name}</td>
                  <td>{pet.species}</td>
                  <td>{pet.gender}</td>
                  <td>{pet.age || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="max-w-xl flex space-x-6">
          <div className="max-w-xl">
            <button
              type="submit"
              className="btn btn-primary mt-6 text-white w-32"
              disabled={isSubmitting}
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
