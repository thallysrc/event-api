export default function Header() {

  return (
    <header>
      <div className="container cabecalho-container">
        <div className="grupo-logo">
          <div className="caixa-logo">
            <i data-lucide="calendar"></i>
          </div>
          <div>
            <h1 className="texto-logo">EventoCity</h1>
            <p className="subtitulo-logo">Agenda Cultural</p>
          </div>
        </div>
      </div>
    </header>
  );
}