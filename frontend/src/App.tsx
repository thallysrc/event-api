import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import Modal from "./components/Modal";
import EventCard from "./components/EventCard";
import Header from "./components/Header";

// lucide is loaded from CDN in index.html; declare to avoid TS errors
declare const lucide: any;

type EventItem = {
  id: number;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  imagem: string;
  participantes: number | string;
  preco: string;
  valorPreco: number;
  valorData: Date;
};

const initialEventos: EventItem[] = [];

export default function App(): JSX.Element {
  const [eventos, setEventos] = useState<EventItem[]>(initialEventos);
  const [termoBusca, setTermoBusca] = useState("");

  const [detalheAberto, setDetalheAberto] = useState<EventItem | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [formData, setFormData] = useState<Partial<EventItem>>({});

  useEffect(() => {
    async function fetchEventos() {
      const res = await fetch("http://127.0.0.1:8000/concerts");
      const data = await res.json();

      const convertidos: EventItem[] = data.map((c: any) => ({
        id: c.id,
        titulo: c.name,
        data: new Date(c.date).toLocaleDateString("pt-BR"),
        hora: "",
        local: c.location,
        imagem: c.image_url,
        participantes: c.participants ?? 0,
        preco: c.price ? `R$ ${c.price}` : "Grátis",
        valorPreco: c.price ?? 0,
        valorData: new Date(c.date),
      }));

      setEventos(convertidos);
    }

    fetchEventos();

    try {
      lucide?.createIcons();
    } catch {}
  }, [eventos, termoBusca, detalheAberto, formAberto]);

  const eventosFiltrados = useMemo(
    () =>
      eventos.filter((e) =>
        e.titulo.toLowerCase().includes(termoBusca.toLowerCase())
      ),
    [eventos, termoBusca]
  );

  function abrirDetalhes(id: number) {
    setDetalheAberto(eventos.find((e) => e.id === id) || null);
  }

  function fecharDetalhes() {
    setDetalheAberto(null);
  }

  function abrirModalFormulario(id?: number) {
    if (id) setFormData(eventos.find((e) => e.id === id) || {});
    else setFormData({});
    setFormAberto(true);
  }

  function fecharModalFormulario() {
    setFormAberto(false);
    setFormData({});
  }

  function salvarEvento(ev: React.FormEvent) {
    ev.preventDefault();
    const novo: EventItem = {
      id: formData.id ? (formData.id as number) : Date.now(),
      titulo: (formData.titulo as string) || "Novo Evento",
      data: (formData.data as string) || "",
      hora: (formData.hora as string) || "",
      local: (formData.local as string) || "",
      imagem: (formData.imagem as string) || "https://placehold.co/600x400",
      participantes: Number(formData.participantes) || 0,
      preco: (formData.preco as string) || "Grátis",
      valorPreco: Number(formData.preco) || 0,
      valorData: new Date((formData.data as string) || undefined),
    };

    setEventos((prev) => {
      const idx = prev.findIndex((p) => p.id === novo.id);
      if (idx >= 0) {
        const c = [...prev];
        c[idx] = { ...c[idx], ...novo };
        return c;
      }
      return [...prev, novo];
    });

    fecharModalFormulario();
  }

  function excluirEvento(id: number) {
    if (!confirm("Confirma exclusão?")) return;
    setEventos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="app-root">
      <Header />

      <main className="container area-principal">
        <div className="caixa-busca">
          <i data-lucide="search" className="icone-busca"></i>
          <input
            className="input-busca input-form"
            placeholder="Buscar eventos por nome..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        <div className="texto-centro mb-2">
          {eventosFiltrados.length} eventos encontrados
        </div>

        <div id="grade-eventos" className="grade-eventos">
          {eventosFiltrados.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              Nenhum evento.
            </div>
          ) : (
            eventosFiltrados.map((ev) => (
              <EventCard
                key={ev.id}
                ev={ev}
                modoParceiro={true}
                onEdit={abrirModalFormulario}
                onDelete={excluirEvento}
                onViewDetails={abrirDetalhes}
              />
            ))
          )}
        </div>
      </main>

      <button
        onClick={() => abrirModalFormulario()}
        id="btn-flutuante-add"
        className="btn-flutuante"
      >
        <i data-lucide="plus"></i>
      </button>

      {detalheAberto && (
        <Modal onClose={fecharDetalhes} title={detalheAberto.titulo}>
          <p>
            {detalheAberto.data} • {detalheAberto.hora} • {detalheAberto.local}
          </p>
          <p>
            {detalheAberto.participantes} participantes • {detalheAberto.preco}
          </p>
        </Modal>
      )}

      {formAberto && (
        <Modal
          onClose={fecharModalFormulario}
          title={formData.id ? "Editar Evento" : "Novo Evento"}
        >
          <form onSubmit={salvarEvento}>
            <div className="grupo-form">
              <label>Nome</label>
              <input
                className="input-form"
                value={formData.titulo || ""}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, titulo: e.target.value }))
                }
                required
              />
            </div>

            <div className="grupo-form">
              <label>Data</label>
              <input
                className="input-form"
                value={formData.data || ""}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, data: e.target.value }))
                }
              />
            </div>

            <div className="acoes-form">
              <button
                type="button"
                onClick={fecharModalFormulario}
                className="btn btn-contorno"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-gradiente">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
