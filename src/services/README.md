# Serviços

Estes scripts tem como principal função atualizar o banco de dados da aplicação periodicamente, com os dados recebidos pela plataforma de e-commerce. Se por acaso, o cliente mudar de plataforma, você deve criar um novo script de getCustomers/Orders/Products para buscar as informações da nova API, e associá-lo ao scheduler.

## Scheduler.ts

Este script utiliza a biblioteca **Cron** para disparar requisições periódicas para as APIs, atualizando o banco de dados periodicamente.

Temos um método que apenas retorna a data atual em um formato interessante para os logs.

Então, temos nosso agendamento de funcionalidades. Ele deve disparar esta função todo dia as 04:00hrs, por isso o foramto '00 04 * * *'.

Primeiro, buscamos os dados dos produtos, de acordo com o script responsável por isso. Então, percorremos o resultado obtido, e atualizamos o valores de cada um dos produtos da base com os novos produtos obtidos. Fazemos o mesmo para os clientes e para os pedidos.

Por último, chamamos o script que atualiza a localização dos clientes, para verificar se há novos clientes sem localização geográfica disponível.

Então, nosso script periódico termina, e será executado novamente no próximo dia.

## GETs

Os scripts de GETs devem se conectar a API onde buscar os dados, recuperá-los, e tratá-los para retorná-los no formato esperado pelo nosso banco de dados. Se você não tratar os novos dados para que eles estejam no formato esperado, você pode QUEBRAR A APLICAÇÃO TODA. Então, dê seus console.log, verifique quais dados o nosso banco de dados usa e quais dados a plataforma de e-commerce retorna, e mapeie-os de forma a tudo se encaixar.

## Update Customers Addresses

Este script, quando rodado, vai atualizar as informações dos clientes que fizeram pedidos recentes, e atrelar sua localização geográfica a eles.

Primeiro, consultamos a coleção de **Orders**, agrupando-as por clientes e endereço. Depois, buscamos na coleção de **Customers** pelos clientes que fizeram pedidos, como recebido na consulta anterior.

Então, para cada cliente, nós verificamos se seu endereço anteriro é diferente do novo endereço. Isso significa que precisamos atualizar suas informações de localização na base de dados.

Usamos então o **GeoCoder**, enviando as informações de endereço e recebendo a latitude e longitude do novo endereço, e armazenando estas informações no documento do cliente.
