# Cron Geocoder API

Esta API fornece dados sobre pedidos, atualiza estes dados periodicamente e também utiliza geolocalização.

## Objetivo

A API serve para servir a um sistema os dados referentes a produtos de uma loja, eventualmente servindo também alguns dados pré-computados para a mostra de relatórios.

A aplicação, entretanto, não suporta rotas de criação, atualização e deleção, servindo apenas como uma API de listagem de dados. Por este motivo, seu banco de dados é alimentado periodicamente através de um script auto-executável.
## Fluxo Básico

O caminho que os dados na aplicação possuem é o seguinte:

- Periodicamente, a API insere no banco de dados dados do JSON na pasta *data*, através do script *scheduler* na pasta **services**.
- A API compara os dados do JSON dos seus dados locais, adicionando as novas informações e atualizando informações antigas.
- O usuário, para acessar as informações da API, precisa se autenticar através de login e senha. Esta autenticação é feita através da rota de *login*, e o usuário então recebe um token JWT para utilizar em suas futuras requisições.
- O usuário pode acessar os diversos endpoints da aplicação e receber seus dados, desde que esteja logado.

## Bibliotecas

A API utiliza diversos pacotes para proporcionar suas funcionalidades:

- **BCryptJS:** Biblioteca de criptografia utilizada para comparar hashes criptografadas da senha do usuário.
- **CORS:** Biblioteca que configura automaticamente os cabeçalhos CORS (Cross-Origin Security Policy) para permitir acesso de um frontend.
- **Dotenv:** A biblioteca usada para processar e configurar as variáveis de ambiente usadas na aplicação.
- **Express:** Framework para a criação do servidor em Node.js.
- **JsonWebToken:** A biblioteca responsável por gerenciar e verificar os tokens JWT, usados na autenticação dos usuários.
- **Mongoose:** Biblioteca responsável por abstrair as funcionalidades de conexão com o banco de dados MongoDB, com diversas funções para queries.
- **Mongoose Paginate v2:** Addon do Mongoose para paginar queries.
- **Node CRON:** Biblioteca para agendamento de funcionalidades na aplicação. Usada para rodar o script que popula dados da API usando os JSON.
- **Node Geocoder:** Bibilioteca para a utilização dos serviços do Google Geocode, usada para receber informações de geolocalização dos pedidos baseado no seu endereço por extenso.

## Variáveis de Ambiente

A aplicação possui diversas variáveis de ambiente que devem ser pré-configuradas para que ela funcione adequadamente:

- **MONGO_URL:** URI para conexão com o banco de dados clusterizado.
- **SECRET_KEY:** Palavra-chave usada para (des)criptografar as senhas dos usuários.
- **port:** A porta em que a aplicação vai rodar. Desnecessária em ambientes de produção.
- **CORS_CONFIG:** Uma única URL que terá acesso a aplicação. Se esta variável não existir (undefined), a aplicação permitirá o acesso de todo lugar.
- **GEOCODE_KEY:** Chave do Google Geocoder para utilizar os serviços.
