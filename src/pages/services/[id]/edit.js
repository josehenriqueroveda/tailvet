import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function EditService() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = router.query;
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (id) {
      const token = Cookies.get("authToken");
      fetch(`/api/v1/services?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setForm(data));
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
    const response = await fetch(`/api/v1/services?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      router.push(`/services`);
    } else {
      console.error("Failed to update service");
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
      <h1 className="text-2xl font-bold mb-4">Editar Serviço</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Nome do serviço/procedimento"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Preço</label>
          <input
            type="number"
            name="price"
            step="0.10"
            placeholder="Preço unitário do serviço/procedimento"
            value={form.price}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Quantidade</label>
          <input
            type="number"
            name="amount"
            placeholder="Quantidade (Ex. 1)"
            value={form.amount}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">
            Unidade de Medida (Opcional)
          </label>
          <input
            type="text"
            name="unit"
            placeholder="Unidade (Ex. ML)"
            value={form.unit}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Categoria</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Selecione a categoria</option>
            <option value="atendimento">Atendimento</option>
            <option value="vacina">Vacina</option>
            <option value="medicamento">Medicamento</option>
            <option value="procedimento">Procedimento</option>
            <option value="material">Material</option>
            <option value="outro">Outro</option>
          </select>
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
