const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function numero(v) {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return v;

  return Number(
    String(v)
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );
}

function statusPorcentagem(atual, ideal) {
  const base = numero(ideal);
  const qtd = numero(atual);

  if (base <= 0) {
    return {
      porcentagem: 0,
      cor: "#9ca3af",
      status: "SEM_BASE",
      notificacao: null,
    };
  }

  const porcentagem = (qtd / base) * 100;

  // azul
  if (porcentagem >= 100) {
    return {
      porcentagem,
      cor: "#2563eb",
      status: "CHEIO",
      notificacao: null,
    };
  }

  // verde
  if (porcentagem > 50) {
    return {
      porcentagem,
      cor: "#22c55e",
      status: "OK",
      notificacao: null,
    };
  }

  // laranja
  if (porcentagem > 20) {
    return {
      porcentagem,
      cor: "#f59e0b",
      status: "ATENCAO",
      notificacao: "ATENCAO",
    };
  }

  // vermelho
  return {
    porcentagem,
    cor: "#ef4444",
    status: "CRITICO",
    notificacao: "CRITICO",
  };
}

function diasAte(data) {
  if (!data) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(data);
  alvo.setHours(0, 0, 0, 0);
  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
}

async function criarAdminInicial() {
  const total = await prisma.user.count();
  if (total === 0) {
    await prisma.user.create({
      data: {
        nome: "Administrador",
        email: "admin@admin.com",
        senha: "123456",
        role: "ADMIN",
        ativo: true,
      },
    });
  }
}

async function criarOuAtualizarNotificacao({ chave, tipo, titulo, mensagem, status }) {
  await prisma.notification.upsert({
    where: { chave },
    update: { tipo, titulo, mensagem, status, lida: false },
    create: { chave, tipo, titulo, mensagem, status, lida: false },
  });
}

app.get("/", (req, res) => {
  res.json({ message: "API Marché Brésil funcionando 🚀" });
});

// AUTH
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.ativo || user.senha !== senha) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const { senha: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// USERS
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: "desc" } });
    res.json(users.map(({ senha, ...u }) => u));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        role: req.body.role || "OPERADOR",
        ativo: true,
      },
    });

    const { senha, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        nome: req.body.nome,
        email: req.body.email,
        role: req.body.role,
        ativo: Boolean(req.body.ativo),
      },
    });

    const { senha, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id/password", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    if (req.body.senhaAtual && user.senha !== req.body.senhaAtual) {
      return res.status(400).json({ error: "Senha atual incorreta" });
    }

    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { senha: req.body.novaSenha },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STOCKS
app.get("/stocks", async (req, res) => {
  try {
    const data = await prisma.stock.findMany({ orderBy: { id: "asc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/stocks", async (req, res) => {
  try {
    const item = await prisma.stock.create({ data: { nome: req.body.nome, fixed: false } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/stocks/:id", async (req, res) => {
  try {
    const item = await prisma.stock.update({ where: { id: Number(req.params.id) }, data: { nome: req.body.nome } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/stocks/:id", async (req, res) => {
  try {
    await prisma.stock.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GROUPS
app.get("/groups", async (req, res) => {
  try {
    const data = await prisma.productGroup.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/groups", async (req, res) => {
  try {
    const item = await prisma.productGroup.create({ data: { nome: req.body.nome } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/groups/:id", async (req, res) => {
  try {
    const item = await prisma.productGroup.update({ where: { id: Number(req.params.id) }, data: { nome: req.body.nome } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/groups/:id", async (req, res) => {
  try {
    await prisma.productGroup.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const data = await prisma.product.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const item = await prisma.product.create({
      data: {
        nome: req.body.nome,
        codigo: req.body.codigo,
        grupo: req.body.grupo,
        medida: req.body.medida,
        estoqueIdeal: numero(req.body.estoqueIdeal),
      },
    });

    const limites = req.body.limites || [];
    for (const limite of limites) {
      if (!limite.estoque) continue;
      await prisma.productStockLimit.create({
        data: {
          produto: item.nome,
          estoque: limite.estoque,
          estoqueIdeal: numero(limite.estoqueIdeal),
        },
      });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const produtoAntigo = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    const item = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        nome: req.body.nome,
        codigo: req.body.codigo,
        grupo: req.body.grupo,
        medida: req.body.medida,
        estoqueIdeal: numero(req.body.estoqueIdeal),
      },
    });

    if (produtoAntigo && produtoAntigo.nome !== item.nome) {
      await prisma.productStockLimit.updateMany({
        where: { produto: produtoAntigo.nome },
        data: { produto: item.nome },
      });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const produto = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    if (produto) await prisma.productStockLimit.deleteMany({ where: { produto: produto.nome } });
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STOCK LIMITS
app.get("/stock-limits", async (req, res) => {
  try {
    const data = await prisma.productStockLimit.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/stock-limits", async (req, res) => {
  try {
    const item = await prisma.productStockLimit.create({
      data: {
        produto: req.body.produto,
        estoque: req.body.estoque,
        estoqueIdeal: numero(req.body.estoqueIdeal),
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/stock-limits/:id", async (req, res) => {
  try {
    await prisma.productStockLimit.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUPPLIERS
app.get("/suppliers", async (req, res) => {
  try {
    const data = await prisma.supplier.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/suppliers", async (req, res) => {
  try {
    const item = await prisma.supplier.create({
      data: {
        nome: req.body.nome,
        cnpj: req.body.cnpj || "",
        telefone: req.body.telefone || "",
        email: req.body.email || "",
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/suppliers/:id", async (req, res) => {
  try {
    const item = await prisma.supplier.update({
      where: { id: Number(req.params.id) },
      data: {
        nome: req.body.nome,
        cnpj: req.body.cnpj || "",
        telefone: req.body.telefone || "",
        email: req.body.email || "",
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/suppliers/:id", async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ENTRIES
app.get("/entries", async (req, res) => {
  try {
    const data = await prisma.entry.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/entries", async (req, res) => {
  try {
    const item = await prisma.entry.create({
      data: {
        produto: req.body.produto,
        fornecedor: req.body.fornecedor || "",
        notaFiscal: req.body.notaFiscal || "",
        quantidade: numero(req.body.quantidade),
        valorCompra: numero(req.body.valorCompra),
        valorVenda: numero(req.body.valorVenda),
        estoqueDestino: req.body.estoqueDestino,
        validade: req.body.validade ? new Date(req.body.validade) : null,
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/entries/:id", async (req, res) => {
  try {
    const item = await prisma.entry.update({
      where: { id: Number(req.params.id) },
      data: {
        produto: req.body.produto,
        fornecedor: req.body.fornecedor || "",
        notaFiscal: req.body.notaFiscal || "",
        quantidade: numero(req.body.quantidade),
        valorCompra: numero(req.body.valorCompra),
        valorVenda: numero(req.body.valorVenda),
        estoqueDestino: req.body.estoqueDestino,
        validade: req.body.validade ? new Date(req.body.validade) : null,
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/entries/:id", async (req, res) => {
  try {
    await prisma.entry.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPOSITIONS
app.get("/repositions", async (req, res) => {
  try {
    const data = await prisma.reposition.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/repositions", async (req, res) => {
  try {
    const item = await prisma.reposition.create({
      data: {
        produto: req.body.produto,
        quantidade: numero(req.body.quantidade),
        origem: req.body.origem,
        destino: req.body.destino,
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/repositions/:id", async (req, res) => {
  try {
    const item = await prisma.reposition.update({
      where: { id: Number(req.params.id) },
      data: {
        produto: req.body.produto,
        quantidade: numero(req.body.quantidade),
        origem: req.body.origem,
        destino: req.body.destino,
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/repositions/:id", async (req, res) => {
  try {
    await prisma.reposition.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SALES
app.get("/sales", async (req, res) => {
  try {
    const data = await prisma.sale.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sales", async (req, res) => {
  try {
    if (!req.body.estoqueOrigem) return res.status(400).json({ error: "Escolha o estoque de origem" });

    const item = await prisma.sale.create({
      data: {
        codigoVenda: req.body.codigoVenda || `VD-${Date.now()}`,
        produto: req.body.produto,
        codigo: req.body.codigo,
        quantidade: numero(req.body.quantidade),
        valor: numero(req.body.valor),
        estoqueOrigem: req.body.estoqueOrigem,
      },
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/sales/:id", async (req, res) => {
  try {
    await prisma.sale.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPORTS
app.get("/reports", async (req, res) => {
  try {
    const produtos = await prisma.product.findMany();
    const entradas = await prisma.entry.findMany();
    const vendas = await prisma.sale.findMany();
    const reposicoes = await prisma.reposition.findMany();
    const estoques = await prisma.stock.findMany();
    const limites = await prisma.productStockLimit.findMany();

    const produtosRelatorio = produtos.map((produto) => {
      const entradasProduto = entradas.filter((e) => e.produto === produto.nome);
      const vendasProduto = vendas.filter((v) => v.produto === produto.nome);
      const reposicoesProduto = reposicoes.filter((r) => r.produto === produto.nome);
      const limitesProduto = limites.filter((l) => l.produto === produto.nome);
      const estoquePorLocal = {};

      estoques.forEach((e) => (estoquePorLocal[e.nome] = 0));
      entradasProduto.forEach((e) => {
        if (!estoquePorLocal[e.estoqueDestino]) estoquePorLocal[e.estoqueDestino] = 0;
        estoquePorLocal[e.estoqueDestino] += numero(e.quantidade);
      });
      reposicoesProduto.forEach((r) => {
        if (!estoquePorLocal[r.origem]) estoquePorLocal[r.origem] = 0;
        if (!estoquePorLocal[r.destino]) estoquePorLocal[r.destino] = 0;
        estoquePorLocal[r.origem] -= numero(r.quantidade);
        estoquePorLocal[r.destino] += numero(r.quantidade);
      });
      vendasProduto.forEach((v) => {
        if (!estoquePorLocal[v.estoqueOrigem]) estoquePorLocal[v.estoqueOrigem] = 0;
        estoquePorLocal[v.estoqueOrigem] -= numero(v.quantidade);
      });

      const estoqueDetalhado = Object.entries(estoquePorLocal).map(([local, quantidade]) => {
        const limiteLocal = limitesProduto.find((l) => l.estoque === local);
        const ideal = limiteLocal?.estoqueIdeal || produto.estoqueIdeal || 0;
        const status = statusPorcentagem(quantidade, ideal);
        return {
          local,
          estoque: local,
          quantidade,
          estoqueIdeal: ideal,
          porcentagem: status.porcentagem,
          cor: status.cor,
          status: status.status,
        };
      });

      const estoqueTotal = Object.values(estoquePorLocal).reduce((acc, qtd) => acc + numero(qtd), 0);
      const vendido = vendasProduto.reduce((acc, v) => acc + numero(v.quantidade), 0);
      const faturamentoVendido = vendasProduto.reduce((acc, v) => acc + numero(v.quantidade) * numero(v.valor), 0);
      const ultimaEntrada = [...entradasProduto].reverse()[0];
      const totalIdeal = estoqueDetalhado.reduce((acc, e) => acc + numero(e.estoqueIdeal), 0);
      const statusTotal = statusPorcentagem(estoqueTotal, totalIdeal);

      return {
        produto: produto.nome,
        grupo: produto.grupo,
        codigo: produto.codigo,
        estoqueIdeal: produto.estoqueIdeal,
        totalIdeal,
        estoqueDetalhado,
        estoqueTotal,
        vendido,
        valorCompra: ultimaEntrada?.valorCompra || 0,
        valorVenda: ultimaEntrada?.valorVenda || 0,
        faturamentoVendido,
        porcentagemEstoque: statusTotal.porcentagem,
        corEstoque: statusTotal.cor,
        statusEstoque: statusTotal.status,
      };
    });

    const faturamento = vendas.reduce((acc, v) => acc + numero(v.valor) * numero(v.quantidade), 0);
    const custoEntradas = entradas.reduce((acc, e) => acc + numero(e.valorCompra) * numero(e.quantidade), 0);
    const lucro = faturamento - custoEntradas;

    res.json({
      produtos: produtosRelatorio,
      totalEntradas: entradas.length,
      totalReposicoes: reposicoes.length,
      totalVendas: vendas.length,
      faturamento,
      custoEntradas,
      lucro,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTIFICATIONS
app.get("/notifications", async (req, res) => {
  try {
    const data = await prisma.notification.findMany({ orderBy: { id: "desc" }, take: 50 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/notifications/:id/read", async (req, res) => {
  try {
    const item = await prisma.notification.update({ where: { id: Number(req.params.id) }, data: { lida: true } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notifications/check", async (req, res) => {
  try {
    const reportsReq = { json: (data) => data };
    const produtos = await prisma.product.findMany();
    const entradas = await prisma.entry.findMany();
    const vendas = await prisma.sale.findMany();
    const reposicoes = await prisma.reposition.findMany();
    const estoques = await prisma.stock.findMany();
    const limites = await prisma.productStockLimit.findMany();

    let criadas = 0;

    for (const produto of produtos) {
      const entradasProduto = entradas.filter((e) => e.produto === produto.nome);
      const vendasProduto = vendas.filter((v) => v.produto === produto.nome);
      const reposicoesProduto = reposicoes.filter((r) => r.produto === produto.nome);
      const limitesProduto = limites.filter((l) => l.produto === produto.nome);
      const estoquePorLocal = {};

      estoques.forEach((e) => (estoquePorLocal[e.nome] = 0));
      entradasProduto.forEach((e) => (estoquePorLocal[e.estoqueDestino] = numero(estoquePorLocal[e.estoqueDestino]) + numero(e.quantidade)));
      reposicoesProduto.forEach((r) => {
        estoquePorLocal[r.origem] = numero(estoquePorLocal[r.origem]) - numero(r.quantidade);
        estoquePorLocal[r.destino] = numero(estoquePorLocal[r.destino]) + numero(r.quantidade);
      });
      vendasProduto.forEach((v) => (estoquePorLocal[v.estoqueOrigem] = numero(estoquePorLocal[v.estoqueOrigem]) - numero(v.quantidade)));

      for (const [local, quantidade] of Object.entries(estoquePorLocal)) {
        const limiteLocal = limitesProduto.find((l) => l.estoque === local);
        const ideal = limiteLocal?.estoqueIdeal || produto.estoqueIdeal || 0;
        const status = statusPorcentagem(quantidade, ideal);

        if (status.notificacao) {
          await criarOuAtualizarNotificacao({
            chave: `estoque-${produto.id}-${local}-${status.status}`,
            tipo: "ESTOQUE",
            titulo:
  status.notificacao === "ATENCAO"
    ? `Estoque Atenção: ${produto.nome}`
    : `Estoque Baixo: ${produto.nome}`,

mensagem: `${produto.nome} no estoque ${local} está com ${quantidade} unidade(s). Ideal: ${ideal}.`,

status: status.notificacao,
          });
          criadas++;
        }
      }
    }

    for (const entrada of entradas) {
      if (!entrada.validade) continue;
      const diff = diasAte(entrada.validade);

      if (diff <= 10) {
        const status = diff <= 0 ? "CRITICO" : "ATENCAO";
        await criarOuAtualizarNotificacao({
          chave: `validade-${entrada.id}-${status}`,
          tipo: "VALIDADE",
          titulo:
  status === "CRITICO"
    ? `Vencido: ${entrada.produto}`
    : `Próximo do vencimento: ${entrada.produto}`,
          mensagem:
            diff <= 0
              ? `${entrada.produto} venceu em ${new Date(entrada.validade).toLocaleDateString("pt-BR")}.`
              : `${entrada.produto} vence em ${diff} dia(s), em ${new Date(entrada.validade).toLocaleDateString("pt-BR")}.`,
          status,
        });
        criadas++;
      }
    }

    await criarOuAtualizarNotificacao({
  chave: "app-teste",
  tipo: "APP",
  titulo: "Novo pedido Shopify",
  mensagem: "Pedido #1001 recebido do Shopify.",
  status: "APP",
});

    res.json({ success: true, criadas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await criarAdminInicial();
  app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
    console.log("Usuário inicial: admin@admin.com / 123456");
  });
}

start();
