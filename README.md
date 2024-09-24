# Node + Fastify + TypeScript + Vercel

Este é um modelo para iniciar suas aplicações de serverless functions com o Vercel.

## Demonstração

https://vercel.com/erick-leites-projects/node-fastify-typescript-vercel-app

## Criação do modelo

### 1. Instalação das dependências

Para instalar as dependências necessárias, execute o seguinte comando:

```
npm i fastify @fastify/cors
```

### 2. Instalação das dependências de desenvolvimento

Para instalar as dependências de desenvolvimento, execute o comando abaixo:

```
npm i typescript @types/node tsx @vercel/node@latest -D
```

### 3. Criação do arquivo de rotas da aplicação

O código deste arquivo define uma API que responde com a mensagem "Olá, mundo" quando recebe uma requisição GET na raiz ("/"). A estrutura e os tipos utilizados são específicos do framework Fastify com TypeScript, demonstrando como criar uma rota básica e enviar uma resposta em formato JSON.

> routes.ts

```ts
// Importa os tipos necessários do Fastify
import {
  FastifyInstance,
  // Representa uma instância do servidor Fastify
  FastifyPluginOptions,
  // Opções para plugins Fastify
  FastifyRequest,
  // Representa uma requisição HTTP
  FastifyReply,
  // Representa uma resposta HTTP
} from "fastify";
/*
  Define a função assíncrona `routes`
  que configura as rotas do servidor
*/
const routes = async (
  instance: FastifyInstance,
  // Instância do servidor Fastify
  options: FastifyPluginOptions
  // Opções de plugin (não usadas neste caso)
) => {
  // Define uma rota GET para o caminho "/"
  instance.get(
    "/",
    // Define a função assíncrona de manipulação da rota
    async (
      request: FastifyRequest,
      // Requisição HTTP
      reply: FastifyReply
      // Resposta HTTP
    ) => {
      // Define o código de status da resposta como 200 (OK)
      // e envia um objeto JSON com a mensagem "Olá, mundo"
      reply.code(200).send({ message: "Olá, mundo" });
    }
  );
};
/*
  Exporta a função `routes` como padrão,
  tornando-a acessível para outros módulos
*/
export default routes;
```

### 4 - Criação do arquivo de servidor da Aplicação

O arquivo abaixo configura um servidor web usando o framework Fastify.

> server.ts

```ts
// Importa o módulo 'dotenv' para carregar variáveis de ambiente de um arquivo .env
import dotenv from "dotenv";
// Importa o framework 'fastify' para criar o servidor web
import fastify from "fastify";
// Importa o plugin 'fastifyCors' para habilitar CORS (Cross-Origin Resource Sharing)
// CORS permite que um servidor autorize solicitações de origens diferentes
import fastifyCors from "@fastify/cors";
// Importa os tipos 'VercelRequest' e 'VercelResponse' do pacote '@vercel/node' para usar com o Vercel
// Esses tipos fornecem informações sobre a requisição e resposta HTTP no ambiente Vercel
import { VercelRequest, VercelResponse } from "@vercel/node";
// Importa as rotas da aplicação do arquivo './routes.js'
// O arquivo routes.js define as diferentes rotas e seus handlers
import routes from "./routes.js";

// Carrega as variáveis de ambiente do arquivo .env
// As variáveis de ambiente podem ser acessadas apartir do process.env.[NOME_DA_VARIAVEL]
dotenv.config();

// Define a porta do servidor, usando a variável de ambiente PORT ou 8080 como padrão
// A porta define onde o servidor irá escutar as requisições
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Cria uma instância do servidor Fastify com logs habilitados
// Os logs ajudam a depurar o servidor e entender o que está acontecendo
const server = fastify({ logger: true });

/*
  Registra o plugin fastifyCors para habilitar CORS,
  permitindo que solicitações de diferentes origens acessem os recursos do servidor.
  E depois registra as rotas da aplicação
  As rotas definem os endpoints da API e como o servidor responde a diferentes solicitações 
*/
server.register(fastifyCors);
server.register(routes);

// Define o handler para lidar com as requisições do Vercel
// O handler é a função que será chamada pelo Vercel para processar cada requisição
const handler = async (request: VercelRequest, response: VercelResponse) => {
  // Aguarda o servidor estar pronto
  // Garante que o servidor esteja totalmente inicializado antes de processar as requisições
  await server.ready();
  // Emite o evento 'request' no servidor HTTP do Fastify para processar a requisição
  // Passa a requisição e resposta para o servidor Fastify para que ele possa lidar com a lógica da aplicação
  server.server.emit("request", request, response);
};

/*
 Inicia o servidor na porta especificada
 E define um callback para lidar com erros ou sucesso na inicialização
*/
server.listen({ port: port }, (err, address) => {
  // Se houver um erro, imprime o erro e encerra o processo
  if (err) {
    console.error(err);
    process.exit(1);
  }
  // Se o servidor iniciar com sucesso, imprime a porta em que está rodando
  console.log(`Servidor rodando na porta ${address}`);
});

// Exporta o handler para ser usado pelo Vercel
// Permite que o Vercel use o handler para processar as requisições
export default handler;
```

#### Funcionalidades

- Carrega variáveis de ambiente
- Define rotas para a aplicação
- Habilita CORS
- Inicia o servidor na porta especificada (ou na porta 8080 como padrão)
- Inclui um handler para integrar o servidor com o ambiente Vercel

#### Código

O arquivo principal do servidor contém:

- Importação de dependências necessárias
- Configuração de variáveis de ambiente
- Criação e configuração do servidor Fastify
- Registro de plugins (CORS e rotas)
- Definição de um handler para integração com Vercel
- Inicialização do servidor

#### Execução

O servidor é iniciado na porta especificada nas variáveis de ambiente ou na porta 8080 por padrão.

#### Integração com Vercel

O código inclui um handler específico para permitir a integração com o ambiente Vercel, facilitando o deploy da aplicação nesta plataforma.

### 5 - Criação das configurações do vercel

O arquivo de configuração abaixo diz à Vercel para construir sua aplicação usando Node.js e redirecionar todas as solicitações para o arquivo src/server.ts.

> vercel.json

```json
{
  // Seção "builds": Define como a aplicação deve ser construída
  "builds": [
    {
      // "src": Caminho para o arquivo principal da aplicação
      "src": "src/server.ts",
      // "use": Especifica o ambiente de execução (@vercel/node para Node.js)
      "use": "@vercel/node"
    }
  ],
  // Seção "rewrites": Define regras de redirecionamento
  "rewrites": [
    {
      // "source": Padrão de URL que aciona o redirecionamento (.* corresponde a qualquer caminho)
      "source": "/(.*)",
      // "destination": Destino para onde as solicitações devem ser redirecionadas
      "destination": "src/server.ts"
    }
  ]
}
```

### 6 - Criação das configurações do TypeScript

Abaixo estão as configurações do TypeScript que eu estou usando, mas você pode definir suas próprias configurações.

> tsconfig.json

```json
{
  "compilerOptions": {
    /* Linguagem e Ambiente */
    "target": "ES2021" /* Define a versão da linguagem JavaScript para o JavaScript emitido e inclui declarações de biblioteca compatíveis. */ /* Módulos */,

    "module": "NodeNext" /* Especifica qual código de módulo é gerado. */,
    "rootDir": "src" /* Especifica a pasta raiz dentro dos
 seus arquivos de origem. */ /* Suporte a JavaScript */,

    "checkJs": true /* Habilita a emissão de erros em arquivos JavaScript com verificação de tipo. */ /* Emissão */,

    "removeComments": true /* Desabilita a emissão de comentários. */ /* Restrições de Interoperabilidade */,

    "esModuleInterop": true /* Emite JavaScript adicional para facilitar o suporte à importação de módulos CommonJS. Isso habilita 'allowSyntheticDefaultImports' para compatibilidade de tipo. */,
    "forceConsistentCasingInFileNames": true /* Garante que a capitalização esteja correta nas importações. */ /* Verificação de Tipo */,

    "strict": true /* Habilita todas as opções de verificação de tipo estrita. */ /* Completude */,

    "skipLibCheck": true /* Ignora a verificação de tipo de todos os arquivos .d.ts. */
  }
}
```

### 7 - Configuração do arquivo package.json

Abaixo, listo as configurações do package.json deste projeto que eu recomendo.

```json
{
  // Define o tipo de módulo como ES Modules
  "type": "module",

  // Define o ponto de entrada da aplicação (arquivo principal)
  "main": "src/server.ts",

  // Define scripts que podem ser executados
  "scripts": {
    // Script para iniciar o servidor de desenvolvimento e monitorar mudanças
    "dev": "tsx watch src/server.ts",

    // Script para fazer o deploy da aplicação em produção no Vercel
    "deploy": "npx vercel --prod"
  }
}
```

### 8 - Ignorando pastas ou arquivos do Git

Abaixo estão as pastas ou arquivos que eu ignorei para que não sejam enviados para o código de produção.

```
# Dependências
/node_modules

# Vercel
.vercel

# ENV
.env
```

### Contribuições

Contribuições são bem-vindas! Para contribuir, por favor, fork este repositório e abra um pull request.

### Licença

Este projeto está licenciado sob a MIT License.
