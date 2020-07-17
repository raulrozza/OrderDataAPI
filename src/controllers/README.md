# Controladores da Aplicação

Aqui estão as regras de negócio propriamente ditas da API. Abaixo estarão, de forma resumida, os papeis de cada controladores.

## Authentication

O controlador de autenticação cuida da integridade dos dados, manipulando informações sobre tokens gerados e gerenciando sessões.

### Index

Seu método index retorna as informações de um usuário logado na aplicação. Para isso, ele recebe o id do usuário, e procura no banco de dados pelas informações deste usuário.

### Store

O método store cria uma sessão de um usuário no login. Ele recebe seu nome de usuário e senha, e verifica se ambos estão registrados e competem um ao outro. Caso isso aconteça, ele gera um token JWT, associa o token ao usuário no banco de dados, e retorna estas informações para o usuário.

## Last Orders

Este controlador retorna os últimos pedidos da aplicação. Para isto, ele simplesmente faz uma consulta na coleção de **Orders**, ordenando-os pela data de maneira decrescente, limitando os resultados.

## Monthly Profit

Este controlador agrupa as vendas efetuadas no último ano e retorna as informações de faturamento mensal nos últimos doze meses.

Primeiro, nós criamos dois objetos de data: um contendo as informações do ano atual até o dia atual do mês, e outro contendo as informações do ano passado, do primeiro dia do mês anterior. Por exemplo, se estamos em janeiro de 2020, o primeiro objeto será a data de janeiro de 2020, e o segundo objeto será a data de 1 de fevereiro de 2019.

Então, vamos para a consulta. Consultamos os pedidos em **Orders**, filtrando-os pela data, que está entre o último ano e o ano atual, e apenas aqueles com o status de **Delivered**.

Então, agrupamos seus valores pelo mês dos pedidos, e somamos todo o total das compras em cada mês em uma informação chamada *bruteTotal*. Ordenamos então pelo valor do mês, e recebemos esta informação.

Após a consulta, nós inferimos os nomes dos meses, substituindo o número inteiro pelo respectivo nome, e criamos um vetor que contém apenas os valores de faturamento bruto.

Por fim, ajustamos os índices de mês para preencher possíveis lacunas de faturamento, e retornamos ambos as *labels*, que são os meses em si, e o *data*, que são os dados de faturamento.

## Order

Este controlador mostra os dados dos pedidos registrados na aplicação.

### Index

Seu método index lista todos os pedidos, e possui um fluxo de certa forma complexo devido aos filtros recebidos. A rota pode receber os seguintes filtros:

- page: qual página mostrar;
- names: filtra pedidos pelo nome do cliente;
- product: filtra pedidos pelos nomes dos produtos comprados;
- orderStatus: filtra pedidos pelo status do pedido;
- paymentType: filtra pedidos pelo tipo de pagamento;
- date: filtra pedidos pela sua data de realização, entre Begin e End. É possivel omitir algum destes.

A primeira coisa que a aplicação faz é montar sua *query* para o banco de dados.

Checamos a existência de cada filtro e os acomplamos devidamente ao objeto de *query*. Os nomes de produtos e clientes são adicionados como expressões regulares, da mesma forma que no controlador de **Customers**.

Então, fazemos uma consulta na coleção de **Orders**, concatenando os nomes de usuários para recebermos apenas os nomes completos, filtrando-os e ordenando-os de forma a mostrar os últimos pedidos primeiro.

Por fim, realizamos a mesma consulta novamente, desta vez para contar o total de resultados e informar ao usuário, para que ele possa paginar as consultas.

### Show

Este método recebe um id do pedido, e retorna suas informações do banco de dados. Caso a consulta seja feita pelo mapa, a aplicação verifica se a localização geográfica do pedido já está armazenada. Se não, ela utiliza o **Geocoder** da google para obter estas informações, e armazena no banco de dados para futuras consultas. Então, retorna todas estas informações para o usuário.

## User

Este controlador cria e atualiza as informações de um usuário.

### Store

Este método cria um usuário padrão, definido pelas variáveis de ambiente. É uma maneira gambiarra de criar um Seed. :/

### Update

Este método atualiza as informações pessoais do usuário, como nome e senha. Obviamente, ele checa para ver se a senha antiga bate com a armazenada, e só então cria uma nova senha criptografada e atualiza seu valor.
