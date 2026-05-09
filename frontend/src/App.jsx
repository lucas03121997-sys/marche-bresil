import React from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const texts = {
  pt: {
    appName: "Marché Brésil",
    loginSubtitle: "Mercado brasileiro no Canadá",
    login: "Entrar",
    email: "Email",
    password: "Senha",
    dashboard: "Dashboard",
    stock: "Estoque",
    groups: "Grupo de Produtos",
    products: "Produtos",
    suppliers: "Fornecedores",
    entries: "Entradas",
    repositions: "Reposição de Prateleiras",
    sales: "Caixa",
    salesHistory: "Vendas",
    reports: "Relatórios",
    product: "Produto",
    code: "Código",
    group: "Grupo",
    measure: "Medida",
    supplier: "Fornecedor",
    quantity: "Quantidade",
    origin: "Origem",
    destination: "Destino",
    value: "Valor",
    subtotal: "Subtotal",
    total: "Total",
    revenue: "Faturamento",
    purchaseValue: "Valor Compra",
    saleValue: "Valor Venda",
    soldQty: "Qtd Vendida",
    soldTotal: "Total Vendido",
    currentStock: "Estoque Atual",
    create: "Criar",
    add: "Adicionar",
    register: "Registrar",
    finishSale: "Finalizar Venda",
    searchProduct: "Código ou nome do produto",
    invoice: "NF",
    phone: "Telefone",
    name: "Nome",
    actions: "Ações",
    edit: "Editar",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    cost: "Custo",
    profit: "Lucro",
  },
  en: {
    appName: "Marché Brésil",
    loginSubtitle: "Brazilian market in Canada",
    login: "Login",
    email: "Email",
    password: "Password",
    dashboard: "Dashboard",
    stock: "Stock",
    groups: "Product Groups",
    products: "Products",
    suppliers: "Suppliers",
    entries: "Entries",
    repositions: "Shelf Restocking",
    sales: "Checkout",
    salesHistory: "Sales",
    reports: "Reports",
    product: "Product",
    code: "Code",
    group: "Group",
    measure: "Unit",
    supplier: "Supplier",
    quantity: "Quantity",
    origin: "Origin",
    destination: "Destination",
    value: "Price",
    subtotal: "Subtotal",
    total: "Total",
    revenue: "Revenue",
    purchaseValue: "Purchase Price",
    saleValue: "Sale Price",
    soldQty: "Qty Sold",
    soldTotal: "Total Sold",
    currentStock: "Current Stock",
    create: "Create",
    add: "Add",
    register: "Register",
    finishSale: "Finish Sale",
    searchProduct: "Barcode or product name",
    invoice: "Invoice",
    phone: "Phone",
    name: "Name",
    actions: "Actions",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    cost: "Cost",
    profit: "Profit",
  },
  fr: {
    appName: "Marché Brésil",
    loginSubtitle: "Marché brésilien au Canada",
    login: "Connexion",
    email: "Email",
    password: "Mot de passe",
    dashboard: "Tableau de bord",
    stock: "Stock",
    groups: "Groupes de produits",
    products: "Produits",
    suppliers: "Fournisseurs",
    entries: "Entrées",
    repositions: "Réassort des rayons",
    sales: "Caisse",
    salesHistory: "Ventes",
    reports: "Rapports",
    product: "Produit",
    code: "Code",
    group: "Groupe",
    measure: "Unité",
    supplier: "Fournisseur",
    quantity: "Quantité",
    origin: "Origine",
    destination: "Destination",
    value: "Prix",
    subtotal: "Sous-total",
    total: "Total",
    revenue: "Chiffre d’affaires",
    purchaseValue: "Prix d’achat",
    saleValue: "Prix de vente",
    soldQty: "Qté vendue",
    soldTotal: "Total vendu",
    currentStock: "Stock actuel",
    create: "Créer",
    add: "Ajouter",
    register: "Enregistrer",
    finishSale: "Finaliser la vente",
    searchProduct: "Code-barres ou nom du produit",
    invoice: "Facture",
    phone: "Téléphone",
    name: "Nom",
    actions: "Actions",
    edit: "Modifier",
    save: "Sauvegarder",
    cancel: "Annuler",
    delete: "Supprimer",
    cost: "Coût",
    profit: "Profit",
  },
};

function money(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number(value || 0));
}

function translateStock(nome, language) {
  const nomes = {
    "Depósito": {
      pt: "Depósito",
      en: "Warehouse",
      fr: "Dépôt",
    },
    "Prateleira": {
      pt: "Prateleira",
      en: "Shelf",
      fr: "Étagère",
    },
  };

  return nomes[nome]?.[language] || nome;
}


function Login({ onLogin }) {
  const t = texts.pt;
  const [email, setEmail] = React.useState("admin@admin.com");
  const [senha, setSenha] = React.useState("123456");

  const entrar = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, senha });
      localStorage.setItem("marcheUser", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao entrar");
    }
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginBox}>
        <div style={styles.logoArea}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <h1>{t.appName}</h1>
          <p>{t.loginSubtitle}</p>
        </div>

        <input
          style={styles.input}
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder={t.password}
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button style={styles.button} onClick={entrar}>
          {t.login}
        </button>

        <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>
          Primeiro acesso: admin@admin.com / 123456
        </p>
      </div>
    </div>
  );
}

function AppData({ currentUser, onLogout }) {
  const [language, setLanguage] = React.useState("pt");
  const t = texts[language];

  const [estoques, setEstoques] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [produtos, setProdutos] = React.useState([]);
  const [fornecedores, setFornecedores] = React.useState([]);
  const [entradas, setEntradas] = React.useState([]);
  const [reposicoes, setReposicoes] = React.useState([]);
  const [vendas, setVendas] = React.useState([]);
  const [relatorio, setRelatorio] = React.useState(null);
  const [stockLimits, setStockLimits] = React.useState([]);
  const [usuarios, setUsuarios] = React.useState([]);
  const [notificacoes, setNotificacoes] = React.useState([]);

  const data = {
    estoques,
    grupos,
    produtos,
    fornecedores,
    entradas,
    reposicoes,
    vendas,
    relatorio,
    stockLimits,
    usuarios,
    notificacoes,
    currentUser,
  };

  const actions = {
    setEstoques,
    setGrupos,
    setProdutos,
    setFornecedores,
    setEntradas,
    setReposicoes,
    setVendas,
    setRelatorio,
    setStockLimits,
    setUsuarios,
    setNotificacoes,
  };

  React.useEffect(() => {
    carregarTudo(actions, currentUser);
  }, [currentUser]);

  return (
    <Layout
      data={data}
      actions={actions}
      t={t}
      language={language}
      setLanguage={setLanguage}
      currentUser={currentUser}
      onLogout={onLogout}
    />
  );
}

async function carregarTudo(actions, currentUser) {
  const [stocks, groups, products, suppliers, entries, repositions, sales, reports, stockLimits] =
    await Promise.all([
      axios.get(`${API}/stocks`),
      axios.get(`${API}/groups`),
      axios.get(`${API}/products`),
      axios.get(`${API}/suppliers`),
      axios.get(`${API}/entries`),
      axios.get(`${API}/repositions`),
      axios.get(`${API}/sales`),
      axios.get(`${API}/reports`),
      axios.get(`${API}/stock-limits`),
    ]);

  actions.setEstoques(stocks.data);
  actions.setGrupos(groups.data);
  actions.setProdutos(products.data);
  actions.setFornecedores(suppliers.data);
  actions.setEntradas(entries.data);
  actions.setReposicoes(repositions.data);
  actions.setVendas(sales.data);
  actions.setRelatorio(reports.data);
  actions.setStockLimits(stockLimits.data);

  try {
    await axios.post(`${API}/notifications/check`);
    const notifications = await axios.get(`${API}/notifications`);
    actions.setNotificacoes(notifications.data);
  } catch (err) {
    console.log("Erro ao carregar notificações", err);
  }

  if (currentUser?.role === "ADMIN") {
    try {
      const users = await axios.get(`${API}/users`);
      actions.setUsuarios(users.data);
    } catch (err) {
      console.log("Erro ao carregar usuários", err);
    }
  }
}

async function atualizarRelatorio(actions) {
  const reports = await axios.get(`${API}/reports`);
  actions.setRelatorio(reports.data);
}

function Page({ title, children }) {
  return (
    <div>
      <h1 style={styles.title}>{title}</h1>
      {children}
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr style={styles.tableHeader}>
          {headers.map((h) => (
            <th key={h} style={styles.cell}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function ActionButtons({ t, editing, onEdit, onSave, onCancel, onDelete }) {
  if (editing) {
    return (
      <>
        <button style={styles.saveButton} onClick={onSave}>{t.save}</button>
        <button style={styles.cancelButton} onClick={onCancel}>{t.cancel}</button>
      </>
    );
  }

  return (
    <>
      <button style={styles.editButton} onClick={onEdit}>{t.edit}</button>
      <button style={styles.deleteButton} onClick={onDelete}>{t.delete}</button>
    </>
  );
}

function Dashboard({ data, t }) {

  const faturamento = data.relatorio?.faturamento || 0;
  const custo = data.relatorio?.custoEntradas || 0;
  const lucro = data.relatorio?.lucro || 0;

  const totalGrafico = faturamento + custo;

  const faturamentoPercent =
    totalGrafico > 0
      ? (faturamento / totalGrafico) * 100
      : 0;

  return (
    <Page title={t.dashboard}>

      <div style={styles.reportCards}>

        <div style={styles.card}>
          {t.products}: {data.produtos.length}
        </div>

        <div style={styles.card}>
          {t.entries}: {data.entradas.length}
        </div>

        <div style={styles.card}>
          {t.repositions}: {data.reposicoes.length}
        </div>

        <div style={styles.card}>
          {t.salesHistory}: {data.vendas.length}
        </div>

        <div style={styles.card}>
          {t.revenue}: {money(faturamento)}
        </div>

        <div style={styles.card}>
          {t.cost}: {money(custo)}
        </div>

        <div style={styles.card}>
          {t.profit}: {money(lucro)}
        </div>

      </div>

      <div style={styles.chartCard}>

        <h2>Resumo financeiro</h2>

        <div
          style={{
            ...styles.pieChart,
            background: `conic-gradient(
              #22c55e 0% ${faturamentoPercent}%,
              #ef4444 ${faturamentoPercent}% 100%
            )`,
          }}
        />

        <div style={styles.chartLegend}>

          <span>
            🟢 {t.revenue}: {money(faturamento)}
          </span>

          <span>
            🔴 {t.cost}: {money(custo)}
          </span>

          <span>
            💰 {t.profit}: {money(lucro)}
          </span>

        </div>

      </div>

    </Page>
  );
}

function Stock({ data, actions, t, language }) {
  const [nome, setNome] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ nome: "" });

  const adicionar = async () => {
    if (!nome) return;
    const res = await axios.post(`${API}/stocks`, { nome });
    actions.setEstoques([...data.estoques, res.data]);
    setNome("");
  };

  const editar = (item) => {
    setEditId(item.id);
    setEditForm({ nome: item.nome });
  };

  const salvar = async (id) => {
    try {
      const res = await axios.put(`${API}/stocks/${id}`, editForm);
      actions.setEstoques(data.estoques.map((e) => e.id === id ? res.data : e));
      setEditId(null);
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao salvar");
    }
  };

  const excluir = async (id) => {
    if (!confirm(`${t.delete}?`)) return;

    try {
      await axios.delete(`${API}/stocks/${id}`);
      actions.setEstoques(data.estoques.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao excluir");
    }
  };

  return (
    <Page title={t.stock}>
      <input style={styles.input} placeholder={t.stock} value={nome} onChange={(e) => setNome(e.target.value)} />
      <button style={styles.button} onClick={adicionar}>{t.create}</button>

      <Table headers={[t.stock, t.actions]}>
        {data.estoques.map((e) => (
          <tr key={e.id}>
            <td style={styles.cell}>
              {editId === e.id ? (
                <input style={styles.inputInline} value={editForm.nome} onChange={(ev) => setEditForm({ nome: ev.target.value })} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {translateStock(e.nome, language)}
                </div>
              )}
            </td>
            <td style={styles.cell}>
              <ActionButtons
                t={t}
                editing={editId === e.id}
                onEdit={() => editar(e)}
                onSave={() => salvar(e.id)}
                onCancel={() => setEditId(null)}
                onDelete={() => excluir(e.id)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </Page>
  );
}

function ProductGroups({ data, actions, t }) {
  const [nome, setNome] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ nome: "" });

  const adicionar = async () => {
    if (!nome) return;
    const res = await axios.post(`${API}/groups`, { nome });
    actions.setGrupos([res.data, ...data.grupos]);
    setNome("");
  };

  const salvar = async (id) => {
    const res = await axios.put(`${API}/groups/${id}`, editForm);
    actions.setGrupos(data.grupos.map((g) => g.id === id ? res.data : g));
    setEditId(null);
  };

  const excluir = async (id) => {
    if (!confirm(`${t.delete}?`)) return;
    await axios.delete(`${API}/groups/${id}`);
    actions.setGrupos(data.grupos.filter((g) => g.id !== id));
  };

  return (
    <Page title={t.groups}>
      <input style={styles.input} placeholder={t.group} value={nome} onChange={(e) => setNome(e.target.value)} />
      <button style={styles.button} onClick={adicionar}>{t.add}</button>

      <Table headers={[t.group, t.actions]}>
        {data.grupos.map((g) => (
          <tr key={g.id}>
            <td style={styles.cell}>
              {editId === g.id ? (
                <input style={styles.inputInline} value={editForm.nome} onChange={(e) => setEditForm({ nome: e.target.value })} />
              ) : g.nome}
            </td>
            <td style={styles.cell}>
              <ActionButtons
                t={t}
                editing={editId === g.id}
                onEdit={() => { setEditId(g.id); setEditForm({ nome: g.nome }); }}
                onSave={() => salvar(g.id)}
                onCancel={() => setEditId(null)}
                onDelete={() => excluir(g.id)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </Page>
  );
}

function Products({ data, actions, t, language }) {
  const empty = {
    nome: "",
    codigo: "",
    grupo: "",
    medida: "",
    limites: [],
  };

  const [form, setForm] = React.useState(empty);
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState(empty);

  const limitesDoProduto = (produtoNome) => {
    return data.stockLimits
      ?.filter((l) => l.produto === produtoNome)
      .map((l) => ({
        id: l.id,
        estoque: l.estoque,
        estoqueIdeal: l.estoqueIdeal,
      })) || [];
  };

  const adicionarLinhaLimite = () => {
    setForm({
      ...form,
      limites: [...form.limites, { estoque: "", estoqueIdeal: "" }],
    });
  };

  const atualizarLinhaLimite = (index, campo, valor) => {
    const novos = [...form.limites];
    novos[index][campo] = valor;
    setForm({ ...form, limites: novos });
  };

  const removerLinhaLimite = (index) => {
    setForm({
      ...form,
      limites: form.limites.filter((_, i) => i !== index),
    });
  };

  const adicionarLinhaLimiteEdit = () => {
    setEditForm({
      ...editForm,
      limites: [...editForm.limites, { estoque: "", estoqueIdeal: "" }],
    });
  };

  const atualizarLinhaLimiteEdit = (index, campo, valor) => {
    const novos = [...editForm.limites];
    novos[index][campo] = valor;
    setEditForm({ ...editForm, limites: novos });
  };

  const removerLinhaLimiteEdit = async (index) => {
    const limite = editForm.limites[index];

    if (limite.id) {
      await axios.delete(`${API}/stock-limits/${limite.id}`);
    }

    setEditForm({
      ...editForm,
      limites: editForm.limites.filter((_, i) => i !== index),
    });

    await recarregarLimites();
    await atualizarRelatorio(actions);
  };

  const recarregarLimites = async () => {
    const res = await axios.get(`${API}/stock-limits`);
    actions.setStockLimits(res.data);
  };

  const salvarLimitesProduto = async (produtoNome, limites) => {
    for (const limite of limites) {
      if (!limite.estoque || !limite.estoqueIdeal) continue;

      await axios.post(`${API}/stock-limits`, {
        produto: produtoNome,
        estoque: limite.estoque,
        estoqueIdeal: Number(limite.estoqueIdeal || 0),
      });
    }
  };

  const adicionar = async () => {
    if (!form.nome) return;

    const res = await axios.post(`${API}/products`, {
      nome: form.nome,
      codigo: form.codigo,
      grupo: form.grupo,
      medida: form.medida,
      estoqueIdeal: 0,
      limites: form.limites,
    });

    actions.setProdutos([res.data, ...data.produtos]);
    await recarregarLimites();
    await atualizarRelatorio(actions);
    setForm(empty);
  };

  const salvar = async (id) => {
    const res = await axios.put(`${API}/products/${id}`, {
      nome: editForm.nome,
      codigo: editForm.codigo,
      grupo: editForm.grupo,
      medida: editForm.medida,
      estoqueIdeal: 0,
      limites: editForm.limites,
    });

    actions.setProdutos(
      data.produtos.map((p) => (p.id === id ? res.data : p))
    );

    await recarregarLimites();
    await atualizarRelatorio(actions);
    setEditId(null);
  };

  const excluir = async (id) => {
    if (!confirm(`${t.delete}?`)) return;

    await axios.delete(`${API}/products/${id}`);

    actions.setProdutos(data.produtos.filter((p) => p.id !== id));
    await recarregarLimites();
    await atualizarRelatorio(actions);
  };

  const iniciarEdicao = (p) => {
    setEditId(p.id);
    setEditForm({
      nome: p.nome,
      codigo: p.codigo,
      grupo: p.grupo,
      medida: p.medida,
      limites: limitesDoProduto(p.nome),
    });
  };

  return (
    <Page title={t.products}>
      <input
        style={styles.input}
        placeholder={t.product}
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
      />

      <input
        style={styles.input}
        placeholder={t.code}
        value={form.codigo}
        onChange={(e) => setForm({ ...form, codigo: e.target.value })}
      />

      <select
        style={styles.input}
        value={form.grupo}
        onChange={(e) => setForm({ ...form, grupo: e.target.value })}
      >
        <option value="">{t.group}</option>
        {data.grupos.map((g) => (
          <option key={g.id}>{g.nome}</option>
        ))}
      </select>

      <input
        style={styles.input}
        placeholder={t.measure}
        value={form.medida}
        onChange={(e) => setForm({ ...form, medida: e.target.value })}
      />


      <div style={styles.limitBox}>
        <strong>Limite ideal por estoque/local</strong>

        {form.limites.map((limite, index) => (
          <div key={index} style={styles.limitRow}>
            <select
              style={styles.inputInline}
              value={limite.estoque}
              onChange={(e) =>
                atualizarLinhaLimite(index, "estoque", e.target.value)
              }
            >
              <option value="">Escolher estoque</option>
              {data.estoques.map((estoque) => (
                <option key={estoque.id} value={estoque.nome}>{translateStock(estoque.nome, language)}</option>
              ))}
            </select>

            <input
              style={styles.smallInput}
              placeholder="Máx."
              value={limite.estoqueIdeal}
              onChange={(e) =>
                atualizarLinhaLimite(index, "estoqueIdeal", e.target.value)
              }
            />

            <button
              style={styles.deleteButton}
              onClick={() => removerLinhaLimite(index)}
            >
              Remover
            </button>
          </div>
        ))}

        <button style={styles.editButton} onClick={adicionarLinhaLimite}>
          + Adicionar limite
        </button>
      </div>

      <button style={styles.button} onClick={adicionar}>
        {t.add}
      </button>

      <Table
        headers={[
          t.product,
          t.code,
          t.group,
          t.measure,
          "Limites por estoque",
          t.actions,
        ]}
      >
        {data.produtos.map((p) => (
          <tr key={p.id}>
            <td style={styles.cell}>
              {editId === p.id ? (
                <input
                  style={styles.inputInline}
                  value={editForm.nome}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nome: e.target.value })
                  }
                />
              ) : (
                p.nome
              )}
            </td>

            <td style={styles.cell}>
              {editId === p.id ? (
                <input
                  style={styles.inputInline}
                  value={editForm.codigo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, codigo: e.target.value })
                  }
                />
              ) : (
                p.codigo
              )}
            </td>

            <td style={styles.cell}>
              {editId === p.id ? (
                <select
                  style={styles.inputInline}
                  value={editForm.grupo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, grupo: e.target.value })
                  }
                >
                  <option value="">{t.group}</option>
                  {data.grupos.map((g) => (
                    <option key={g.id}>{g.nome}</option>
                  ))}
                </select>
              ) : (
                p.grupo
              )}
            </td>

            <td style={styles.cell}>
              {editId === p.id ? (
                <input
                  style={styles.inputInline}
                  value={editForm.medida}
                  onChange={(e) =>
                    setEditForm({ ...editForm, medida: e.target.value })
                  }
                />
              ) : (
                p.medida
              )}
            </td>

            <td style={styles.cell}>
              {editId === p.id ? (
                <>
                  {editForm.limites.map((limite, index) => (
                    <div key={index} style={styles.limitRow}>
                      <select
                        style={styles.inputInline}
                        value={limite.estoque}
                        onChange={(e) =>
                          atualizarLinhaLimiteEdit(
                            index,
                            "estoque",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Escolher estoque</option>
                        {data.estoques.map((estoque) => (
                          <option key={estoque.id}>{estoque.nome}</option>
                        ))}
                      </select>

                      <input
                        style={styles.smallInput}
                        value={limite.estoqueIdeal}
                        onChange={(e) =>
                          atualizarLinhaLimiteEdit(
                            index,
                            "estoqueIdeal",
                            e.target.value
                          )
                        }
                      />

                      <button
                        style={styles.deleteButton}
                        onClick={() => removerLinhaLimiteEdit(index)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}

                  <button
                    style={styles.editButton}
                    onClick={adicionarLinhaLimiteEdit}
                  >
                    + Adicionar limite
                  </button>
                </>
              ) : (
                limitesDoProduto(p.nome).map((limite) => (
                  <div key={limite.id} style={{ marginBottom: "6px" }}>
                    <strong>{translateStock(limite.estoque, language)}:</strong>{" "}
                    {limite.estoqueIdeal}
                  </div>
                ))
              )}
            </td>

            <td style={styles.cell}>
              <ActionButtons
                t={t}
                editing={editId === p.id}
                onEdit={() => iniciarEdicao(p)}
                onSave={() => salvar(p.id)}
                onCancel={() => setEditId(null)}
                onDelete={() => excluir(p.id)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </Page>
  );
}

function Suppliers({ data, actions, t }) {
  const empty = { nome: "", cnpj: "", telefone: "", email: "" };
  const [form, setForm] = React.useState(empty);
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState(empty);

  const adicionar = async () => {
    if (!form.nome) return;
    const res = await axios.post(`${API}/suppliers`, form);
    actions.setFornecedores([res.data, ...data.fornecedores]);
    setForm(empty);
  };

  const salvar = async (id) => {
    const res = await axios.put(`${API}/suppliers/${id}`, editForm);
    actions.setFornecedores(data.fornecedores.map((f) => f.id === id ? res.data : f));
    setEditId(null);
  };

  const excluir = async (id) => {
    if (!confirm(`${t.delete}?`)) return;
    await axios.delete(`${API}/suppliers/${id}`);
    actions.setFornecedores(data.fornecedores.filter((f) => f.id !== id));
  };

  return (
    <Page title={t.suppliers}>
      <input style={styles.input} placeholder={t.name} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
      <input style={styles.input} placeholder="CNPJ" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
      <input style={styles.input} placeholder={t.phone} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
      <input style={styles.input} placeholder={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <button style={styles.button} onClick={adicionar}>{t.add}</button>

      <Table headers={[t.name, "CNPJ", t.phone, t.email, t.actions]}>
        {data.fornecedores.map((f) => (
          <tr key={f.id}>
            {["nome", "cnpj", "telefone", "email"].map((campo) => (
              <td style={styles.cell} key={campo}>
                {editId === f.id ? (
                  <input style={styles.inputInline} value={editForm[campo]} onChange={(e) => setEditForm({ ...editForm, [campo]: e.target.value })} />
                ) : f[campo]}
              </td>
            ))}
            <td style={styles.cell}>
              <ActionButtons
                t={t}
                editing={editId === f.id}
                onEdit={() => { setEditId(f.id); setEditForm({ nome: f.nome, cnpj: f.cnpj, telefone: f.telefone, email: f.email }); }}
                onSave={() => salvar(f.id)}
                onCancel={() => setEditId(null)}
                onDelete={() => excluir(f.id)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </Page>
  );
}

function Entries({ data, actions, t, language }) {
  const empty = {
    produto: "",
    fornecedor: "",
    notaFiscal: "",
    quantidade: "",
    valorCompra: "",
    valorVenda: "",
    estoqueDestino: "",
    validade: "",
  };

  const [form, setForm] = React.useState(empty);
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState(empty);

  const formatarDataInput = (dataISO) => {
    if (!dataISO) return "";
    return String(dataISO).slice(0, 10);
  };

  const diasAteValidade = (validade) => {
    if (!validade) return null;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataValidade = new Date(validade);
    dataValidade.setHours(0, 0, 0, 0);

    return Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
  };

  const mesmaData = (a, b) => {
    if (!a || !b) return false;
    const dataA = new Date(a);
    const dataB = new Date(b);
    return dataA.toDateString() === dataB.toDateString();
  };

  const infoValidade = (entrada) => {
    if (!entrada.validade) {
      return {
        cor: "#9ca3af",
        texto: "Sem validade",
      };
    }

    const diffDias = diasAteValidade(entrada.validade);

    if (diffDias <= 0) {
      return {
        cor: "#ef4444",
        texto: diffDias === 0 ? "Vence hoje" : `Vencido há ${Math.abs(diffDias)} dia(s)`,
      };
    }

    if (diffDias <= 10) {
      return {
        cor: "#f59e0b",
        texto: `Vence em ${diffDias} dia(s)`,
      };
    }

    if (mesmaData(entrada.createdAt, new Date())) {
      return {
        cor: "#2563eb",
        texto: "Adicionado hoje",
      };
    }

    return {
      cor: "#22c55e",
      texto: "Normal",
    };
  };

  const adicionar = async () => {
    if (!form.produto || !form.quantidade) return;

    const res = await axios.post(`${API}/entries`, form);

    actions.setEntradas([res.data, ...data.entradas]);
    await atualizarRelatorio(actions);
    setForm(empty);
  };

  const salvar = async (id) => {
    const res = await axios.put(`${API}/entries/${id}`, editForm);

    actions.setEntradas(data.entradas.map((e) => (e.id === id ? res.data : e)));
    await atualizarRelatorio(actions);
    setEditId(null);
  };

  const excluir = async (id) => {
    if (!confirm(`${t.delete}?`)) return;

    await axios.delete(`${API}/entries/${id}`);
    actions.setEntradas(data.entradas.filter((e) => e.id !== id));
    await atualizarRelatorio(actions);
  };

  const SelectProduto = ({ value, onChange }) => (
    <select style={styles.inputInline} value={value} onChange={onChange}>
      <option value="">{t.product}</option>
      {data.produtos.map((p) => (
        <option key={p.id}>{p.nome}</option>
      ))}
    </select>
  );

  const SelectFornecedor = ({ value, onChange, inline = false }) => (
    <select style={inline ? styles.inputInline : styles.input} value={value} onChange={onChange}>
      <option value="">{t.supplier}</option>
      {data.fornecedores.map((f) => (
        <option key={f.id}>{f.nome}</option>
      ))}
    </select>
  );

  const SelectEstoque = ({ value, onChange, inline = false }) => (
    <select style={inline ? styles.inputInline : styles.input} value={value} onChange={onChange}>
      <option value="">{t.stock}</option>
      {data.estoques.map((e) => (
        <option key={e.id} value={e.nome}>
          {translateStock(e.nome, language)}
        </option>
      ))}
    </select>
  );

  return (
    <Page title={t.entries}>
      <select style={styles.input} value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })}>
        <option value="">{t.product}</option>
        {data.produtos.map((p) => (
          <option key={p.id}>{p.nome}</option>
        ))}
      </select>

      <SelectFornecedor value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} />

      <SelectEstoque value={form.estoqueDestino} onChange={(e) => setForm({ ...form, estoqueDestino: e.target.value })} />

      <input style={styles.input} placeholder={t.invoice} value={form.notaFiscal} onChange={(e) => setForm({ ...form, notaFiscal: e.target.value })} />

      <input style={styles.input} placeholder={t.quantity} value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} />

      <input style={styles.input} placeholder={t.purchaseValue} value={form.valorCompra} onChange={(e) => setForm({ ...form, valorCompra: e.target.value })} />

      <input style={styles.input} placeholder={t.saleValue} value={form.valorVenda} onChange={(e) => setForm({ ...form, valorVenda: e.target.value })} />

      <input style={styles.input} type="date" value={form.validade} onChange={(e) => setForm({ ...form, validade: e.target.value })} />

      <button style={styles.button} onClick={adicionar}>{t.register}</button>

      <Table headers={[t.product, t.supplier, t.invoice, t.quantity, t.purchaseValue, t.saleValue, t.stock, "Validade", "Status", t.actions]}>
        {data.entradas.map((e) => {
          const validade = infoValidade(e);

          return (
            <tr key={e.id}>
              <td style={styles.cell}>
                {editId === e.id ? (
                  <SelectProduto value={editForm.produto} onChange={(ev) => setEditForm({ ...editForm, produto: ev.target.value })} />
                ) : (
                  e.produto
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <SelectFornecedor inline value={editForm.fornecedor} onChange={(ev) => setEditForm({ ...editForm, fornecedor: ev.target.value })} />
                ) : (
                  e.fornecedor
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <input style={styles.inputInline} value={editForm.notaFiscal} onChange={(ev) => setEditForm({ ...editForm, notaFiscal: ev.target.value })} />
                ) : (
                  e.notaFiscal
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <input style={styles.inputInline} value={editForm.quantidade} onChange={(ev) => setEditForm({ ...editForm, quantidade: ev.target.value })} />
                ) : (
                  e.quantidade
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <input style={styles.inputInline} value={editForm.valorCompra} onChange={(ev) => setEditForm({ ...editForm, valorCompra: ev.target.value })} />
                ) : (
                  money(e.valorCompra)
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <input style={styles.inputInline} value={editForm.valorVenda} onChange={(ev) => setEditForm({ ...editForm, valorVenda: ev.target.value })} />
                ) : (
                  money(e.valorVenda)
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <SelectEstoque inline value={editForm.estoqueDestino} onChange={(ev) => setEditForm({ ...editForm, estoqueDestino: ev.target.value })} />
                ) : (
                  translateStock(e.estoqueDestino, language)
                )}
              </td>

              <td style={styles.cell}>
                {editId === e.id ? (
                  <input style={styles.inputInline} type="date" value={editForm.validade} onChange={(ev) => setEditForm({ ...editForm, validade: ev.target.value })} />
                ) : e.validade ? (
                  new Date(e.validade).toLocaleDateString("pt-BR")
                ) : (
                  "Sem validade"
                )}
              </td>

              <td style={styles.cell}>
                <span
                  style={{
                    background: validade.cor,
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "999px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {validade.texto}
                </span>
              </td>

              <td style={styles.cell}>
                <ActionButtons
                  t={t}
                  editing={editId === e.id}
                  onEdit={() => {
                    setEditId(e.id);
                    setEditForm({
                      produto: e.produto,
                      fornecedor: e.fornecedor,
                      notaFiscal: e.notaFiscal,
                      quantidade: e.quantidade,
                      valorCompra: e.valorCompra,
                      valorVenda: e.valorVenda,
                      estoqueDestino: e.estoqueDestino,
                      validade: formatarDataInput(e.validade),
                    });
                  }}
                  onSave={() => salvar(e.id)}
                  onCancel={() => setEditId(null)}
                  onDelete={() => excluir(e.id)}
                />
              </td>
            </tr>
          );
        })}
      </Table>
    </Page>
  );
}


function Repositions({ data, actions, t, language }) {
  const estoquePadrao =
    data.estoques.find((e) =>
      e.nome?.toLowerCase().includes("deposito") ||
      e.nome?.toLowerCase().includes("depósito")
    )?.nome || data.estoques[0]?.nome || "";

  const empty = {
    produto: "",
    quantidade: "",
    origem: estoquePadrao,
    destino: "",
  };

  const [form, setForm] = React.useState(empty);
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState(empty);

  React.useEffect(() => {
    if (!form.origem && estoquePadrao) {
      setForm((atual) => ({ ...atual, origem: estoquePadrao }));
    }
  }, [estoquePadrao]);

  const limparForm = () => {
    setForm({
      produto: "",
      quantidade: "",
      origem: estoquePadrao,
      destino: "",
    });
  };

  const adicionar = async () => {
    const origemFinal = form.origem || estoquePadrao;

    if (!form.produto || !form.quantidade || !origemFinal || !form.destino) {
      alert("Escolha produto, origem, destino e quantidade.");
      return;
    }

    const res = await axios.post(`${API}/repositions`, {
      ...form,
      origem: origemFinal,
    });

    actions.setReposicoes([res.data, ...data.reposicoes]);
    await atualizarRelatorio(actions);
    limparForm();
  };

  const salvar = async (id) => {
    const origemFinal = editForm.origem || estoquePadrao;

    const res = await axios.put(`${API}/repositions/${id}`, {
      ...editForm,
      origem: origemFinal,
    });

    actions.setReposicoes(data.reposicoes.map((r) => r.id === id ? res.data : r));
    await atualizarRelatorio(actions);
    setEditId(null);
  };

  const excluir = async (id) => {
    if (!confirm(`${t.delete}?`)) return;
    await axios.delete(`${API}/repositions/${id}`);
    actions.setReposicoes(data.reposicoes.filter((r) => r.id !== id));
    await atualizarRelatorio(actions);
  };

  return (
    <Page title={t.repositions}>
      <select style={styles.input} value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })}>
        <option value="">{t.product}</option>
        {data.produtos.map((p) => <option key={p.id}>{p.nome}</option>)}
      </select>

      <select style={styles.input} value={form.origem || estoquePadrao} onChange={(e) => setForm({ ...form, origem: e.target.value })}>
        <option value="">{t.origin}</option>
        {data.estoques.map((e) => <option key={e.id} value={e.nome}>{translateStock(e.nome, language)}</option>)}
      </select>

      <select style={styles.input} value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })}>
        <option value="">{t.destination}</option>
        {data.estoques.map((e) => <option key={e.id} value={e.nome}>{translateStock(e.nome, language)}</option>)}
      </select>

      <input style={styles.input} placeholder={t.quantity} value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} />
      <button style={styles.button} onClick={adicionar}>{t.register}</button>

      <Table headers={[t.product, t.origin, t.destination, t.quantity, t.actions]}>
        {data.reposicoes.map((r) => (
          <tr key={r.id}>
            <td style={styles.cell}>{editId === r.id ? <input style={styles.inputInline} value={editForm.produto} onChange={(e) => setEditForm({ ...editForm, produto: e.target.value })} /> : r.produto}</td>
            <td style={styles.cell}>{editId === r.id ? <select style={styles.inputInline} value={editForm.origem || estoquePadrao} onChange={(e) => setEditForm({ ...editForm, origem: e.target.value })}><option value="">{t.origin}</option>{data.estoques.map((e) => <option key={e.id} value={e.nome}>{translateStock(e.nome, language)}</option>)}</select> : translateStock(r.origem || estoquePadrao, language)}</td>
            <td style={styles.cell}>{editId === r.id ? <select style={styles.inputInline} value={editForm.destino} onChange={(e) => setEditForm({ ...editForm, destino: e.target.value })}><option value="">{t.destination}</option>{data.estoques.map((e) => <option key={e.id} value={e.nome}>{translateStock(e.nome, language)}</option>)}</select> : translateStock(r.destino, language)}</td>
            <td style={styles.cell}>{editId === r.id ? <input style={styles.inputInline} value={editForm.quantidade} onChange={(e) => setEditForm({ ...editForm, quantidade: e.target.value })} /> : r.quantidade}</td>
            <td style={styles.cell}>
              <ActionButtons
                t={t}
                editing={editId === r.id}
                onEdit={() => { setEditId(r.id); setEditForm({ produto: r.produto, origem: r.origem || estoquePadrao, destino: r.destino, quantidade: r.quantidade }); }}
                onSave={() => salvar(r.id)}
                onCancel={() => setEditId(null)}
                onDelete={() => excluir(r.id)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </Page>
  );
}

function Sales({ data, actions, t, language }) {
  const [busca, setBusca] = React.useState("");
  const [carrinho, setCarrinho] = React.useState([]);
  const [estoqueVenda, setEstoqueVenda] = React.useState("");

  const produtosFiltrados = data.produtos.filter((p) => {
    const texto = busca.toLowerCase();
    return p.nome?.toLowerCase().includes(texto) || p.codigo?.toLowerCase().includes(texto);
  });

  const buscarValorProduto = (nomeProduto) => {
    const entrada = [...data.entradas].reverse().find((e) => e.produto === nomeProduto);
    return entrada?.valorVenda || "";
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([
      ...carrinho,
      {
        id: Date.now(),
        produto: produto.nome,
        codigo: produto.codigo,
        quantidade: 1,
        valor: buscarValorProduto(produto.nome),
      },
    ]);
    setBusca("");
  };

  const editarItem = (id, campo, valor) => {
    setCarrinho(carrinho.map((item) => (item.id === id ? { ...item, [campo]: valor } : item)));
  };

  const removerItemCarrinho = (id) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const total = carrinho.reduce(
    (acc, item) => acc + Number(item.valor || 0) * Number(item.quantidade || 0),
    0
  );

  const finalizarVenda = async () => {
    if (carrinho.length === 0) return;

    if (!estoqueVenda) {
      alert("Escolha o estoque da venda.");
      return;
    }

    const codigoVenda = `VD-${Date.now()}`;

    for (const item of carrinho) {
      const res = await axios.post(`${API}/sales`, {
        ...item,
        codigoVenda,
        estoqueOrigem: estoqueVenda,
      });

      actions.setVendas((v) => [res.data, ...v]);
    }

    await atualizarRelatorio(actions);
    alert(`Venda finalizada: ${codigoVenda}`);
    setCarrinho([]);
    setEstoqueVenda("");
  };

  return (
    <Page title={t.sales}>
      <input
        style={styles.input}
        placeholder={t.searchProduct}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {busca && (
        <div style={styles.searchBox}>
          {produtosFiltrados.map((p) => (
            <div key={p.id} style={styles.searchItem} onClick={() => adicionarAoCarrinho(p)}>
              {p.nome} - {p.codigo}
            </div>
          ))}
        </div>
      )}

      <select style={styles.input} value={estoqueVenda} onChange={(e) => setEstoqueVenda(e.target.value)}>
        <option value="">Escolha o estoque da venda</option>
        {data.estoques.map((estoque) => (
          <option key={estoque.id} value={estoque.nome}>
            {translateStock(estoque.nome, language)}
          </option>
        ))}
      </select>

      <Table headers={[t.product, t.quantity, t.value, t.subtotal, t.actions]}>
        {carrinho.map((item) => (
          <tr key={item.id}>
            <td style={styles.cell}>{item.produto}</td>
            <td style={styles.cell}>
              <input
                style={styles.smallInput}
                value={item.quantidade}
                onChange={(e) => editarItem(item.id, "quantidade", e.target.value)}
              />
            </td>
            <td style={styles.cell}>
              <input
                style={styles.smallInput}
                value={item.valor}
                onChange={(e) => editarItem(item.id, "valor", e.target.value)}
              />
            </td>
            <td style={styles.cell}>{money(Number(item.valor || 0) * Number(item.quantidade || 0))}</td>
            <td style={styles.cell}>
              <button style={styles.deleteButton} onClick={() => removerItemCarrinho(item.id)}>
                {t.delete}
              </button>
            </td>
          </tr>
        ))}
      </Table>

      <h2>{t.total}: {money(total)}</h2>
      <button style={styles.button} onClick={finalizarVenda}>
        {t.finishSale}
      </button>
    </Page>
  );
}


function SalesHistory({ data, actions, t, language }) {
  const [vendaSelecionada, setVendaSelecionada] = React.useState(null);

  const vendasAgrupadas = Object.values(
    data.vendas.reduce((acc, venda) => {
      const codigoVenda = venda.codigoVenda || `VD-${venda.id}`;

      if (!acc[codigoVenda]) {
        acc[codigoVenda] = {
          codigoVenda,
          estoqueOrigem: venda.estoqueOrigem,
          createdAt: venda.createdAt,
          itens: [],
          total: 0,
        };
      }

      acc[codigoVenda].itens.push(venda);
      acc[codigoVenda].total += Number(venda.valor || 0) * Number(venda.quantidade || 0);

      return acc;
    }, {})
  );

  const excluirVendaInteira = async (venda) => {
    if (!confirm(`${t.delete}?`)) return;

    for (const item of venda.itens) {
      await axios.delete(`${API}/sales/${item.id}`);
    }

    actions.setVendas(data.vendas.filter((v) => !venda.itens.some((item) => item.id === v.id)));
    setVendaSelecionada(null);
    await atualizarRelatorio(actions);
  };

  if (vendaSelecionada) {
    return (
      <Page title="Detalhes da Venda">
        <button style={styles.cancelButton} onClick={() => setVendaSelecionada(null)}>
          Voltar
        </button>

        <button style={{ ...styles.editButton, marginLeft: "10px" }} onClick={() => window.print()}>
          Imprimir comprovante
        </button>

        <button style={{ ...styles.deleteButton, marginLeft: "10px" }} onClick={() => excluirVendaInteira(vendaSelecionada)}>
          {t.delete}
        </button>

        <div style={{ ...styles.card, marginTop: "20px" }}>
          <h2>Venda: {vendaSelecionada.codigoVenda}</h2>
          <p><strong>Estoque:</strong> {translateStock(vendaSelecionada.estoqueOrigem, language)}</p>
          <p><strong>Data:</strong> {new Date(vendaSelecionada.createdAt).toLocaleString("pt-BR")}</p>
          <p><strong>Total:</strong> {money(vendaSelecionada.total)}</p>
        </div>

        <Table headers={[t.product, t.code, t.quantity, t.value, t.subtotal]}>
          {vendaSelecionada.itens.map((item) => (
            <tr key={item.id}>
              <td style={styles.cell}>{item.produto}</td>
              <td style={styles.cell}>{item.codigo}</td>
              <td style={styles.cell}>{item.quantidade}</td>
              <td style={styles.cell}>{money(item.valor)}</td>
              <td style={styles.cell}>{money(Number(item.valor || 0) * Number(item.quantidade || 0))}</td>
            </tr>
          ))}
        </Table>

        <h2>{t.total}: {money(vendaSelecionada.total)}</h2>
      </Page>
    );
  }

  return (
    <Page title={t.salesHistory}>
      <Table headers={["Código da Venda", "Data", t.stock, "Itens", t.total, t.actions]}>
        {vendasAgrupadas.map((venda) => (
          <tr key={venda.codigoVenda}>
            <td
              style={{ ...styles.cell, cursor: "pointer", fontWeight: "bold", color: "#2563eb" }}
              onClick={() => setVendaSelecionada(venda)}
            >
              {venda.codigoVenda}
            </td>

            <td style={styles.cell}>{new Date(venda.createdAt).toLocaleString("pt-BR")}</td>
            <td style={styles.cell}>{translateStock(venda.estoqueOrigem, language)}</td>
            <td style={styles.cell}>{venda.itens.length}</td>
            <td style={styles.cell}>{money(venda.total)}</td>

            <td style={styles.cell}>
              <button style={styles.editButton} onClick={() => setVendaSelecionada(venda)}>
                Detalhes
              </button>

              <button style={styles.deleteButton} onClick={() => excluirVendaInteira(venda)}>
                {t.delete}
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </Page>
  );
}



function StockBar({ color, percent }) {
  return (
    <div style={styles.stockBarOuter}>
      <div
        style={{
          ...styles.stockBarInner,
          width: `${Math.min(Number(percent || 0), 100)}%`,
          background: color || "#9ca3af",
        }}
      />
    </div>
  );
}

function Reports({ data, t, language }) {
  const produtos = data.relatorio?.produtos || [];

  return (
    <Page title={t.reports}>
      <div style={styles.reportCards}>
        <div style={styles.card}>
          {t.entries}: {data.relatorio?.totalEntradas || 0}
        </div>

        <div style={styles.card}>
          {t.repositions}: {data.relatorio?.totalReposicoes || 0}
        </div>

        <div style={styles.card}>
          {t.salesHistory}: {data.relatorio?.totalVendas || 0}
        </div>

        <div style={styles.card}>
          {t.revenue}: {money(data.relatorio?.faturamento || 0)}
        </div>

        <div style={styles.card}>
          {t.cost}: {money(data.relatorio?.custoEntradas || 0)}
        </div>

        <div style={styles.card}>
          {t.profit}: {money(data.relatorio?.lucro || 0)}
        </div>
      </div>

      <div style={styles.reportWrapper}>
        <Table
          headers={[
            t.product,
            "Status geral",
            "Balanço por estoque",
            t.soldQty,
            t.purchaseValue,
            t.saleValue,
            t.soldTotal,
          ]}
        >
          {produtos.map((p) => (
            <tr
              key={p.produto}
              style={{
                borderLeft: `8px solid ${p.corEstoque}`,
              }}
            >
              <td style={styles.cell}>
                <div style={{ fontWeight: "bold" }}>
                  {p.produto}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  {p.grupo}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  {t.code}: {p.codigo}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  Ideal total: {p.totalIdeal || p.estoqueIdeal || 0}
                </div>
              </td>

              <td style={styles.cell}>
                <StockBar
                  color={p.corEstoque}
                  percent={p.porcentagemEstoque}
                />

                <strong>
                  {Math.round(p.porcentagemEstoque || 0)}%
                </strong>

                <div
                  style={{
                    color: p.corEstoque,
                    fontWeight: "bold",
                  }}
                >
                  {p.statusEstoque}
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Total Atual: {p.estoqueTotal}
                </div>
              </td>

              <td style={styles.cell}>
                {(p.estoqueDetalhado || []).map((local, index) => (
                  <div
                    key={local.local || local.estoque || index}
                    style={styles.localStockCard}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >

                      <div
                        style={{
                          color: local.cor,
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        {translateStock(local.local || local.estoque || "Depósito", language)}
                      </div>

                      <div
                        style={{
                          color: local.cor,
                          fontWeight: "bold",
                        }}
                      >
                        {Math.round(local.porcentagem || 0)}%
                      </div>

                    </div>

                    <StockBar
                      color={local.cor}
                      percent={local.porcentagem}
                    />

                    <div
                      style={{
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      Atual:{" "}
                      <strong>{local.quantidade}</strong>
                      {" / "}
                      Ideal:{" "}
                      <strong>{local.estoqueIdeal}</strong>
                    </div>

                    <div
                      style={{
                        color: local.cor,
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {local.status}
                    </div>

                  </div>
                ))}
              </td>

              <td style={styles.cell}>
                <div style={{ fontWeight: "bold" }}>
                  {p.vendido}
                </div>
              </td>

              <td style={styles.cell}>
                {money(p.valorCompra)}
              </td>

              <td style={styles.cell}>
                {money(p.valorVenda)}
              </td>

              <td style={styles.cell}>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#16a34a",
                  }}
                >
                  {money(p.faturamentoVendido)}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </Page>
  );
}
function Settings({ data, actions, currentUser, onLogout }) {
  const isAdmin = currentUser?.role === "ADMIN";
  const emptyUser = { nome: "", email: "", senha: "", role: "OPERADOR" };
  const [form, setForm] = React.useState(emptyUser);
  const [senhaAtual, setSenhaAtual] = React.useState("");
  const [novaSenha, setNovaSenha] = React.useState("");

  const carregarUsuarios = async () => {
    if (!isAdmin) return;
    const res = await axios.get(`${API}/users`);
    actions.setUsuarios(res.data);
  };

  const criarUsuario = async () => {
    if (!form.nome || !form.email || !form.senha) {
      alert("Preencha nome, email e senha.");
      return;
    }

    const res = await axios.post(`${API}/users`, form);
    actions.setUsuarios([res.data, ...data.usuarios]);
    setForm(emptyUser);
  };

  const excluirUsuario = async (id) => {
    if (!confirm("Excluir usuário?")) return;
    await axios.delete(`${API}/users/${id}`);
    actions.setUsuarios(data.usuarios.filter((u) => u.id !== id));
  };

  const alterarSenha = async () => {
    if (!novaSenha) {
      alert("Digite a nova senha.");
      return;
    }

    await axios.put(`${API}/users/${currentUser.id}/password`, {
      senhaAtual,
      novaSenha,
    });

    alert("Senha alterada. Entre novamente.");
    onLogout();
  };

  React.useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <Page title="Configurações">
      <div style={styles.card}>
        <h2>Alterar minha senha</h2>
        <input
          style={styles.input}
          type="password"
          placeholder="Senha atual"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <button style={styles.button} onClick={alterarSenha}>Alterar senha</button>
      </div>

      {isAdmin && (
        <>
          <div style={{ ...styles.card, marginTop: "20px" }}>
            <h2>Adicionar usuário</h2>
            <input
              style={styles.input}
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
            />
            <select
              style={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="OPERADOR">OPERADOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button style={styles.button} onClick={criarUsuario}>Adicionar usuário</button>
          </div>

          <Table headers={["Nome", "Email", "Acesso", "Ativo", "Ações"]}>
            {data.usuarios.map((u) => (
              <tr key={u.id}>
                <td style={styles.cell}>{u.nome}</td>
                <td style={styles.cell}>{u.email}</td>
                <td style={styles.cell}>{u.role}</td>
                <td style={styles.cell}>{u.ativo ? "Sim" : "Não"}</td>
                <td style={styles.cell}>
                  {u.id !== currentUser.id && (
                    <button style={styles.deleteButton} onClick={() => excluirUsuario(u.id)}>
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        </>
      )}
    </Page>
  );
}

function Layout({ data, actions, t, language, setLanguage, currentUser, onLogout }) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const isAdmin = currentUser?.role === "ADMIN";
  const unread = data.notificacoes.filter((n) => !n.lida).length;

  const marcarLida = async (id) => {
    await axios.put(`${API}/notifications/${id}/read`);
    actions.setNotificacoes(
      data.notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const atualizarNotificacoes = async () => {
    await axios.post(`${API}/notifications/check`);
    const res = await axios.get(`${API}/notifications`);
    actions.setNotificacoes(res.data);
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <h2>{t.appName}</h2>
        </div>

        <select style={styles.languageSelect} value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="pt">PT-BR</option>
          <option value="en">EN-CA</option>
          <option value="fr">FR-CA</option>
        </select>

        <div style={{ color: "#fff", fontSize: "13px", opacity: 0.85 }}>
          {currentUser?.nome} — {currentUser?.role}
        </div>

        <Link style={styles.link} to="/sales">{t.sales}</Link>
        <Link style={styles.link} to="/sales-history">{t.salesHistory}</Link>

        {isAdmin && (
          <>
            <Link style={styles.link} to="/stock">{t.stock}</Link>
            <Link style={styles.link} to="/product-groups">{t.groups}</Link>
            <Link style={styles.link} to="/products">{t.products}</Link>
            <Link style={styles.link} to="/suppliers">{t.suppliers}</Link>
            <Link style={styles.link} to="/entries">{t.entries}</Link>
            <Link style={styles.link} to="/repositions">{t.repositions}</Link>
            <Link style={styles.link} to="/reports">{t.reports}</Link>
            <Link style={styles.link} to="/dashboard">{t.dashboard}</Link>
          </>
        )}

        <Link style={styles.link} to="/settings">Configurações</Link>

        <button style={styles.cancelButton} onClick={onLogout}>Sair</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <button style={styles.notificationButton} onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            {unread > 0 && <span style={styles.notificationBadge}>{unread}</span>}
          </button>
          <button style={styles.editButton} onClick={atualizarNotificacoes}>Atualizar alertas</button>
        </div>

        {showNotifications && (
          <div style={styles.notificationPanel}>
            <h3>Notificações</h3>
            {data.notificacoes.length === 0 && <p>Nenhum alerta no momento.</p>}
            {data.notificacoes.map((n) => (
              <div key={n.id} style={{ ...styles.notificationCard, opacity: n.lida ? 0.55 : 1 }}>
                <strong>{n.titulo}</strong>
                <p>{n.mensagem}</p>
                <small>{new Date(n.createdAt).toLocaleString("pt-BR")}</small>
                {!n.lida && (
                  <button style={styles.editButton} onClick={() => marcarLida(n.id)}>
                    Marcar como lida
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Routes>
          <Route path="/sales" element={<Sales data={data} actions={actions} t={t} language={language} />} />
          <Route path="/sales-history" element={<SalesHistory data={data} actions={actions} t={t} language={language} />} />
          {isAdmin && <Route path="/stock" element={<Stock data={data} actions={actions} t={t} language={language} />} />}
          {isAdmin && <Route path="/product-groups" element={<ProductGroups data={data} actions={actions} t={t} />} />}
          {isAdmin && <Route path="/products" element={<Products data={data} actions={actions} t={t} language={language} />} />}
          {isAdmin && <Route path="/suppliers" element={<Suppliers data={data} actions={actions} t={t} />} />}
          {isAdmin && <Route path="/entries" element={<Entries data={data} actions={actions} t={t} language={language} />} />}
          {isAdmin && <Route path="/repositions" element={<Repositions data={data} actions={actions} t={t} language={language} />} />}
          {isAdmin && <Route path="/reports" element={<Reports data={data} t={t} language={language} />} />}
          {isAdmin && <Route path="/dashboard" element={<Dashboard data={data} t={t} />} />}
          <Route path="/settings" element={<Settings data={data} actions={actions} currentUser={currentUser} onLogout={onLogout} />} />
          <Route path="*" element={<Sales data={data} actions={actions} t={t} language={language} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = React.useState(() => {
    const saved = localStorage.getItem("marcheUser");
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem("marcheUser");
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!currentUser ? (
          <Route path="*" element={<Login onLogin={setCurrentUser} />} />
        ) : (
          <Route
            path="/*"
            element={<AppData currentUser={currentUser} onLogout={logout} />}
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  app: { display: "flex", width: "100vw", minHeight: "100vh", background: "#f4f6fb", fontFamily: "Arial" },
  sidebar: { width: "260px", minWidth: "260px", background: "#08142d", color: "#fff", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" },
  main: { flex: 1, width: "100%", padding: "15px 20px", overflowX: "auto" },
  logoArea: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px", textAlign: "center" },
  logo: { width: "180px", height: "auto", objectFit: "contain", marginBottom: "15px" },
  languageSelect: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "15px", background: "#fff", color: "#000", fontWeight: "bold", cursor: "pointer" },
  title: { marginBottom: "20px", fontSize: "34px", color: "#222" },
  link: { color: "#fff", textDecoration: "none", fontSize: "18px" },
  loginPage: { minHeight: "100vh", background: "#111", display: "flex", justifyContent: "center", alignItems: "center" },
  loginBox: { background: "#1e1e1e", padding: "30px", borderRadius: "12px", width: "340px", color: "#fff" },
  input: { width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" },
  inputInline: { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" },
  button: { padding: "12px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", minWidth: "1400px", borderCollapse: "collapse", marginTop: "20px", background: "#fff", borderRadius: "12px", overflow: "hidden" },
  tableHeader: { background: "#dfe3ea" },
  cell: { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd", fontSize: "14px" },
  reportCards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "20px" },
  card: { background: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 4px #ddd", fontWeight: "bold" },
  reportWrapper: { width: "100%", overflowX: "auto", background: "#fff", borderRadius: "12px", padding: "10px" },
  searchBox: { background: "#fff", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px", maxHeight: "250px", overflowY: "auto" },
  searchItem: { padding: "12px", cursor: "pointer", borderBottom: "1px solid #eee" },
  smallInput: { width: "90px", padding: "8px" },
  editButton: { padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", marginRight: "8px", cursor: "pointer" },
  deleteButton: { padding: "8px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  saveButton: { padding: "8px 12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", marginRight: "8px", cursor: "pointer" },
  cancelButton: { padding: "8px 12px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  fixedBadge: { background: "#dbeafe", color: "#1d4ed8", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: "bold" },
chartCard: {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  marginTop: "25px",
  boxShadow: "0 1px 4px #ddd",
  maxWidth: "420px",
},

pieChart: {
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  margin: "20px auto",
},

chartLegend: {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  fontWeight: "bold",
},

  limitBox: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "12px",
  },

  limitRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },

  stockBarOuter: {
    width: "100%",
    background: "#e5e7eb",
    height: "12px",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "8px",
  },

  stockBarInner: {
    height: "100%",
    borderRadius: "999px",
  },

  localStockCard: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  notificationButton: {
    position: "relative",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "20px",
  },
  notificationBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "999px",
    padding: "2px 7px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  notificationPanel: {
    background: "#eef8fb",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px #ddd",
  },
  notificationCard: {
    background: "#fff",
    borderLeft: "5px solid #f59e0b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};

export default App;