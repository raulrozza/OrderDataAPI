# Controladores da Aplicação

Aqui estão as regras de negócio propriamente ditas da API. Abaixo estarão, de forma resumida, os papeis de cada controladores.

## Authentication

O controlador de autenticação cuida da integridade dos dados, manipulando informações sobre tokens gerados e gerenciando sessões.

### Index

Seu método index retorna as informações de um usuário logado na aplicação. Para isso, ele recebe o id do usuário, e procura no banco de dados pelas informações deste usuário.

### Store

O método store cria uma sessão de um usuário no login. Ele recebe seu nome de usuário e senha, e verifica se ambos estão registrados e competem um ao outro. Caso isso aconteça, ele gera um token JWT, associa o token ao usuário no banco de dados, e retorna estas informações para o usuário.

## Customer

Este controlador gerencia as informações dos clientes. Ele mostra os dados de um número grande de clientes, ou de um cliente único.

### Index

Seu método index lista todos os clientes, e possui um fluxo de certa forma complexo devido aos filtros recebidos. A rota pode receber os seguintes filtros:

- page: qual página mostrar;
- names: filtra clientes pelo nome;
- hasBought: mostra apenas clientes que já realizaram pedidos;
- lastOrderDate: filtra clientes cujo o último pedido esteja entre o intervalo de Begin ou End. É possivel omitir algum destes.

A primeira coisa que a aplicação faz é checar se há paginação. Se não existe um filtro de páginas, ela devolve todos os clientes registrados de uma vez, sem aplicar nenhum outro filtro.

Então, a aplicação monta sua *query* para o banco de dados.

Primeiro, verificamos se os filtros de último pedido existem. Se existem, precisamos fazer uma consulta primeiro a coleção de **Orders**, para verificar quais clientes já registraram pedidos. Montamos a busca no bando de dados de acordo com os filtros de data passados, ordenamos os resultados em modo decrescente, e agrupamos estes resultados com base no ID do cliente que fez o pedido. Desta forma, temos as informações de quais foram os usuários que pediram, quantos pedidos efetuaram e qual a data do seu último pedido. Caso esta busca não retorne resultados, a aplicação para sua verificação aqui e retorna um resultado vazio. Senão, nós adicionamos a nossa query uma instrução para buscar apenas usuários cujos ids pertençam aos ids que recebemos agora.

Caso não haja filtros de último pedido, mas haja o filtro para verificar se um usuário já comprou, novamente precisamos consultar a coleção de **Orders**. Desta vez a consulta é mais simples, precisando apenas agrupar os pedidos os id dos usuários, progredindo então da mesma forma que na consulta anterior

Então, temos que montar um campo da busca para filtrar os usuários pelo nome. Para isso, usamos expressões regulares. O filtro de nomes é um vetor com vários nomes, e vamos pesquisar no banco de dados por clientes que contenham quaisquer destes nomes, em qualquer ordem, o que é um pouco trabalhoso. Mas no fim, apenas montamos uma expressão regular que garante isso. É um pouco avançado para explicar aqui.

Com nossa query montada, filtramos então os clientes e recebemos os resultados. Antes de retornar estes resultados, entretanto, mapeamos eles para retornar apenas as informações pertinentes e num formato que interessa o front-end, como por exemplo: apenas o nome completo, nome do cliente OU da empresa, cpf OU cnpj, etc.

Por fim, realizamos uma última consulta aos Customers, com a mesma query anterior, mas dessa vez para contar os resultados totais, sem paginar. Isto serve para informar depois, ao usuário acessando a aplicação, quantos são os resultados totais, para que ele possa navegar por estes resultados com paginação.

### Show

Este método recebe um id do usuário, e retorna suas informações do banco de dados. Existe um passo intermediário, entretanto, onde fazemos uma consulta na coleção de **Orders** para receber todos os pedidos efetuados pelo clientes. Agregamos então estas informações aos dados do cliente, e retornamos para o usuário.

## Customer Products

Este controlador tem a simples função de retornar todos os produtos já comprados por um cliente.

Para isso, primeiro buscamos na coleção de **Orders** pelos pedidos do cliente, retornando as informações apenas dos produtos. Tratamos este resultado armazenando todos os valores de produtos no vetor *allContents*.

O passo agora é mapear todos estes produtos, e salvá-los em um novo objeto. Isto por quê o resultado da coleção de pedidos pode conter entradas de produtos repetidas, de vezes em que um produto foi comprado em pedidos diferentes. Para isso, percorremos e vetor de conteúdos, e agrupamos manualmente todos os produtos no objeto *resultObj*.

Por fim, mapeamos o objeto, que está no formato "id": { values }, e o transformamos para o formato { id, ...values }. Por fim, retornamos o id do cliente e os produtos obtidos.

## Last Orders

Este controlador retorna os últimos pedidos da aplicação. Para isto, ele simplesmente faz uma consulta na coleção de **Orders**, ordenando-os pela data de maneira decrescente, limitando os resultados.

## Last Sold

Este controlador retorna os últimos produtos vendidos. Para isso, ele faz uma consulta na coleção de **Orders**, ordenando-os pela data de maneira decrescente, mas retornando apenas as informações dos produtos.

## Missing Products

Este controlador retorna os produtos em falta no estoque, de acordo com as inforamações do e-commerce. Para isso, ele apenas consulta a coleção de **Products**, filtrando aqueles com quantidade negativa, e ordendando-os pela quantidade. Ele também limita seus resultados.

## Monthly Profit

Este controlador agrupa as vendas efetuadas no último ano e retorna as informações de faturamento mensal nos últimos doze meses.

Primeiro, nós criamos dois objetos de data: um contendo as informações do ano atual até o dia atual do mês, e outro contendo as informações do ano passado, do primeiro dia do mês anterior. Por exemplo, se estamos em janeiro de 2020, o primeiro objeto será a data de janeiro de 2020, e o segundo objeto será a data de 1 de fevereiro de 2019.

Então, vamos para a consulta. Consultamos os pedidos em **Orders**, filtrando-os pela data, que está entre o último ano e o ano atual, e apenas aqueles com o status de **Delivered**.

Então, agrupamos seus valores pelo mês dos pedidos, e somamos todo o total das compras em cada mês em uma informação chamada *bruteTotal*. Ordenamos então pelo valor do mês, e recebemos esta informação.

Após a consulta, nós inferimos os nomes dos meses, substituindo o número inteiro pelo respectivo nome, e criamos um vetor que contém apenas os valores de faturamento bruto.

Por fim, ajustamos os índices de mês para preencher possíveis lacunas de faturamento, e retornamos ambos as *labels*, que são os meses em si, e o *data*, que são os dados de faturamento.

## Notification

Este controlador atualiza as informações de notificação do usuário, como mensagens padrão e e-mail para envio. Ele simplesmente recebe estas informações da requisição, e realiza uma atualização na coleção de **Users**.

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

## Product

Este controlador mostra os dados dos produtos registrados na aplicação.

### Index

Seu método index lista todos os produtos, e possui um fluxo de certa forma complexo devido aos filtros recebidos. A rota pode receber os seguintes filtros:

- page: qual página mostrar;
- names: filtra produtos pelo seu nome;
- price: filtra produtos pelo seu preço, entre Begin e End. É possivel omitir algum destes.

A primeira coisa que a aplicação faz é montar sua *query* para o banco de dados.

Checamos a existência de cada filtro e os acomplamos devidamente ao objeto de *query*. O nome dos produtos é adicionado como expressão regular, da mesma forma que no controlador de **Customers**.

Então, fazemos uma consulta na coleção de **Products**, filtrando os resultados e ordenando-os por ordem alfabética.

Por fim, realizamos a mesma consulta novamente, desta vez para contar o total de resultados e informar ao usuário, para que ele possa paginar as consultas.

### Show

Este método recebe um id do produto, e retorna suas informações do banco de dados.

## Product Customers

Este controlador lista os clientes que compraram um certo produto.

Ele recebe o id do produto, e um possível intervalo de datas, para filtrar a data das compras.

Montamos uma *query*, e realizamos a consulta na coleção de **Orders**, recebendo informações como nome e telefone nos clientes. Arrumamos o formato dos clientes para mostrar seu nome completo, e então retornamos um vetor com as informações de nome, telefone e id dos clientes recuperados.

## User

Este controlador cria e atualiza as informações de um usuário.

### Store

Este método cria um usuário padrão, definido pelas variáveis de ambiente. É uma maneira gambiarra de criar um Seed. :/

### Update

Este método atualiza as informações pessoais do usuário, como nome e senha. Obviamente, ele checa para ver se a senha antiga bate com a armazenada, e só então cria uma nova senha criptografada e atualiza seu valor.
