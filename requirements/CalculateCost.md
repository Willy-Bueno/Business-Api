# Calculo do serviço por período

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/calculo**
2. ✅ Valida dados obrigatórios **cnpj**, **data_inicio** e **data_fim**
3. ✅ Valida que o campo **cnpj** é um cnpj com apenas numeros
4. ✅ Valida que o campo **cnpj** é um cnpj válido
5. ✅ valida se a **data_inicio** e **data_fim** está em formato ISO (yyyy-mm-dd)
6. ✅ Retorna o **valor_calculado** com statusCode **200**

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se cnpj, data_inicio ou data_fim não forem fornecidos pelo client
3. ✅ Retorna erro **400** se cnpj, data_inicio ou data_fim não forem válidos
4. ✅ Retorna erro **500** se der erro ao tentar adicionar a empresa ao banco de dados
