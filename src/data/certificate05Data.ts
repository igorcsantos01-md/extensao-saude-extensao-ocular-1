export interface CertificateAxis {
  id: string;
  axisTitle: string;
  axisSubtitle: string;
  description: string;
  workload: string;
}

export interface MythTruthItem {
  id: string;
  category: 'Receitas Caseiras' | 'Automedicação' | 'Mídias Sociais' | 'Urgência Ocular';
  statement: string;
  popularOrigin: string;
  verdict: 'MITO PERIGOSO' | 'VERDADE CIENTÍFICA';
  riskSeverity: 'Crítico' | 'Alto' | 'Preventivo';
  clinicalExplanation: string;
  anatomicalTarget: string;
  officialGuideline: string;
}

export interface ClinicalRiskAgent {
  id: string;
  name: string;
  popularClaim: string;
  riskLevel: 'Risco Extremo de Cegueira' | 'Risco Alto de Úlcera Corneana' | 'Risco Farmacológico Grave';
  phOrMechanism: string;
  affectedStructures: string[];
  pathologies: string[];
  clinicalSummary: string;
  immediateConduct: string;
}

export const CERTIFICATE_05_META = {
  certNumber: '05',
  bookNumber: '01/2024',
  pageNumber: '31',
  verificationCode: 'EMS-EXT-2024-0519',
  controlKey: '0519-7741-9204-8B3E',
  sha256Hash: '7f51b93c8e420d1a6f3590c82e74d1b6a904f8c3e1275d8b40a96c15e38b0519',
  permanentBaseUrl: 'https://extensao-saude-colirios-caseiros.vercel.app/',
  permanentVerificationUrl:
    'https://extensao-saude-colirios-caseiros.vercel.app/?codigo=EMS-EXT-2024-0519#validador',
  holderName: 'LUCAS GONÇALVES SILVEIRA',
  holderRole: 'Médico',
  holderCpf: '702.794.941-57',
  holderInstitution: 'Centro Universitário Alfredo Nasser (UNIFAN)',
  projectTitle:
    'Projeto de Extensão "Mitos e Verdades na Saúde Ocular": Combate à Desinformação nas Redes Sociais e Alerta contra Colírios Caseiros',
  editalFramingFront: 'Campanha Educativa e Atividade Comunitária',
  editalFramingBack:
    'Item 08 - Atividades de Extensão: Campanhas educativas, de vacinação, coleta de dados populacionais e atividades comunitárias',
  periodText: '12 a 14 de junho de 2024',
  periodShort: '12 a 14 de junho de 2024',
  issueLocationAndDate: 'Goiânia - GO, 21 de junho de 2024.',
  workloadText: '10 (dez) horas',
  workloadShort: '10h',
  issuer1: {
    name: 'EDITORA MENTE E SAÚDE',
    cnpj: '51.372.335/0001-71',
    department: 'Conselho Editorial e Extensão Científica',
    signerName: 'BÁRBARA LIMA DOS SANTOS',
    signerRole: 'Editora-Chefe e Coordenadora de Extensão Editorial',
  },
  issuer2: {
    name: 'CENTRO PROFISSIONALIZANTE MARIA DALVA DE ARAÚJO',
    shortName: 'Centro Maria Dalva de Araújo',
    cnpj: '51.269.112/0001-83',
    signerName: 'JAMES ARAÚJO DE SANTANA',
    signerRole: 'Coordenador de Extensão e Projetos Educativos',
  },
  axes: [
    {
      id: 'eixo-1',
      axisTitle: 'Eixo I — Curadoria Científica e Mapeamento Infodemiológico Digital',
      axisSubtitle: 'Levantamento de Desinformação e Coleta de Dados Populacionais',
      description:
        'Estruturação e aplicação de enquete digital interativa de "Mito ou Verdade" aberta ao público (coleta de dados populacionais sobre crenças e uso de receitas caseiras nos olhos) e mapeamento das principais fake news oftalmológicas nas redes sociais.',
      workload: '02h 30min',
    },
    {
      id: 'eixo-2',
      axisTitle: 'Eixo II — Produção Editorial de Cards e Mini E-book de Alerta Sanitário',
      axisSubtitle: 'Editoração Científica sobre Riscos de Colírios Caseiros e Automedicação',
      description:
        'Revisão de literatura oftalmológica e elaboração didática de série de cards interativos e do Mini E-book "Olhos Seguros: Mitos, Verdades e o Perigo dos Colírios Caseiros", fundamentado em diretrizes do CBO, ANVISA e OMS.',
      workload: '03h 00min',
    },
    {
      id: 'eixo-3',
      axisTitle: 'Eixo III — Comunicação Científica e Combate a Fake News em Saúde Ocular',
      axisSubtitle: 'Prevenção de Úlceras de Córnea, Ceratites Infecciosas e Queimaduras Químicas',
      description:
        'Campanha educativa virtual de alerta contra o uso ocular de leite materno, suco de limão, chás caseiros, água boricada e colírios vasoconstritores ou corticoides sem prescrição médica, detalhando riscos de perfuração corneana e cegueira.',
      workload: '02h 30min',
    },
    {
      id: 'eixo-4',
      axisTitle: 'Eixo IV — Ação Comunitária e Divulgação dos Canais de Urgência do SUS',
      axisSubtitle: 'Cidadania em Saúde Visual e Fluxo de Emergência Oftalmológica',
      description:
        'Entrega comunitária gratuita do guia preventivo aos participantes da enquete populacional e orientação sobre conduta imediata de lavagem ocular, sinais de alarme e acesso às portas de Urgência Oftalmológica do SUS, UPA 24h e SAMU 192.',
      workload: '02h 00min',
    },
  ] as CertificateAxis[],
};

export const MYTHS_AND_TRUTHS_DATA: MythTruthItem[] = [
  {
    id: 'mt-01',
    category: 'Receitas Caseiras',
    statement: 'Pingar gotas de limão ou alho nos olhos limpa a visão, "cura catarata" e elimina conjuntivite.',
    popularOrigin: 'Vídeos virais em redes sociais promovendo "colírios naturais detox".',
    verdict: 'MITO PERIGOSO',
    riskSeverity: 'Crítico',
    clinicalExplanation:
      'O suco de limão possui pH altamente ácido (entre 2,0 e 2,5), enquanto a lágrima humana tem pH neutro (~7,4). A instilação ocular provoca queimadura química imediata do epitélio corneano, desnaturação de proteínas do estroma, cicatrizes permanentes (leucoma) e não tem qualquer efeito sobre a catarata, cujo tratamento é exclusivamente cirúrgico.',
    anatomicalTarget: 'Epitélio Corneano, Limbo Esclerocorneano e Conjuntiva Bulbar',
    officialGuideline: 'Conselho Brasileiro de Oftalmologia (CBO) & Sociedade Brasileira de Córnea',
  },
  {
    id: 'mt-02',
    category: 'Receitas Caseiras',
    statement: 'Pingar leite materno nos olhos de recém-nascidos ou adultos trata conjuntivite e desobstrui o canal lacrimal.',
    popularOrigin: 'Crença tradicional amplamente replicada em grupos maternos e fóruns digitais.',
    verdict: 'MITO PERIGOSO',
    riskSeverity: 'Crítico',
    clinicalExplanation:
      'Embora o leite materno contenha IgA secretora para o trato gastrointestinal do bebê, ele não é estéril no momento da ordenha manual e é rico em lactose e lipídios. Na superfície ocular, funciona como meio de cultura rico para proliferação bacteriana (Staphylococcus, Pseudomonas e Gonococo), agravando quadros de conjuntivite neonatal e podendo levar à úlcera de córnea perfurada.',
    anatomicalTarget: 'Saco Conjuntival, Córnea e Via Lacrimal Excretora',
    officialGuideline: 'Ministério da Saúde — Diretrizes de Atenção à Saúde Ocular na Infância',
  },
  {
    id: 'mt-03',
    category: 'Receitas Caseiras',
    statement: 'Lavar os olhos inflamados com água boricada ou compressas de chá de camomila caseiro é seguro e antisséptico.',
    popularOrigin: 'Hábito doméstico antigo e recomendações informais sem respaldo oftalmológico.',
    verdict: 'MITO PERIGOSO',
    riskSeverity: 'Alto',
    clinicalExplanation:
      'A água boricada (ácido bórico) causa toxicidade direta às células epiteliais da córnea e altera o filme lacrimal, além de contaminar-se facilmente após aberta. Chás caseiros contêm micropartículas vegetais, pólen e fungos filamentosos que podem desencadear ceratite fúngica grave e uveíte alérgica. A higiene ocular segura deve ser feita apenas com Soro Fisiológico 0,9% estéril em flaconete de uso único.',
    anatomicalTarget: 'Filme Lacrimal, Epitélio Corneano e Margem Palpebral',
    officialGuideline: 'ANVISA — Alertas de Farmacovigilância & CBO',
  },
  {
    id: 'mt-04',
    category: 'Automedicação',
    statement: 'Colírios "clareadores" que deixam o olho branquinho em segundos podem ser usados diariamente sem receita médica.',
    popularOrigin: 'Propagação em vídeos de estética e rotina de beleza ("olhar descansado instantâneo").',
    verdict: 'MITO PERIGOSO',
    riskSeverity: 'Alto',
    clinicalExplanation:
      'Esses colírios contêm vasoconstritores adrenérgicos (como nafazolina ou tetrizolina). O uso repetido gera isquemia transitória seguida de hiperemia rebote severa (o olho fica cada vez mais vermelho quando o efeito passa), mascarando doenças graves como uveíte, ceratite herpética ou crise aguda de glaucoma de ângulo fechado, além de causar taquifilaxia e risco cardiovascular sistêmico.',
    anatomicalTarget: 'Vasos Conjuntivais, Malha Trabecular e Íris',
    officialGuideline: 'Conselho Brasileiro de Oftalmologia (CBO) — Campanha Contra Automedicação',
  },
  {
    id: 'mt-05',
    category: 'Automedicação',
    statement: 'Usar um colírio antibiótico ou anti-inflamatório que sobrou na gaveta de outro familiar é perigoso e pode causar glaucoma ou catarata.',
    popularOrigin: 'Orientação médica de farmacovigilância oftalmológica.',
    verdict: 'VERDADE CIENTÍFICA',
    riskSeverity: 'Preventivo',
    clinicalExplanation:
      'Colírios contendo corticosteroides (como dexametasona ou prednisolona) usados sem supervisão oftalmológica elevam a pressão intraocular (glaucoma cortisônico irreversível), induzem catarata subcapsular posterior e multiplicam de forma explosiva infecções virais (herpes simples ocular) e fúngicas. Além disso, frascos abertos há mais de 30 dias acumulam bactérias no bico gotejador.',
    anatomicalTarget: 'Nervo Óptico, Cristalino e Estroma Corneano',
    officialGuideline: 'OMS & Protocolos Clínicos de Segurança do Paciente (Ministério da Saúde)',
  },
  {
    id: 'mt-06',
    category: 'Urgência Ocular',
    statement: 'Em caso de queda de produto químico ou colírio caseiro cáustico nos olhos, a primeira medida é lavar imediatamente com água corrente limpa ou soro fisiológico por pelo menos 15 a 30 minutos.',
    popularOrigin: 'Protocolo internacional de suporte básico em trauma ocular químico.',
    verdict: 'VERDADE CIENTÍFICA',
    riskSeverity: 'Preventivo',
    clinicalExplanation:
      'No trauma químico ocular, cada segundo determina o prognóstico visual. Nunca se deve pingar outra substância para "neutralizar" o agente (a reação química gera calor e agrava a queimadura). A irrigação abundante e imediata no local do acidente dilui o agente agressor e normaliza o pH antes mesmo do deslocamento imediato à Urgência Oftalmológica do SUS ou acionamento do SAMU 192.',
    anatomicalTarget: 'Superfície Ocular Total e Células-Tronco Límbicas',
    officialGuideline: 'Ministério da Saúde — Protocolos de Suporte Básico de Vida (SAMU 192)',
  },
  {
    id: 'mt-07',
    category: 'Mídias Sociais',
    statement: 'Mel de abelha "puro" ou óleo de rícino aplicados dentro do olho clareiam a cor da íris e regeneram a visão cansada.',
    popularOrigin: 'Tendências virais em redes de vídeos curtos sobre mudança estética da cor dos olhos.',
    verdict: 'MITO PERIGOSO',
    riskSeverity: 'Crítico',
    clinicalExplanation:
      'Nenhum colírio ou substância tópica altera a melanina estromal da íris de forma segura. O mel in natura e óleos cosméticos não são estéreis, têm osmolaridade incompatível com a córnea e podem conter esporos bacterianos (Clostridium) e fungos, provocando ceratite infecciosa devastadora, endoftalmite e perda irreversível do globo ocular.',
    anatomicalTarget: 'Córnea, Câmara Anterior e Íris',
    officialGuideline: 'Academia Americana de Oftalmologia (AAO) & CBO',
  },
  {
    id: 'mt-08',
    category: 'Urgência Ocular',
    statement: 'Lentes de contato nunca devem ser lavadas ou guardadas em água da torneira, água mineral ou saliva devido ao risco de infecção por Acanthamoeba.',
    popularOrigin: 'Diretrizes médicas de adaptação e higiene de lentes de contato.',
    verdict: 'VERDADE CIENTÍFICA',
    riskSeverity: 'Preventivo',
    clinicalExplanation:
      'A água encanada, mineral, de chuveiro ou piscina contém protozoários de vida livre do gênero Acanthamoeba. Quando aderidos à lente de contato, esses microrganismos penetram em microfissuras epiteliais e causam a Ceratite por Acanthamoeba — uma das infecções oculares mais dolorosas, graves e de difícil tratamento, frequentemente exigindo transplante de córnea.',
    anatomicalTarget: 'Epitélio e Estroma Corneano Profundo',
    officialGuideline: 'Sociedade Brasileira de Lentes de Contato, Córnea e Refratometria (SOBLEC)',
  },
];

export const CLINICAL_RISK_AGENTS: ClinicalRiskAgent[] = [
  {
    id: 'agent-limao',
    name: 'Suco de Limão, Alho e Extratos Cítricos',
    popularClaim: 'Promessa viral de "limpeza ocular profunda", cura de pterígio ("carne crescida") e catarata.',
    riskLevel: 'Risco Extremo de Cegueira',
    phOrMechanism: 'pH 2,0–2,4 (Ácido Cítrico Concentrado) + Compostos Sulfurados Irritantes',
    affectedStructures: ['Epitélio Corneano', 'Células-Tronco do Limbo', 'Estroma Anterior', 'Conjuntiva'],
    pathologies: [
      'Queimadura Química Ácida Aguda',
      'Desepitelização Corneana Extensa',
      'Deficiência Límbica e Neovascularização',
      'Opacificação Corneana Permanente (Leucoma)',
    ],
    clinicalSummary:
      'Provoca coagulação imediata das proteínas epiteliais e intensa dor neurogênica. Quando atinge o limbo esclerocorneano, destrói as células-tronco responsáveis pela regeneração da superfície ocular, levando à conjuntivalização da córnea e baixa visual permanente.',
    immediateConduct:
      'Irrigação ocular contínua com Soro Fisiológico 0,9% ou água corrente limpa por 20 a 30 minutos com pálpebras evertidas, seguida de encaminhamento imediato à Urgência Oftalmológica do SUS.',
  },
  {
    id: 'agent-leite',
    name: 'Leite Materno e Colostro In Natura',
    popularClaim: 'Recomendação popular para tratar conjuntivite em recém-nascidos e lacrimejamento.',
    riskLevel: 'Risco Alto de Úlcera Corneana',
    phOrMechanism: 'Meio Rico em Lactose e Lipídios Não Estéril na Superfície Ocular',
    affectedStructures: ['Córnea Neonatal', 'Saco Conjuntival', 'Ducto Nasolacrimal'],
    pathologies: [
      'Ceratite Bacteriana Secundária (Staphylococcus / Pseudomonas)',
      'Agravamento de Conjuntivite Neonatal (Oftalmia Neonatal)',
      'Úlcera de Córnea com Risco de Perfuração em 24–48h',
    ],
    clinicalSummary:
      'A lactose e os ácidos graxos do leite formam depósitos sobre o filme lacrimal e servem de substrato nutricional para bactérias patogênicas. Em recém-nascidos, atrasa o diagnóstico e tratamento antibiótico adequado da conjuntivite bacteriana ou gonocócica.',
    immediateConduct:
      'Suspensão imediata da prática, limpeza externa exclusiva com Soro Fisiológico 0,9% estéril e avaliação médica imediata na UBS ou maternidade/urgência pediátrica do SUS.',
  },
  {
    id: 'agent-boricada',
    name: 'Água Boricada e Chás Caseiros (Camomila/Ervas)',
    popularClaim: 'Uso doméstico rotineiro para "acalmar olhos irritados" e lavar secreções.',
    riskLevel: 'Risco Alto de Úlcera Corneana',
    phOrMechanism: 'Citotoxicidade do Ácido Bórico + Contaminação Fúngica e Partículas Vegetais',
    affectedStructures: ['Filme Lacrimal', 'Epitélio Corneano', 'Fórnice Conjuntival'],
    pathologies: [
      'Ceratite Fúngica Filamentosa (Fusarium / Aspergillus)',
      'Ceratopatia Tóxica Epitelial Pontuada',
      'Instabilidade Severa do Filme Lacrimal',
    ],
    clinicalSummary:
      'A água boricada é contraindicada pela ANVISA e pelo CBO para lavagem ocular devido à toxicidade epitelial e rápida contaminação do frasco. Infusões caseiras de ervas não possuem controle de osmolaridade e carregam esporos fúngicos resistentes à fervura simples.',
    immediateConduct:
      'Descarte imediato da solução, substituição apenas por Soro Fisiológico 0,9% estéril (preferencialmente flaconete monodose) e avaliação oftalmológica caso haja dor ou turvação visual.',
  },
  {
    id: 'agent-vasoconstritor',
    name: 'Colírios "Clareadores" (Vasoconstritores sem Prescrição)',
    popularClaim: 'Uso cosmético diário para eliminar vermelhidão ocular após telas ou privação de sono.',
    riskLevel: 'Risco Farmacológico Grave',
    phOrMechanism: 'Agonistas Alfa-Adrenérgicos (Nafazolina / Fenilefrina) + Cloreto de Benzalcônio (BAK)',
    affectedStructures: ['Microvasculatura Conjuntival', 'Ângulo Camerular', 'Epitélio Corneano'],
    pathologies: [
      'Conjuntivite Medicamentosa e Hiperemia Rebote Crônica',
      'Crise Aguda de Glaucoma de Ângulo Fechado (por midríase)',
      'Mascaramento de Uveítes e Ceratites Infecciosas',
    ],
    clinicalSummary:
      'Ao forçar a vasoconstrição artificial, priva a superfície ocular de oxigênio e nutrientes. Quando o efeito cessa, ocorre vasodilatação reflexa persistente, criando dependência do colírio e destruindo as células caliciformes produtoras de mucina.',
    immediateConduct:
      'Descontinuação orientada pelo oftalmologista, transição para lubrificantes oculares sem conservantes e investigação da causa real do olho vermelho na rede de saúde.',
  },
  {
    id: 'agent-corticoide',
    name: 'Colírios com Corticoide / Antibiótico de Terceiros',
    popularClaim: 'Automedicação com colírio guardado em casa para "curar rápido" dor ou terçol.',
    riskLevel: 'Risco Extremo de Cegueira',
    phOrMechanism: 'Imunossupressão Local da Superfície Ocular + Aumento da Resistência Trabecular',
    affectedStructures: ['Nervo Óptico', 'Malha Trabecular', 'Cristalino', 'Estroma Corneano'],
    pathologies: [
      'Glaucoma Cortisônico (Dano Irreversível ao Nervo Óptico)',
      'Agravamento Fulminante de Ceratite Herpética (Úlcera Dendrítica -> Geográfica)',
      'Catarata Subcapsular Posterior Precoce',
    ],
    clinicalSummary:
      'Se o paciente tiver uma úlcera viral (herpes simples) ou fúngica e pingar corticoide por conta própria, a resposta imune local é inibida e a infecção se multiplica rapidamente, podendo levar à perfuração corneana em poucos dias.',
    immediateConduct:
      'Nunca iniciar ou interromper colírios hormonais sem biomicroscopia em lâmpada de fenda e aferição da pressão intraocular (tonometria) por médico oftalmologista.',
  },
];

export const CAMPAIGN_IMPACT_METRICS = [
  {
    label: 'Participantes na Enquete "Mito ou Verdade"',
    value: '1.480',
    unit: 'respostas validadas',
    detail: 'Coleta de dados populacionais sobre práticas caseiras em saúde ocular (Junho/2024)',
  },
  {
    label: 'Relato Prévio de Uso de Receitas Caseiras',
    value: '64,2%',
    unit: 'dos respondentes',
    detail: 'Já haviam utilizado água boricada, chás, leite materno ou colírio sem receita',
  },
  {
    label: 'Mini E-books e Folhetos Distribuídos',
    value: '3.200+',
    unit: 'exemplares gratuitos',
    detail: 'Distribuição comunitária física e digital via WhatsApp e páginas de saúde',
  },
  {
    label: 'Carga Horária Extensionista Auditada',
    value: '10h',
    unit: '4 eixos práticos',
    detail: 'Enquadramento integral no Item 08 do Edital FUBOG (Livro 01/2024, Folha 31)',
  },
];
