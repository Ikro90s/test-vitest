### 1. Pacotes Instalados e sua Utilidade
Os seguintes pacotes foram fundamentais para a arquitetura:

*   `inversify` & `reflect-metadata`: Ferramentas para **Inversão de Controle (IoC)**. Permitem que o sistema gerencie as dependências automaticamente.
*   `express`: Framework para a camada HTTP (API).
*   `vitest`: Ferramenta de testes moderna e veloz, compatível com TypeScript.
*   `@faker-js/faker`: Utilizado para gerar dados aleatórios realistas nos relatórios (nomes, cidades, etc).
*   `nodemailer`: Para a implementação real de envio de e-mails.
*   `winston`: Para a implementação real de logs do sistema.
*   `ts-node` & `typescript`: Ambiente de execução e compilação para TypeScript.

### 2. O que foi feito (Arquitetura e Alterações)
A aplicação foi dividida em três camadas principais para respeitar o DIP:

*   **Domínio (`src/domain`)**: Contém a "verdade" do negócio. O `ReportService` não conhece o `Winston` ou o `Nodemailer`; ele conhece apenas as **interfaces** `ILogger` e `IMailer`. Se amanhã você quiser trocar o envio de e-mail por SMS, o código do serviço de relatório não mudará.
*   **Infraestrutura (`src/infra`)**: Aqui residem as implementações concretas (os "detalhes"). O `NodemailerMailer` e o `WinstonLogger` implementam as interfaces definidas pelo domínio.
*   **Configuração (`src/config`)**: O arquivo `container.ts` é o "cérebro" que conecta tudo. Ele diz ao sistema: "Sempre que alguém pedir um `IMailer`, entregue a classe `NodemailerMailer`".

### 3. Por que os testes foram colocados desta forma?
O uso do DIP facilitou a criação de dois tipos de testes isolados:

#### Testes de Domínio (`src/domain/report-service.spec.ts`)
*   **Foco**: Validar a lógica de negócio (ex: não permitir relatórios com tamanho negativo ou maior que 10).
*   **Estratégia**: Como o `ReportService` recebe suas dependências pelo construtor, injetamos "Mocks" (objetos falsos) manuais. Isso garante que nenhum e-mail real seja enviado durante os testes e que o teste seja ultra-rápido.

#### Testes de Camada HTTP (`src/http/report-http-adapter.spec.ts`)
*   **Foco**: Garantir que a API responde com os códigos de status corretos (200, 400, 500).
*   **Estratégia**: Usamos o container do Inversify para fazer um `rebind`. Substituímos o serviço real por um mock. Isso permite testar como o controlador reage a erros do serviço (como o `InvalidReportSizeError`) sem precisar executar a lógica de geração de dados.

### 4. Tutorial de Execução

#### Passo 1: Instalação
No terminal, na raiz do projeto, instale as dependências:
```bash
npm install
```

#### Passo 2: Configuração (Opcional)
Se desejar testar o envio de e-mail real, configure as credenciais no arquivo `.env` (baseado no `.env.example` se existir), mas a aplicação já possui valores padrão para rodar em desenvolvimento.

#### Passo 3: Rodar a Aplicação
Para iniciar o servidor em modo de desenvolvimento:
```bash
npm run start:dev
```
A API estará disponível em `http://localhost:3000`.
*   **Exemplo de uso**: `GET http://localhost:3000/relatorio/5?email=teste@email.com`

#### Passo 4: Rodar os Testes
Para executar a suíte de testes unitários e verificar se tudo está funcionando corretamente:
```bash
npx vitest run
```
Este comando executará todos os 6 testes implementados (Domínio e HTTP) e apresentará o relatório de sucesso no terminal.
