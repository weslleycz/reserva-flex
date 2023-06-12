# Sistema de Reservas (NestJS)

Este é um sistema de reservas construído com o NestJS que permite aos usuários fazerem reservas em um hotel.

## Funcionalidades

- Os usuários podem visualizar a disponibilidade de quartos em diferentes datas.
- Os usuários podem fazer reservas selecionando a data de check-in, a data de check-out e o número de quartos desejados.
- Os usuários podem visualizar os detalhes da reserva, incluindo o preço total e as datas selecionadas.
- Os usuários recebem uma confirmação por e-mail após efetuarem a reserva.

## Pré-requisitos

Antes de iniciar, verifique se você possui o seguinte instalado:

- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes do Node.js)
- NestJS CLI (opcional)

## Como executar o projeto

1. Clone este repositório para sua máquina local:

   ```shell
   git clone https://github.com/weslleycz/reserva-flex.git

2. Instale as dependências do projeto:
   ```shell
   npm install
3. Inicie o servidor de desenvolvimento:
   ```shell
   docker-compose up
4. Execute o projeto com o Docker Compose:
   ```shell
   npm run start:dev

## Configuração do ambiente

Antes de executar o projeto, é necessário configurar as seguintes variáveis de ambiente:



- `DATABASE_URL`: URL da base de dados utilizada para armazenar as reservas.
- `Security_Key`: Senha de segurança para mockar o token de administrador.
- `Security_JWT`: Chave secreta utilizada para assinar e verificar tokens JWT.
- `MONGO_USERNAME`: Usuário do MongoDB.
- `MONGO_PASSWORD`: Senha do MongoDB.
- `EMAIL`: Endereço de e-mail utilizado para enviar confirmações de reserva.
- `EMAIL_PASSWORD`: Senha do e-mail utilizado para enviar confirmações de reserva.
- `STRIPE_PUBLIC_KAY`: Chave pública do Stripe para integração de pagamentos.
- `STRIPE_PRIVATE_KAY`: Chave privada do Stripe para integração de pagamentos.
- `REDIS_HOST`: Host do servidor Redis para armazenamento em cache.
- `REDIS_PORT`: Porta do servidor Redis para armazenamento em cache.

## Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias:

- **Prisma.js**: ORM (Object-Relational Mapping) de banco de dados que facilita o acesso e manipulação dos dados.
- **NestJS**: Framework Node.js para construção de aplicações server-side.
- **TypeScript**: Linguagem de programação que adiciona recursos ao JavaScript.
- **MongoDB**: Banco de dados orientado a documentos que fornece uma maneira flexível e escalável de armazenar dados.
- **Redis**: Sistema de armazenamento em cache em memória rápido e de alto desempenho.
- **Stripe**: Plataforma de pagamentos online para processar transações financeiras de forma segura e confiável.
- **Nodemailer**: Módulo do Node.js para envio de e-mails que oferece uma interface fácil de usar e suporte a vários provedores de e-mail.
- **bcrypt**: Biblioteca para criptografia de senhas que fornece funções de hash seguras para armazenamento seguro de senhas.
- **cron**: Biblioteca para agendamento de tarefas cron para executar ações em intervalos específicos.
- **GridFS**: Sistema de arquivos para armazenamento e recuperação de arquivos de grande porte no MongoDB.
- **JWT**: JSON Web Tokens são utilizados para autenticação e autorização de usuários, fornecendo um token seguro que pode ser verificado e decodificado.
- **EventSource**: Interface do navegador para consumir eventos em tempo real do servidor por meio do protocolo Server-Sent Events (SSE).
