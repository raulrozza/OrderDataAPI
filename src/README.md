# Estrutura de Pastas

Os arquivos da API são distribuídos nas seguintes pastas:

- *Controllers:* A pasta que contém os controladores da aplicação. Estes são responsáveis por processar as requisições dos usuários, e fazer a ligação entre o que o usuário precisa e o que o banco de dados pode fornecer. De maneira geral, os controladores definem as regras de negócio da aplicação.
- *Models:* Contém os esquemas das entidades do banco de dados. Informações dos campos das entidades, quais são necessários, como eles são processados e etc estão definidos ali.
- *Services:* Esta pasta contém scripts responsáveis por preencher o banco de dados. Seu principal script atualmente é o atualizador de dados da base, **scheduler.jt**.

# Scripts

Uma breve explicação dos scripts nesta pasta.

## Server.ts

Este é o arquivo principal da aplicação e ponto de entrada do servidor. Ele é responsável por centralizar os demais scripts e configurar especificações da API.

Ele constrói um servidor usando **Express**, salvando seus dados na variável *server*. Ele então monta uma conexão com o banco de dados MongoDB via **Mongoose**. A variável *connection* contém os dados da conexão, e alguns eventos foram atrelados a ela para resolver problemas de conectividade ~~, sem sucesso~~.

Após conectar ao servidor, a aplicação configura sua política de acesso remoto. Ele verifica se a variável de ambiente CORS_CONFIG está presente, o que denota que a aplicação apenas permitirá o acesso ao endereço especificado nela.
    Se existe esse endereço, então a aplicação cria uma *whitelist* e configura o cors para permitir apenas a conexão deste domínio.
    Se não existe, a aplicação configura o cors de maneira geral, permitindo conexões de qualquer lugar. Usado para ambiente de desenvolvimento.

Então, a aplicação configura seu *middlware* para entender requisições com dados do tipo JSON, e também suas rotas, que são definidas em outro arquivo.

Por fim, a aplicação executa a função **Scheduler**, que atualizará periodicamente o banco de dados, e começa a ouvir na porta definida pelo ambiente.

## Routes.ts

Este script define o comportamento das rotas da aplicação. Ele faz uso dos controladores, definidos na pasta *controllers*.

O comportamento geral de cada rota é: Primeiro, receber sua URL de destino; caso seja uma rota interna da aplicação, verificar se o usuário está logado com a função **verifyToken**; Executar o método devido de acordo com o controlador necessário.

### Endpoints

Existem diversos pontos de acesso da aplicação.

#### Authentication

Rotas para autenticar um usuário.

- **login**, POST: Esta rota realiza o login do usuário, através do controlador de Autenticação.
- **auth/:id**, GET: Esta rota verifica se o usuário com o id informado está autenticado na aplicação.

#### Orders

Rotas de visualização de pedidos.

- **orders?:page**, GET: Esta rota lista todos os pedidos, mas limita a quantidade de retornos possíveis. Para navegar por todos os pedidos, o endpoint informa a quantidade total de pedidos existentes, e recebe como parâmetro um valor de paginação.
- **order?:id**, GET: Retorna todas as informações de um único pedido.

#### User

Rotas de manipulação de usuários.

- **user**, POST: Cria um novo usuário na aplicação.
- **user**, PUT: Atualiza as informações pessoais de um determinado usuário na aplicação.

#### Reports

Rotas de visualização de relatórios

- **lastOrders**, GET: Retorna quais foram os últimos pedidos recebidos.
- **monthlyProfit**, GET: Retorna informações de faturamento dos últimos 12 meses.

## VerifyToken.ts

Este script é um *middleware* que checa a autenticidade de um usuário. Ele verifica a existência do HEADER de autenticação, e valida o token recebido. Caso alguma informação não bata, retorna um erro de 403, acesso proibido.
