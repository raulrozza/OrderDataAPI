# Serviços

Estes scripts tem como principal função atualizar o banco de dados da aplicação periodicamente, com os dados recebidos pela plataforma de e-commerce. Se por acaso, o cliente mudar de plataforma, você deve criar um novo script de getCustomers/Orders/Products para buscar as informações da nova API, e associá-lo ao scheduler.

## Scheduler.ts

Este script utiliza a biblioteca **Cron** para disparar requisições periódicas para as APIs, atualizando o banco de dados periodicamente.

Temos um método que apenas retorna a data atual em um formato interessante para os logs.

Então, temos nosso agendamento de funcionalidades. Ele deve disparar esta função todo dia as XX:YYhrs, configurado no formato 'YY XX * * *'.

Primeiro, buscamos os dados dos pedidos, de acordo com o script responsável por isso. Então, percorremos o resultado obtido, e atualizamos o valores de cada um dos pedidos da base com os novos produtos obtidos.

Então, nosso script periódico termina, e será executado novamente no próximo dia.
