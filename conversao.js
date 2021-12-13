const fs = require('fs');
let lineToPolygon = require('@turf/line-to-polygon');
lineToPolygon = lineToPolygon.default;

/**
 * Remove acentuações da string e converte para snake_case.
 * @param {string} str
 * @return {string}
 */
function toSnakeCase(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+|\-/g)
    .join('_')
    .replace(/_\-_/g, '-');
}

/**
 * Normaliza o nome da cidade retirando os apóstrofes de D'.
 * @param {string} cidade
 */
function normalizacaoCidade(cidade, uf) {
  let _cidade = cidade;
  if (_cidade.indexOf("D'") !== -1) {
    _cidade = _cidade.replace("D'", 'D');
  }
  return _cidade;
}

/**
 * Abre e parseia um arquivo GeoJSON, e injeta o nome do arquivo em uma propriedade `arquivo` na primeira feature.
 * @param {string} path Caminho do arquivo a ser aberto.
 * @param {string} nomeArquivo Nome do arquivo sem a extensão.
 * @return {GeoJSON}
 */
function parseGeoJson(path, nomeArquivo) {
  const arquivo = fs.readFileSync(path, { encoding: 'utf-8' })
  const geojson = JSON.parse(arquivo);
  geojson.features[0].properties.arquivo = nomeArquivo;
  return geojson;
}

/**
 * Tenta obter o polígono de um município salvo na base kml-brasil, considerando todas as
 * especificidades de nomenclatura usadas nesse repositório.
 * @param {string} cidade Nome do município.
 * @param {string} uf Sigla da UF.
 * @return {GeoJSON}
 */
function obterPoligono(cidade, uf) {
  try {
    let _cidadeUpper = cidade.toUpperCase();
    let _cidade = _cidadeUpper;
    let cidadeSnake = '';
    const path = `./kml-brasil/lib/2010/municipios/${uf.toUpperCase()}/geojson/`;
    let arquivo = '';

    // tentativa 1: considerando conversão "D'OESTE" para "DO OESTE
    if (_cidadeUpper.indexOf("D'OESTE") !== -1) {
      _cidade = _cidadeUpper.replace("D'OESTE", 'DO OESTE');
    }
    _cidade = normalizacaoCidade(_cidade, uf);
    cidadeSnake = toSnakeCase(_cidade).toUpperCase();
    arquivo = `${path}${cidadeSnake}.geojson`;
    if (fs.existsSync(arquivo)) {
      return parseGeoJson(arquivo, cidadeSnake);
    }

    // tentativa 2: considerando conversão "D'OESTE" para "DOESTE"
    if (_cidadeUpper.indexOf("D'OESTE") !== -1) {
      _cidade = _cidadeUpper.replace("D'OESTE", 'DOESTE');
    }
    _cidade = normalizacaoCidade(_cidade, uf);
    cidadeSnake = toSnakeCase(_cidade).toUpperCase();
    arquivo = `${path}${cidadeSnake}.geojson`;
    if (fs.existsSync(arquivo)) {
      return parseGeoJson(arquivo, cidadeSnake);
    }

    // tentativa 3: correções de grafia e nomes entre as bases (kml-brasil e IBGE)
    _cidade = _cidadeUpper.indexOf('SANTA IZABEL DO PARÁ') != -1 ? 'SANTA_ISABEL_DO_PARA' : _cidade;
    _cidade = _cidadeUpper.indexOf('ITAPAJÉ') != -1 ? 'ITAPAGE' : _cidade;
    _cidade = _cidadeUpper.indexOf('COUTO MAGALHÃES') != -1 ? 'COUTO_DE_MAGALHAES' : _cidade;
    _cidade = _cidadeUpper.indexOf('ELDORADO DO CARAJÁS') != -1 ? 'ELDORADO_DOS_CARAJAS' : _cidade;
    _cidade = _cidadeUpper.indexOf('SÃO VALÉRIO') != -1 && uf === 'TO' ? 'SAO_VALERIO_DA_NATIVIDADE' : _cidade;
    _cidade = _cidadeUpper.indexOf('BELÉM DO SÃO FRANCISCO') != -1 ? 'BELEM_DE_SAO_FRANCISCO' : _cidade;
    _cidade = _cidadeUpper.indexOf('IGUARACY') != -1 ? 'IGUARACI' : _cidade;
    _cidade = _cidadeUpper.indexOf('GRACHO CARDOSO') != -1 ? 'GRACCHO_CARDOSO' : _cidade;
    _cidade = _cidadeUpper.indexOf('SÃO LUIZ DO PARAITINGA') != -1 ? 'SAO_LUIS_DO_PARAITINGA' : _cidade;
    _cidade = _cidadeUpper.indexOf('TRAJANO DE MORAES') != -1 ? 'TRAJANO_DE_MORAIS' : _cidade;
    _cidade = _cidadeUpper.indexOf(`OLHO D'ÁGUA DO BORGES`) != -1 ? 'OLHO-DAGUA_DO_BORGES' : _cidade;
    _cidade = _cidadeUpper.indexOf(`BIRITIBA MIRIM`) != -1 ? 'BIRITIBA-MIRIM' : _cidade;
    _cidade = _cidadeUpper.indexOf(`PRESIDENTE CASTELLO BRANCO`) != -1 ? 'PRESIDENTE_CASTELO_BRANCO' : _cidade;
    _cidade = _cidadeUpper.indexOf(`SANT'ANA DO LIVRAMENTO`) != -1 ? 'SANTANA_DO_LIVRAMENTO' : _cidade;
    _cidade = _cidadeUpper.indexOf(`PINGO D'ÁGUA`) != -1 ? 'PINGO-DAGUA' : _cidade;
    _cidade = _cidadeUpper.indexOf(`QUIJINGUE`) != -1 ? 'QUINJINGUE' : _cidade;
    _cidade = _cidadeUpper.indexOf(`LUIZ ALVES`) != -1 ? 'LUIS_ALVES' : _cidade;
    _cidade = _cidadeUpper.indexOf(`PASSA VINTE`) != -1 ? 'PASSA-VINTE' : _cidade;

    arquivo = `${path}${_cidade}.geojson`;
    if (fs.existsSync(arquivo)) {
      return parseGeoJson(arquivo, cidadeSnake);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Obtém o arquivo de municípios do IBGE
 * @return {Object[]}
 */
function obterCidades() {
  const arquivo = fs.readFileSync('./ibge-cidades/municipios.json', { encoding: 'utf-8' });
  return JSON.parse(arquivo);
}

function main() {
  const poligonosNaoEncontrados = [];
  const municipiosEncontrados = [];

  const cidades = obterCidades();
  for (let i = 0; i < cidades.length; i++) {
    try {
      const cidade = cidades[i];
      const geojson = obterPoligono(cidade.municipioNome, cidade.ufSigla);

      if (!geojson) {
        poligonosNaoEncontrados.push(`${cidade.municipioNome}, ${cidade.ufSigla}`);
        continue;
      }

      const poligono = lineToPolygon(geojson).geometry;
      const municipioComPoligono = {
        ...cidade,
        poligono,
        kmlBrasil: geojson.features[0].properties.arquivo,
      };
      municipiosEncontrados.push(municipioComPoligono);
    } catch (erro) {
      console.error(erro);
    }
  }

  fs.writeFileSync('./municipios-poligonos.json', JSON.stringify(municipiosEncontrados), { encoding: 'utf-8' });

  console.log(`\ncidades: ${municipiosEncontrados.length}/${cidades.length}`)
  console.log('\nPolígonos não encontrados:');
  console.log(JSON.stringify(poligonosNaoEncontrados));
}

main();