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
   git clone https://github.com/seu-usuario/sistema-de-reservas-nestjs.git

2. Instale as dependências do projeto:
   ```shell
   npm install
3. Inicie o servidor de desenvolvimento:
   ```shell
   npm run start:dev

## Configuração do ambiente

Antes de executar o projeto, é necessário configurar as seguintes variáveis de ambiente:

- `EMAIL_SERVICE`: Serviço de e-mail utilizado para envio de confirmações de reserva.
- `EMAIL_USERNAME`: Nome de usuário do serviço de e-mail.
- `EMAIL_PASSWORD`: Senha do serviço de e-mail.
- `DATABASE_URL`: URL da base de dados utilizada para armazenar as reservas.


## Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias:

- **Prisma.js**: ORM (Object-Relational Mapping) de banco de dados que facilita o acesso e manipulação dos dados.
- **NestJS**: Framework Node.js para construção de aplicações server-side.
- **TypeScript**: Linguagem de programação que adiciona recursos ao JavaScript.
- **Socket.IO**: Biblioteca de WebSockets para comunicação em tempo real.
- **MongoDB**