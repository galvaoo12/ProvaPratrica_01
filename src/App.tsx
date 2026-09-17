import { useState } from "react";

// ============================================
// TYPES (exigência da prova: interfaces + type union)
// ============================================

type AnimalStatus = "disponivel" | "em_adocao" | "adotado";
type SolicitacaoStatus = "pendente" | "aprovada" | "cancelada";

interface Animal {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  status: AnimalStatus;
}

interface Interessado {
  id: number;
  nome: string;
  telefone: string;
}

interface SolicitacaoAdocao {
  id: number;
  animalId: number;
  interessadoId: number;
  status: SolicitacaoStatus;
}

// ============================================
// DADOS INICIAIS (5 registros exigidos pela prova)
// ============================================

const animaisIniciais: Animal[] = [
  { id: 1, nome: "Luna", especie: "Cachorro", idade: 3, status: "disponivel" },
  { id: 2, nome: "Mia", especie: "Gato", idade: 2, status: "disponivel" },
  { id: 3, nome: "Thor", especie: "Cachorro", idade: 5, status: "adotado" },
  { id: 4, nome: "Nina", especie: "Gato", idade: 1, status: "disponivel" },
  { id: 5, nome: "Bob", especie: "Cachorro", idade: 4, status: "em_adocao" },
];

// TROQUE pelo seu código individual da prova.
const CODIGO_PROVA = "SEU-CODIGO-AQUI";

// Regra do número 5: limite de solicitações ativas por interessado.
const LIMITE_SOLICITACOES = 5;

// ============================================
// COMPONENTE 1 — Header
// ============================================

interface HeaderProps {
  codigo: string;
  titulo: string;
}

function Header({ codigo, titulo }: HeaderProps) {
  return (
    <header className="header">
      <h1>{titulo}</h1>
      <span className="header-codigo">Código da prova: {codigo}</span>
    </header>
  );
}

// ============================================
// COMPONENTE 2 — Indicadores calculados
// ============================================

interface IndicatorsProps {
  animais: Animal[];
  solicitacoes: SolicitacaoAdocao[];
}

function Indicators({ animais, solicitacoes }: IndicatorsProps) {
  const totalAnimais = animais.length;
  const disponiveis = animais.filter((a) => a.status === "disponivel").length;
  const adotados = animais.filter((a) => a.status === "adotado").length;
  const pendentes = solicitacoes.filter((s) => s.status === "pendente").length;

  return (
    <section className="indicadores">
      <div className="indicador">
        <span>{totalAnimais}</span>
        <p>Total de animais</p>
      </div>
      <div className="indicador">
        <span>{disponiveis}</span>
        <p>Disponíveis</p>
      </div>
      <div className="indicador">
        <span>{adotados}</span>
        <p>Adotados</p>
      </div>
      <div className="indicador">
        <span>{pendentes}</span>
        <p>Solicitações pendentes</p>
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE 3 — Formulário de cadastro de animal
// ============================================

interface AnimalFormProps {
  onCadastrar: (nome: string, especie: string, idade: number) => void;
}

function AnimalForm({ onCadastrar }: AnimalFormProps) {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("Cachorro");
  const [idade, setIdade] = useState("");

  function handleCadastrar() {
    if (!nome.trim()) {
      alert("Informe o nome do animal.");
      return;
    }
    onCadastrar(nome, especie, Number(idade));
    setNome("");
    setIdade("");
  }

  return (
    <section className="card">
      <h2>Cadastrar animal</h2>
      <div className="campos">
        <input
          type="text"
          placeholder="Nome do animal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <select value={especie} onChange={(e) => setEspecie(e.target.value)}>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Outro">Outro</option>
        </select>
        <input
          type="number"
          placeholder="Idade"
          min="0"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
      </div>
      <button onClick={handleCadastrar}>Cadastrar animal</button>
    </section>
  );
}

// ============================================
// COMPONENTE 4 — Lista de animais
// ============================================

function textoDoStatus(status: AnimalStatus) {
  if (status === "disponivel") return "Disponível";
  if (status === "em_adocao") return "Em adoção";
  return "Adotado";
}

interface AnimalListProps {
  animais: Animal[];
}

function AnimalList({ animais }: AnimalListProps) {
  return (
    <section className="card">
      <h2>Animais cadastrados</h2>
      {animais.length === 0 && <p>Nenhum animal cadastrado ainda.</p>}
      <div className="cards">
        {animais.map((animal) => (
          <article key={animal.id} className="animal">
            <strong>{animal.nome}</strong>
            <p>
              {animal.especie} • {animal.idade}{" "}
              {animal.idade === 1 ? "ano" : "anos"}
            </p>
            <span className={`tag tag-${animal.status}`}>
              {textoDoStatus(animal.status)}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE 4.1 — Só os animais disponíveis (usado na aba "Disponíveis")
// ============================================

interface AvailableListProps {
  animais: Animal[];
}

function AvailableList({ animais }: AvailableListProps) {
  return (
    <section className="card">
      <h2>Animais disponíveis para adoção</h2>
      {animais.length === 0 && (
        <p>Nenhum animal disponível no momento.</p>
      )}
      <div className="cards">
        {animais.map((animal) => (
          <article key={animal.id} className="animal">
            <strong>{animal.nome}</strong>
            <p>
              {animal.especie} • {animal.idade}{" "}
              {animal.idade === 1 ? "ano" : "anos"}
            </p>
            <span className="tag tag-disponivel">Disponível</span>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE 5 — Registrar interessado + solicitar adoção
// ============================================

interface AdoptionFormProps {
  animaisDisponiveis: Animal[];
  interessados: Interessado[];
  onRegistrarInteressado: (nome: string, telefone: string) => void;
  onSolicitarAdocao: (animalId: number, interessadoId: number) => void;
}

function AdoptionForm({
  animaisDisponiveis,
  interessados,
  onRegistrarInteressado,
  onSolicitarAdocao,
}: AdoptionFormProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [animalId, setAnimalId] = useState("");
  const [interessadoId, setInteressadoId] = useState("");

  function handleRegistrar() {
    if (!nome.trim()) {
      alert("Informe o nome do interessado.");
      return;
    }
    onRegistrarInteressado(nome, telefone);
    setNome("");
    setTelefone("");
  }

  function handleSolicitar() {
    if (!animalId || !interessadoId) {
      alert("Escolha o interessado e o animal.");
      return;
    }
    onSolicitarAdocao(Number(animalId), Number(interessadoId));
    setAnimalId("");
  }

  return (
    <section className="card">
      <h2>Solicitar adoção</h2>

      <h3>1. Registrar interessado</h3>
      <div className="campos">
        <input
          type="text"
          placeholder="Nome do interessado"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>
      <button onClick={handleRegistrar}>Registrar interessado</button>

      <h3>2. Criar solicitação</h3>
      <div className="campos">
        <select
          value={interessadoId}
          onChange={(e) => setInteressadoId(e.target.value)}
        >
          <option value="">Selecione o interessado</option>
          {interessados.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nome}
            </option>
          ))}
        </select>
        <select value={animalId} onChange={(e) => setAnimalId(e.target.value)}>
          <option value="">Selecione o animal</option>
          {animaisDisponiveis.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome} ({a.especie})
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSolicitar}>Enviar solicitação</button>
    </section>
  );
}

// ============================================
// COMPONENTE 6 — Lista de solicitações
// ============================================

interface SolicitacaoListProps {
  solicitacoes: SolicitacaoAdocao[];
  animais: Animal[];
  interessados: Interessado[];
  onAprovar: (id: number) => void;
  onCancelar: (id: number) => void;
}

function SolicitacaoList({
  solicitacoes,
  animais,
  interessados,
  onAprovar,
  onCancelar,
}: SolicitacaoListProps) {
  function nomeDoAnimal(id: number) {
    return animais.find((a) => a.id === id)?.nome ?? "—";
  }
  function nomeDoInteressado(id: number) {
    return interessados.find((p) => p.id === id)?.nome ?? "—";
  }

  return (
    <section className="card">
      <h2>Solicitações de adoção</h2>
      {solicitacoes.length === 0 && <p>Nenhuma solicitação registrada.</p>}
      <div className="cards">
        {solicitacoes.map((s) => (
          <article key={s.id} className="animal">
            <strong>{nomeDoAnimal(s.animalId)}</strong>
            <p>Interessado: {nomeDoInteressado(s.interessadoId)}</p>
            <span className={`tag tag-${s.status}`}>{s.status}</span>
            {s.status === "pendente" && (
              <div className="acoes">
                <button onClick={() => onAprovar(s.id)}>Aprovar</button>
                <button className="secundario" onClick={() => onCancelar(s.id)}>
                  Cancelar
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================
// APP — junta tudo e guarda o estado principal
// ============================================

// As duas abas possíveis da tela.
type Aba = "cadastro" | "disponiveis";

function App() {
  const [animais, setAnimais] = useState<Animal[]>(animaisIniciais);
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAdocao[]>([]);

  // Controla qual aba está aberta. Começa em "cadastro".
  const [abaAtiva, setAbaAtiva] = useState<Aba>("cadastro");

  const animaisDisponiveis = animais.filter((a) => a.status === "disponivel");

  function cadastrarAnimal(nome: string, especie: string, idade: number) {
    const novo: Animal = {
      id: Date.now(),
      nome,
      especie,
      idade,
      status: "disponivel",
    };
    setAnimais([...animais, novo]);
  }

  function registrarInteressado(nome: string, telefone: string) {
    setInteressados([...interessados, { id: Date.now(), nome, telefone }]);
  }

  function solicitarAdocao(animalId: number, interessadoId: number) {
    const ativas = solicitacoes.filter(
      (s) => s.interessadoId === interessadoId && s.status === "pendente"
    ).length;

    if (ativas >= LIMITE_SOLICITACOES) {
      alert(
        `O interessado atingiu o limite de ${LIMITE_SOLICITACOES} solicitações ativas.`
      );
      return;
    }

    setSolicitacoes([
      ...solicitacoes,
      { id: Date.now(), animalId, interessadoId, status: "pendente" },
    ]);

    setAnimais(
      animais.map((a) => (a.id === animalId ? { ...a, status: "em_adocao" } : a))
    );
  }

  function aprovarSolicitacao(id: number) {
    const solicitacao = solicitacoes.find((s) => s.id === id);
    if (!solicitacao) return;

    setSolicitacoes(
      solicitacoes.map((s) => (s.id === id ? { ...s, status: "aprovada" } : s))
    );

    setAnimais(
      animais.map((a) =>
        a.id === solicitacao.animalId ? { ...a, status: "adotado" } : a
      )
    );
  }

  function cancelarSolicitacao(id: number) {
    const solicitacao = solicitacoes.find((s) => s.id === id);
    if (!solicitacao) return;

    setSolicitacoes(
      solicitacoes.map((s) => (s.id === id ? { ...s, status: "cancelada" } : s))
    );

    setAnimais(
      animais.map((a) =>
        a.id === solicitacao.animalId ? { ...a, status: "disponivel" } : a
      )
    );
  }

  return (
    <div className="container">
      <Header codigo={CODIGO_PROVA} titulo="Cadastro de Animais para Adoção" />
      <Indicators animais={animais} solicitacoes={solicitacoes} />

      {/* Botões das abas — o estilo "ativa" muda conforme abaAtiva */}
      <div className="abas">
        <button
          className={abaAtiva === "cadastro" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("cadastro")}
        >
          Cadastro
        </button>
        <button
          className={abaAtiva === "disponiveis" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("disponiveis")}
        >
          Animais disponíveis
        </button>
      </div>

      {/* Só o conteúdo da aba ativa é renderizado */}
      {abaAtiva === "cadastro" && (
        <>
          <AnimalForm onCadastrar={cadastrarAnimal} />
          <AnimalList animais={animais} />
          <AdoptionForm
            animaisDisponiveis={animaisDisponiveis}
            interessados={interessados}
            onRegistrarInteressado={registrarInteressado}
            onSolicitarAdocao={solicitarAdocao}
          />
          <SolicitacaoList
            solicitacoes={solicitacoes}
            animais={animais}
            interessados={interessados}
            onAprovar={aprovarSolicitacao}
            onCancelar={cancelarSolicitacao}
          />
        </>
      )}

      {abaAtiva === "disponiveis" && (
        <AvailableList animais={animaisDisponiveis} />
      )}
    </div>
  );
}

export default App;
