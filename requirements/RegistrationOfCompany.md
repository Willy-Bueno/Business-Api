# Cadastro de Empresa

> ## Caso de sucesso

1. ✅ Recebe uma requisição do tipo **POST** na rota **/empresas**
2. ✅ Valida dados obrigatórios **name**, **cnpj**, **data_fundacao** e **valor_hora**
3. ✅ Valida que o **name** tenha no máximo 50 caracteres
4. ✅ Valida que o campo **cnpj** é um cnpj válido
5. ✅ valida se já existe uma empresa com o **cnpj** fornecido
6. ✅ valida se a **data_funcacaoo** está em formato ISO (yyyy-mm-aa)
7. ✅ valida se o **valor_hora** está em decimal (9,2)

> ## Exceções

1. ✅ Retorna erro **404** se a API não existir
2. ✅ Retorna erro **400** se name, cnpj, data_fundacao ou valor_hora não forem fornecidos pelo client
3. ✅ Retorna erro **400** se name, cnpj, data_fundacao ou valor_hora não forem válidos
5. ✅ Retorna erro **403** se o cnpj fornecido já estiver em uso
9. ✅ Retorna erro **500** se der erro ao tentar adicionar a empresa ao banco de dados