# ibge-cidades-com-poligonos
Cruzamento da base de municípios do IBGE em JSON com os polígonos de cada município em GeoJSON.

## municipios-poligonos.json

O arquivo [municipios-poligonos.json](municipios-poligonos.json) contém um array de objetos em JSON com as seguintes propriedades:

<br>

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| _id | `string` | Chave primária sugerida para uso em banco de dados. É obtida a partir da concatenação de `municipioNome` + `, ` + `ufSigla`. |
| poligono | `GeoJSON<MultiPolygon>` | Geometria do ponto em GeoJSON, estruturada em MultiPolygon. |
| municipioNome | `string` | Nome do município.|
| ufSigla | `string`| Sigla da Unidade da Federação (UF) / Estado. |

<details>
<summary>
Outras propriedades menos usadas
</summary>
Demais propriedades disponíveis na base de municípios do IBGE estão disponíveis como `string` em cada objeto:
  
- `ufCodigo`
- `ufNome`
- `mesorregiaoCodigo`
- `mesorregiaoNome`
- `microrregiaoCodigo`
- `microrregiaoNome`
- `municipioCodigo`
- `municipioCodigoAbreviado`
  
Adicionalmente, existe uma propriedade `kmlBrasil` com o nome do arquivo do polígono correspondente no repositório [eduardo-veras/kml-brasil](https://github.com/eduardo-veras/kml-brasil).
</details>

### Exemplo

Objeto do município Rio de Janeiro, RJ:

```
{
  "_id" : "Rio de Janeiro, RJ",
  "ufCodigo" : "33",
  "ufNome" : "Rio de Janeiro",
  "ufSigla" : "RJ",
  "mesorregiaoCodigo" : "06",
  "mesorregiaoNome" : "Metropolitana do Rio de Janeiro",
  "microrregiaoCodigo" : "018",
  "microrregiaoNome" : "Rio de Janeiro",
  "municipioCodigo" : "3304557",
  "municipioCodigoAbreviado" : "04557",
  "municipioNome" : "Rio de Janeiro",
  "poligono" : {
    "type" : "MultiPolygon",
    "coordinates" : [
      [
        [...]
      ],
      [
        [...]
      ],
      [
        [...]
      ]
    ]
  },
  "kmlBrasil": "RIO_DE_JANEIRO"
}
```

Teste de visualização do polígono no município:

![image](https://user-images.githubusercontent.com/2074685/145829415-4c3be422-e72e-4031-bdc8-2bfd5fe4be39.png)

## Como esse repositório foi gerado

- A base de municípios e suas propriedades (nome, UF, etc.) são obtidas do repositório [ggondim/ibge-cidades](https://github.com/eduardo-veras/kml-brasil) através de submódulo.
- Os polígonos de cada cidade são obtidos do repositório [eduardo-veras/kml-brasil](https://github.com/eduardo-veras/kml-brasil) e convertidos de `LineString` para `MultiPolygon`.
- Cada polígono foi cruzado com os nomes das cidades e siglas das UFs e inserido no array de municípios.
- O script de transformação e importação é o arquivo `conversao.js`.
- Os repositórios de municipios e de polígonos são submódulos do Git.

## Limitações
- **Atualização**: esse repositório depende de dois repositórios, portanto, está limitado às atualizações deles. Por conta dessa dependência e do esforço não remunerado de atualizar frequentemente, não existe intenção de atualizações periódicas. No entanto, existem 5.770 municípios com polígonos no último cruzamento de polígonos, o que deve ser suficiente para cobrir a grande maioria de casos de uso.
- **Simplicidade dos polígonos**: conforme informado pelo Eduardo Veras no repositório [eduardo-veras/kml-brasil](https://github.com/eduardo-veras/kml-brasil), os polígonos foram simplificados para diminuir sua complexidade e tamanho (por conta dos micro segmentos dos polígonos originais no IBGE). Por isso, o polígono pode não corresponder com exatidão às fronteiras dos municípios nem às suas áreas. Entretanto, mesmo com a simplificação, os polígonos são suficientes para cobrir a maioria dos casos de uso.
- **Municípios não encontrados**: na última geração, 3 municípios na base de municípios não foram encontrados no repositório kml-brasil: "Januário Cicco, RN", "Augusto Severo, RN" e "Açu, RN".

## Gerar/atualizar os dados

Você pode gerar novamente o arquivo de municípios com os polígonos apenas atualizando os submódulos dependentes e rodando o arquivo `conversao.js`.

## Contribuição

Se quiser contribuir para a melhoria ou atualização desse repositório, basta abrir uma issue ou me mandar um e-mail em [gustavospgondim@gmail.com](mailto:gustavospgondim@gmail.com).

## Licença

Esse repositório depende da licença dos seus dois submódulos dependentes. Porém, os dados do IBGE são de uso público e, portanto, esse repositório é livre ser distribuído e alterado sem nenhum tipo de restrição.

Não existe a intenção de prover suporte técnico, exatidão ou atualização para esse repositório. Os dados e códigos são fornecidos como estão ("AS IS"). 
