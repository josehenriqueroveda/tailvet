import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import InputMask from "react-input-mask";

export default function NewCustomer() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    cell_phone: "",
    address: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    const response = await fetch("/api/v1/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      router.push("/customers");
    } else {
      console.error("Failed to create a customer");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cadastrar Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-w-xl">
          <label className="block text-sm mb-2">Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
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

        <div className="flex justify-center max-w-xl">
          <button type="submit" className="btn btn-primary text-white w-32">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
