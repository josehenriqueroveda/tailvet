import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export default function NewAppointment() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    pet_id: "",
    appointment_date: "",
    appointment_type: "",
    main_complaint: "",
    anamnesis: "",
    temperature: "",
    weight: "",
    neurological_system: "",
    digestive_system: "",
    cardiorespiratory_system: "",
    urinary_system: "",
    diagnosis: "",
    observations: "",
    return_date: "",
  });
  const [extraServices, setExtraServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

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

  const fetchServices = async (inputValue) => {
    if (!inputValue) return [];
    const token = Cookies.get("authToken");
    try {
      const response = await fetch(`/api/v1/services?search=${inputValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch services");

      const services = await response.json();
      return services.map((service) => ({
        value: service.id,
        label: `${service.name} (${service.price})`,
        name: service.name,
        price: service.price,
        category: service.category,
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  };

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleServiceAdd = (service) => {
    if (!service) return;
    console.dir(service);
    const servicePrice = parseFloat(service.price) || 0;
    setExtraServices((prev) => [...prev, service]);
    setTotalPrice((prev) => (parseFloat(prev) || 0) + servicePrice);
    setSelectedService(null);
  };

  const handleServiceRemove = (index) => {
    const serviceToRemove = extraServices[index];
    setExtraServices((prev) => prev.filter((_, i) => i !== index));
    setTotalPrice((prev) => prev - serviceToRemove.price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create the appointment
      const appointmentResponse = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!appointmentResponse.ok) {
        throw new Error("Failed to create appointment");
      }

      const { id: appointmentId } = await appointmentResponse.json();

      // Step 2: Add extra services
      for (const service of extraServices) {
        await fetch("/api/v1/appointment_services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointment_id: appointmentId,
            service_id: service.value,
            service_name: service.label,
            service_price: service.price,
          }),
        });
      }

      router.push("/appointments");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Atendimento</h1>
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
          <label className="block text-sm mb-2">Tipo de Atendimento</label>
          <label>
            <input
              type="radio"
              name="appointment_type"
              className="radio radio-primary"
              value="Consulta"
              checked={form.appointment_type === "Consulta"}
              onChange={(e) =>
                handleInputChange("appointment_type", e.target.value)
              }
              defaultChecked
            />{" "}
            Consulta
          </label>
          <label className="ml-6">
            <input
              type="radio"
              name="appointment_type"
              className="radio radio-primary"
              value="Retorno"
              checked={form.appointment_type === "Retorno"}
              onChange={(e) =>
                handleInputChange("appointment_type", e.target.value)
              }
            />{" "}
            Retorno
          </label>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data do Atendimento</label>
          <input
            type="date"
            name="appointment_date"
            placeholder="DD/MM/YYYY"
            value={form.appointment_date}
            onChange={(e) =>
              handleInputChange("appointment_date", e.target.value)
            }
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Queixa Principal</label>
          <textarea
            name="main_complaint"
            placeholder="Queixa principal apresentada pelo proprietário..."
            value={form.main_complaint || ""}
            onChange={(e) =>
              handleInputChange("main_complaint", e.target.value)
            }
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Anamnese</label>
          <textarea
            name="anamnesis"
            placeholder="Informações sobre a saúde do animal..."
            value={form.anamnesis || ""}
            onChange={(e) => handleInputChange("anamnesis", e.target.value)}
            className="textarea textarea-bordered w-full min-h-48"
          ></textarea>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Temperatura (°C)</label>
          <input
            type="number"
            name="temperature"
            step="0.10"
            placeholder="Temperatura em graus Celsius"
            value={form.temperature}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
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
            onChange={(e) => handleInputChange("weight", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Sistema Neurológico</label>
          <textarea
            name="neurological_system"
            placeholder="Observações importantes do sistema neurológico..."
            value={form.neurological_system || ""}
            onChange={(e) =>
              handleInputChange("neurological_system", e.target.value)
            }
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Sistema Digestório</label>
          <textarea
            name="digestive_system"
            placeholder="Observações importantes do sistema digestório..."
            value={form.digestive_system || ""}
            onChange={(e) =>
              handleInputChange("digestive_system", e.target.value)
            }
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">
            Sistema Cardiorespiratório
          </label>
          <textarea
            name="cardiorespiratory_system"
            placeholder="Observações importantes do sistema cardiorespiratório..."
            value={form.cardiorespiratory_system || ""}
            onChange={(e) =>
              handleInputChange("cardiorespiratory_system", e.target.value)
            }
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Sistema Urinário</label>
          <textarea
            name="urinary_system"
            placeholder="Observações importantes do sistema urinário..."
            value={form.urinary_system || ""}
            onChange={(e) =>
              handleInputChange("urinary_system", e.target.value)
            }
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Diagnóstico</label>
          <textarea
            name="diagnosis"
            placeholder="Escreva o diagnóstico..."
            value={form.diagnosis || ""}
            onChange={(e) => handleInputChange("diagnosis", e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-full">
          <label className="block text-sm mb-2">Observações Adicionais</label>
          <textarea
            name="observations"
            placeholder="Escreva aqui observações adicionais..."
            value={form.observations || ""}
            onChange={(e) => handleInputChange("observations", e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="max-w-xl">
          <label className="block text-sm mb-2">Data para Retorno</label>
          <input
            type="date"
            name="return_date"
            placeholder="DD/MM/YYYY"
            value={form.return_date}
            onChange={(e) => handleInputChange("return_date", e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <h2 className="mt-10 text-lg font-bold">Serviços Prestados</h2>
          <div className="mb-4 mt-2">
            <AsyncSelect
              placeholder="Buscar..."
              isClearable
              isSearchable
              loadOptions={fetchServices}
              value={selectedService}
              onChange={(service) => {
                setSelectedService(service);
                handleServiceAdd(service);
              }}
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "Nenhum item encontrado"}
            />
          </div>

          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">
                  Materiais, Medicamentos e Serviços
                </th>
                <th className="border px-4 py-2">Preço</th>
                <th className="border px-4 py-2">Categoria</th>
                <th className="border px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {extraServices.map((service, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{service.name || "N/A"}</td>
                  <td className="border px-4 py-2">R${service.price}</td>
                  <td className="border px-4 py-2">
                    {service.category || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleServiceRemove(index)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="stats shadow mt-6">
            <div className="stat">
              <div className="stat-title">Valor total</div>
              <div className="stat-value">R${totalPrice.toFixed(2)}</div>
            </div>
          </div>
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
              className="btn btn-info mt-6 w-32"
              onClick={() => router.back()}
            >
              Voltar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
