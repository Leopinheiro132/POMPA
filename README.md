# 🏍️ Aplicativo Controle de Gastos Moto (Bajaj Dominar NS 200)

Documento completo com o mapeamento de **telas**, **funcionalidades**, **regras de negócio** e **fluxo de uso do aplicativo**. Preparado para referência de desenvolvimento e integração com o Stitch.

---

## 📱 Visão Geral das Telas (7 Telas)

O aplicativo conta com **7 telas principais** organizadas entre a navegação por abas inferiores (`Bottom Tabs`) e rotas diretas:

```
├── (tabs)
│   ├── 1. Dashboard Principal (/app/(tabs)/index.js)
│   ├── 2. Planilha de Lançamentos (/app/(tabs)/lancamentos.js)
│   ├── 3. Óleo & Desgaste (/app/(tabs)/oleo-desgaste.js)
│   ├── 4. Imprevistos & Pinças (/app/(tabs)/imprevistos.js)
│   └── 5. Pesquisa de Preços (/app/(tabs)/precos.js)
├── Rotas Diretas
│   ├── 6. Atualização de Odômetro (/app/odometro.js)
│   └── 7. Configurações & Backup (/app/configuracoes.js)
```

---

## 🔍 Detalhamento de Cada Tela

### 1. Dashboard Principal (`/app/(tabs)/index.js`)
**Objetivo:** Central de comando executiva com resumo financeiro em tempo real e calculadoras de rodagem.
* **Componentes e Funcionalidades:**
  * **Ações Rápidas (Header):** Atritos para abrir Atualização de Odômetro e Configurações.
  * **KPICards (Cards de Indicadores de Desempenho):**
    * `Custo Total por KM (TCO)`: Soma de Gasolina + Óleo + Filtro + Pneus + Freios + Relação + Revisões + Reserva.
    * `Custo Mensal Estimado`: Gasto mensal projetado para o ritmo de rodagem atual.
    * `Combustível/Mês`: Litros e gasto mensal de gasolina.
    * `Tanque Cheio (12 L)`: Custo para encher o tanque (12L x R$/L) e autonomia em km (~360 km).
    * `Custo Anual Total`: Estimativa orçamentária para 12 meses de uso da moto.
  * **RouteCalculator (Calculadora de Rotas Diárias):**
    * Ajuste individual da quilometragem percorrida em cada dia da semana (Segunda a Domingo) + KM extra semanal.
    * Média semanal, quinzenal e mensal com custo de combustível resultante.
  * **TripCalculatorCard (Calculadora de Viagem & Rodovia):**
    * Simulação de viagens (digite a distância em km e pedágios).
    * Retorna os litros de gasolina necessários, custo de combustível, paradas de posto recomendadas (a cada 280 km) e custo total do rolê.
  * **RidingStyleSimulatorCard (Simulador de Pilotagem):**
    * Comparativo entre **Pilotagem Econômica (32 km/L)** vs **Esportiva (24 km/L)**.
    * Exibe a economia anual acumulada em Reais (ex: R$ 1.068,00/ano).
  * **FinancialCharts (Gráficos Orçamentários):**
    * Barras proporcionais de composição do custo por KM por categoria.
    * Gráfico mensal empilhado de projeção orçamentária para 12 meses (Gasolina vs Manutenção vs Reserva).
  * **RevisionScheduleCard:** Alerta da próxima revisão recomendada.
  * **WearHealthGrid:** Grade com indicadores de desgaste das peças principais.

---

### 2. Planilha de Lançamentos (`/app/(tabs)/lancamentos.js`)
**Objetivo:** Registro, histórico detalhado e exclusão de lançamentos financeiros da moto.
* **Componentes e Funcionalidades:**
  * **Botão Rápido "⛽ Abastecer":** Abre o modal direto configurado para registros de combustível.
  * **Formulário Inteligente de Abastecimento:**
    * `Gasolina na Bomba (Litros)`: Quantidade de litros que a bomba do posto registrou.
    * `Trip / KM Parcial (km)`: Quilometragem que marcou no trip do painel desde o último abastecimento.
    * `Valor Pago (R$)`: Custo total da nota do posto.
    * `Odômetro Atual (km)`: Odômetro total no painel.
    * **Calculadora em Tempo Real:** Exibe instantaneamente enquanto você digita:
      * Média de consumo calculada (`km/L`).
      * Preço por litro pago (`R$/L`).
      * Custo por km rodado naquele tanque (`R$/km`).
  * **Lançamentos de Manutenção / Óleo:**
    * Opção de lançar trocas de óleo especificando litros comprados vs litros usados (com atualização da sobra na garagem).
  * **Lista de Lançamentos (Histórico):**
    * Badges informativas por tipo (Gasolina, Óleo, Pneus, Pastilhas, Relação, Revisões, Eventuais).
    * Botão de exclusão com confirmação.

---

### 3. Óleo & Desgaste (`/app/(tabs)/oleo-desgaste.js`)
**Objetivo:** Gestão de suprimentos de garagem e acompanhamento do desgaste e revisões concessionária.
* **Componentes e Funcionalidades:**
  * **OilInventoryCard (Gestão de Óleo na Garagem):**
    * Exibe a quantidade de sobra de óleo guardada na garagem (ex: `0.8 L`).
    * **Modal de Ajuste de Estoque:** Permite editar os litros de sobra em estoque com botões de ajuste rápido (`+0.2L`, `+0.4L`, `+0.8L`, `Zerar`) ou digitação direta.
    * Cálculo de economia: avisa se na próxima troca será necessário comprar apenas 1 frasco de 1L ou nenhum frasco.
  * **WearHealthGrid (Saúde das Peças):**
    * Monitoramento de **Óleo Motor**, **Filtro de Óleo**, **Pneu Traseiro**, **Pneu Dianteiro**, **Pastilhas de Freio** e **Kit Relação**.
    * Barras de progresso com porcentagem de desgaste e km restantes.
    * **Modal de Troca Retroativa com KM Personalizado:** Permite registrar trocas informando a quilometragem exata (km) em que o serviço foi feito no passado (sem forçar o odômetro atual).
  * **OfficialRevisionsCard (Plano Oficial Bajaj Dominar NS 200):**
    * Tabela interativa com as 7 revisões de concessionária (1k, 5k, 10k, 15k, 20k, 25k, 30k km) mostrando custos de peças, mão de obra (grátis na 1ª) e valor total.
    * Destaque automático para a **Próxima Revisão Concessionária** calculando os km restantes.
    * Aba com a tabela de quilometragem e especificações de peças do Manual do Proprietário.

---

### 4. Pinças de Freio & Fundo de Imprevistos (`/app/(tabs)/imprevistos.js`)
**Objetivo:** Planejamento orçamentário para manutenções eventuais, freios e custos anuais fixos.
* **Componentes e Funcionalidades:**
  * **EventualExpensesPlanner:**
    * **Revisão de Pinças de Freio & DOT4:** Calculadora para reparo de pinça dianteira (pistões/vedações), pinça traseira e sangria/troca do fluido DOT 4.
    * **Imprevistos Ocorrenciais & Anuais:** Custo para 3x Velas DTS-i (15k km), Cabo de Embreagem (12k km) e IPVA/Licenciamento Anual.
    * **Ajuste da Reserva por KM:** Campo para definir o valor guardado por km (ex: `R$ 0,05/km`).
    * **Projeção de Acumulação:** Gráfico das barras de acumulação da reserva de emergência mês a mês (1 a 12 meses).

---

### 5. Pesquisa de Preços de Mercado (`/app/(tabs)/precos.js`)
**Objetivo:** Cotação e acompanhamento de preços de peças e insumos no Mercado Livre.
* **Componentes e Funcionalidades:**
  * Catálogo pré-carregado no banco SQLite para as peças da Bajaj Dominar NS 200 (Óleo Motul 20W50, Pneus Pirelli Sport Demon 140/70-17 e 110/70-17, Pastilhas, Kit Relação, Filtro de Óleo).
  * Cache local de preços com validade de 7 dias.
  * **Botão "Atualizar Preços":** Atualiza os valores do cache.
  * **Links Diretos para o Mercado Livre:** Botões interativos que abrem os anúncios ou páginas de busca no Mercado Livre.
  * Badges de menor preço, frete grátis e produto novo/usado.

---

### 6. Atualização de Odômetro (`/app/odometro.js`)
**Objetivo:** Atualização rápida do hodômetro da motocicleta e configuração do modo de rastreamento.
* **Componentes e Funcionalidades:**
  * Campo de entrada numérico para atualizar o odômetro total.
  * Seletor de Modo de Rastreamento (`Desativado`, `Acelerômetro`, `GPS`).
  * Histórico de leituras estimadas vs manuais.

---

### 7. Configurações & Backup (`/app/configuracoes.js`)
**Objetivo:** Parametrização geral do veículo, notificações locais e backup/restauração.
* **Componentes e Funcionalidades:**
  * **Dados da Moto:** Nome do veículo, preço do litro da gasolina (R$/L) e média base de consumo (km/L).
  * **Preços de Peças:** Ajuste de valores base de óleo, filtros, pneus, pastilhas, relação e revisões.
  * **Intervalos de Troca:** Ajuste de validade em km de cada componente.
  * **Preferências:** Switch para ativar/desativar Notificações e busca automática no Wi-Fi.
  * **Backup de Dados (JSON):**
    * `Exportar Backup (JSON)`: Gera arquivo `.json` com todas as configurações, histórico de lançamentos e odômetro.
    * `Importar Backup`: Permite escolher arquivo `.json` para restaurar o banco de dados.
    * `Restaurar Padrões`: Restaura os dados originais de fábrica da Bajaj Dominar NS 200.

---

## 🛠️ Tecnologias e Arquitetura

* **Framework:** React Native + Expo (SDK 54) + Expo Router v6
* **Banco de Dados:** Expo SQLite (com tabelas `config`, `expense_logs`, `odometer_readings`, `prices_cache`, `price_watch_items`)
* **Ícones:** Lucide React Native
* **Estilização:** Vanilla StyleSheet com Design System Centralizado ([constants/theme.js](file:///c:/Users/leo/Desktop/controle-gastos-moto/constants/theme.js))
* **Armazenamento / Compartilhamento:** `expo-file-system`, `expo-sharing`, `expo-document-picker`

---

## 💡 Fluxo de Uso Recomendado (User Journey)

1. **Uso Diário / Semanal:**
   - O usuário abre o aplicativo e visualiza o **Dashboard** com o custo por km atual e autonomia do tanque.
   - Ao abastecer no posto, toca no botão **"⛽ Abastecer"** na tela de **Lançamentos**, digita a quantidade de litros da bomba, os km marcados no trip e o valor total pago. O app calcula a média em tempo real (`km/L`) e salva na planilha.

2. **Manutenção & Garagem:**
   - Ao efetuar uma troca de óleo ou manutenção de peças, acessa a tela **Óleo & Desgaste**.
   - Se sobrou óleo na garagem, ajusta no card de estoque.
   - Ao trocar uma peça (mesmo que tenha esquecido de anotar no dia), clica na peça e informa o **KM exato retroativo** no modal.

3. **Planejamento de Viagens:**
   - No Dashboard, abre a **Calculadora de Viagem & Rodovia**, informa os km do rolê e descobre o custo total de gasolina + pedágios e as paradas recomendadas.
