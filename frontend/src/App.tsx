import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import Modal from "./components/Modal";
import EventCard from "./components/EventCard";

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

const initialEventos: EventItem[] = [
  {
    id: 1,
    titulo: "Festival de Rock",
    data: "25/11/2025",
    hora: "20:00",
    local: "Arena Central",
    imagem:
      "https://images.unsplash.com/photo-1656283384093-1e227e621fad?auto=format&fit=crop&w=800&q=80",
    participantes: 2500,
    preco: "R$ 80,00",
    valorPreco: 80,
    valorData: new Date("2025-11-25"),
  },
  {
    id: 2,
    titulo: "Feira Gastronômica",
    data: "22/11/2025",
    hora: "12:00",
    local: "Parque City",
    imagem:
      "https://images.unsplash.com/photo-1678646142794-253fdd20fa05?auto=format&fit=crop&w=800&q=80",
    participantes: 1800,
    preco: "Grátis",
    valorPreco: 0,
    valorData: new Date("2025-11-22"),
  },
];

export default function App(): JSX.Element {
  const [eventos, setEventos] = useState<EventItem[]>(initialEventos);
  const [termoBusca, setTermoBusca] = useState("");
  const [modoParceiro, setModoParceiro] = useState(false);

  const [detalheAberto, setDetalheAberto] = useState<EventItem | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [formData, setFormData] = useState<Partial<EventItem>>({});

  useEffect(() => {
    try {
      lucide?.createIcons();
    } catch {}
  }, [eventos, termoBusca, modoParceiro, detalheAberto, formAberto]);

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
      <header>
        <div className="container cabecalho-container">
          <div className="espaco-flex" />
          <div className="grupo-logo">
            <div className="caixa-logo">
              <i data-lucide="calendar"></i>
            </div>
            <div>
              <h1 className="texto-logo">EventoCity</h1>
              <p className="subtitulo-logo">Agenda Cultural</p>
            </div>
          </div>
          <div className="grupo-acoes-header">
            <button
              onClick={() => setModoParceiro((v) => !v)}
              className={`btn btn-contorno ${
                modoParceiro ? "btn-parceiro-ativo" : ""
              }`}
            >
              <i data-lucide="user-cog"></i>
              <span>
                {modoParceiro ? "Sair do Modo Parceiro" : "Modo Parceiro"}
              </span>
            </button>
          </div>
        </div>
      </header>

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
                modoParceiro={modoParceiro}
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
        className={`btn-flutuante ${modoParceiro ? "" : "oculto"}`}
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
