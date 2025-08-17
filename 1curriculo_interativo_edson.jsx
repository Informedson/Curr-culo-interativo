import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Printer, Link as LinkIcon } from "lucide-react";

// === Interactive Resume (Book-style) ===
// Dicas de uso:
// - Clique nas bordas esquerda/direita do livro para "virar" as páginas.
// - Use as setas do teclado (← →) para navegar.
// - Botão Imprimir gera um PDF a partir da visualização do navegador.

export default function InteractiveResume() {
  const [page, setPage] = useState(0);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const go = useCallback(
    (dir: number) => {
      setPage((p) => clamp(p + dir, 0, PAGES.length - 1));
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const progress = useMemo(() => ((page + 1) / PAGES.length) * 100, [page]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Currículo Interativo – Edson Ferreira Ramos</h1>
            <p className="text-sm text-slate-600">Clique nas laterais do livro ou use ← → para navegar</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.print()} className="rounded-2xl shadow-sm">
              <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
            </Button>
          </div>
        </header>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-slate-900" style={{ width: `${progress}%` }} />
        </div>

        {/* Book */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[56px_1fr_56px]">
          <div className="hidden md:flex items-center justify-center">
            <NavButton dir={-1} onClick={() => go(-1)} disabled={page === 0} />
          </div>

          <div className="relative">
            <Book onLeft={() => go(-1)} onRight={() => go(1)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={page}
                  initial={{ rotateY: 20, x: 40, opacity: 0 }}
                  animate={{ rotateY: 0, x: 0, opacity: 1 }}
                  exit={{ rotateY: -20, x: -40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className="h-full"
                >
                  {PAGES[page]}
                </motion.div>
              </AnimatePresence>
            </Book>

            {/* Mobile nav */}
            <div className="mt-4 flex justify-between gap-3 md:hidden">
              <Button variant="secondary" className="rounded-2xl" onClick={() => go(-1)} disabled={page === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
              <Button className="rounded-2xl" onClick={() => go(1)} disabled={page === PAGES.length - 1}>
                Próxima <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <NavButton dir={1} onClick={() => go(1)} disabled={page === PAGES.length - 1} />
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                page === i ? "bg-slate-900 w-6" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Ir para página ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          header, .mt-6.flex, .md\\:hidden { display: none !important; }
          .print\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}

function Book({ children, onLeft, onRight }: { children: React.ReactNode; onLeft: () => void; onRight: () => void }) {
  return (
    <Card className="relative mx-auto h-[70vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <CardHeader className="border-b bg-slate-50/60 py-3">
        <CardTitle className="text-lg">Livro de Páginas</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[calc(70vh-64px)] p-0">
        <div className="absolute inset-0 grid grid-cols-[1fr] md:grid-cols-2">
          {/* Hotzones para virar páginas */}
          <div className="hidden md:block" onClick={onLeft} />
          <div className="hidden md:block" onClick={onRight} />
        </div>
        <div className="relative h-full overflow-auto p-6 md:p-8">{children}</div>
        {/* Bordas decorativas */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200 to-transparent md:block" />
      </CardContent>
    </Card>
  );
}

function NavButton({ dir, onClick, disabled }: { dir: -1 | 1; onClick: () => void; disabled?: boolean }) {
  const Icon = dir === -1 ? ChevronLeft : ChevronRight;
  return (
    <Button onClick={onClick} disabled={disabled} className="h-12 w-12 rounded-full shadow-md" size="icon">
      <Icon className="h-6 w-6" />
    </Button>
  );
}

// === Conteúdo das páginas ===
const Contact = () => (
  <div className="grid gap-2 text-sm text-slate-700">
    <div><strong>📍</strong> Porto Velho – RO</div>
    <div className="break-all"><strong>📧</strong> informedson@gmail.com</div>
    <div><strong>📱</strong> (69) 99266-3459</div>
    <div className="flex items-center gap-1"><LinkIcon className="h-4 w-4"/> <span>LinkedIn: adicione seu link</span></div>
  </div>
);

const PageCover = () => (
  <div className="flex h-full flex-col justify-between">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Edson Ferreira Ramos</h2>
      <p className="mt-1 text-base text-slate-600">Especialista Sênior em Regulação Econômica & Gestão no Setor Elétrico</p>
      <div className="mt-4"><Contact /></div>
    </div>
    <div className="grid gap-2 text-sm text-slate-600">
      <p>Currículo interativo em formato de livro. Para a versão tradicional, use o botão <strong>Imprimir/PDF</strong> acima.</p>
      <p className="text-xs">Atualizado: ago/2025</p>
    </div>
  </div>
);

const PageResumo = () => (
  <section className="prose prose-slate max-w-none">
    <h3>Resumo Profissional</h3>
    <p>
      Profissional com <strong>20+ anos</strong> de experiência no setor elétrico, especializado em
      <strong> regulação econômica e financeira</strong>, gestão de processos tarifários e relacionamento institucional com
      <strong> ANEEL e MME</strong>. Histórico consistente de negociação regulatória, recuperação de receitas bilionárias e
      redução de custos relevantes para distribuidoras. Perfil sênior, visão sistêmica, liderança e capacidade de traduzir
      questões técnicas complexas para públicos diversos (reguladores, consumidores e stakeholders).
    </p>
    <h4>Principais Competências</h4>
    <ul>
      <li>Regulação econômica e financeira no setor elétrico</li>
      <li>Negociação com órgãos reguladores (ANEEL, MME, Judiciário)</li>
      <li>Gestão de processos tarifários (reajustes e revisões)</li>
      <li>Recuperação de receitas e redução de custos</li>
      <li>Relacionamento institucional e comunicação técnica</li>
      <li>Liderança de equipes multidisciplinares</li>
      <li>Gestão de contratos e compliance regulatório</li>
    </ul>
  </section>
);

const PageAmazonas = () => (
  <section className="prose prose-slate max-w-none">
    <h3>Experiência – Amazonas Energia</h3>
    <p><em>Analista de Regulação Econômica Financeira</em> — Porto Velho – RO | 2021 – Atual</p>
    <ul>
      <li>Responsável por reposicionamentos e revisões tarifárias com impacto &gt; <strong>R$ 4,5 bi/ano</strong>.</li>
      <li>Tratativas com ANEEL assegurando reconhecimento tarifário de mudanças tributárias no AM, preservando <strong>&gt; R$ 500 mi/ano</strong>.</li>
      <li>Apoio técnico ao jurídico em ações tarifárias, reduzindo perdas em <strong>R$ 5 mi</strong>.</li>
      <li>Projeto de comunicação clara ao consumidor (site e faturas) para transparência tarifária.</li>
      <li>Análise de subsídios <strong>CDE/CCC</strong> no sistema isolado, validando <strong>R$ 7 bi (2022–2023)</strong>.</li>
    </ul>
  </section>
);

const PageCeron = () => (
  <section className="prose prose-slate max-w-none">
    <h3>Experiência – CERON / Grupo Energisa</h3>
    <p><em>Gerente / Assistente de Regulação</em> — Porto Velho – RO | 2010 – 2018</p>
    <ul>
      <li>Reverteu obrigação de devolver <strong>R$ 733 mi</strong> para direito de receber <strong>R$ 1,6 bi</strong> (Processo ANEEL 2016–2018).</li>
      <li>Coordenou reajustes anuais (2010–2017), recuperando <strong>&gt; R$ 250 mi</strong> em diferentes processos.</li>
      <li>Liderou 2 revisões tarifárias (2009 e 2013) com ganhos &gt; <strong>R$ 25 mi</strong> para custos operacionais.</li>
      <li>Representação em audiências públicas e tratativas com ANEEL e sociedade civil.</li>
    </ul>
  </section>
);

const PageOutras = () => (
  <section className="prose prose-slate max-w-none">
    <h3>Outras Experiências Relevantes</h3>
    <ul>
      <li>
        Implantação de sistema eletrônico de abastecimento de frota — CERON: redução de desperdícios e reforço de compliance junto à ANP.
      </li>
      <li>Gestão de contratos e facilities (logística, correios, mudança de sede administrativa).</li>
      <li>Setor público: Escrivão de Polícia Civil (2004–2006) e Diretor Municipal de Esportes (1995–1997).</li>
    </ul>
  </section>
);

const PageFormacao = () => (
  <section className="prose prose-slate max-w-none">
    <h3>Formação Acadêmica</h3>
    <ul>
      <li>
        <strong>Pós-graduação (Lato Sensu)</strong> — Logística Empresarial<br />
        FATESG – Faculdade de Tecnologia SENAI (2010)
      </li>
      <li>
        <strong>Graduação</strong> — Administração de Empresas<br />
        Universidade Federal de Rondônia (2005)
      </li>
    </ul>
    <h4>Cursos e Aperfeiçoamentos</h4>
    <ul>
      <li>Direito da Energia</li>
      <li>Gestão de Contratos</li>
      <li>Liderança e Desenvolvimento de Pessoas</li>
      <li>Contabilidade Aplicada ao Setor Elétrico</li>
    </ul>
  </section>
);

const PageCTA = () => (
  <section className="prose prose-slate max-w-none">
    <h3>Contato & Próximos Passos</h3>
    <p>
      Disponível para posições de <strong>Regulação Econômico-Financeira</strong>, relacionamento com <strong>ANEEL/MME</strong> e
      liderança de processos tarifários. Abertura para atuação presencial, híbrida ou remota.
    </p>
    <div className="mt-4"><Contact /></div>
    <div className="mt-6 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
      Dica: inclua um <strong>QR Code</strong> para seu LinkedIn ou portfólio nesta página quando publicar online.
    </div>
  </section>
);

const PAGES = [
  <PageCover key="capa" />,
  <PageResumo key="resumo" />,
  <PageAmazonas key="amazonas" />,
  <PageCeron key="ceron" />,
  <PageOutras key="outras" />,
  <PageFormacao key="formacao" />,
  <PageCTA key="cta" />,
];
