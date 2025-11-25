import React from "react";

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

type Props = {
  ev: EventItem;
  modoParceiro: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
};

export default function EventCard({
  ev,
  modoParceiro,
  onEdit,
  onDelete,
  onViewDetails,
}: Props) {
  return (
    <div className="cartao" key={ev.id}>
      <div className="cartao-cabecalho">
        <img
          src={ev.imagem}
          className="cartao-img"
          onError={(e) =>
            ((e.target as HTMLImageElement).src = "https://placehold.co/600x400")
          }
        />
        <div className="cartao-overlay" />
        {modoParceiro && (
          <div className="cartao-acoes">
            <button
              onClick={() => onEdit(ev.id)}
              className="btn-acao btn-editar"
            >
              <i data-lucide="edit-2"></i>
            </button>
            <button
              onClick={() => onDelete(ev.id)}
              className="btn-acao btn-excluir"
            >
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        )}
        <div className="cartao-preco">{ev.preco}</div>
      </div>
      <div className="cartao-corpo">
        <h3 className="cartao-titulo">{ev.titulo}</h3>
        <div className="info-linha">
          <i data-lucide="calendar"></i> {ev.data}
        </div>
        <div className="info-linha">
          <i data-lucide="map-pin"></i> {ev.local}
        </div>
        <button
          onClick={() => onViewDetails(ev.id)}
          className="btn btn-gradiente btn-detalhes"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
