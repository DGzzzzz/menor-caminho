const cidades = [
  "Feliz",
  "Vale Real",
  "S.S do Caí",
  "Alto Feliz",
  "Bom Princípio",
  "Tupandi",
  "São Vendelino",
];

const matrizAdjacente = [
  [0, 9.4, 21, 11, 9.1, 18.9, 19.5],
  [9.4, 0, 28.9, 10.8, 17.1, 26.1, 27.5],
  [21, 28.9, 0, 29.9, 12.4, 18.2, 27.2],
  [11, 18.8, 29.9, 0, 18.7, 28.4, 10.2],
  [9.1, 17.1, 12.4, 18.7, 0, 10.3, 15.2],
  [18.9, 26.1, 18.2, 28.4, 10.3, 0, 25],
  [19.5, 27.5, 27.2, 10.2, 15.2, 25, 0],
];

const coordenadas = [
  [-29.5706, -51.4962],
  [-29.5697, -51.2803], 
  [-29.7192, -51.4724], 
  [-29.5220, -51.2873], 
  [-29.6754, -51.1999], 
  [-29.4778, -51.2681], 
  [-29.6490, -51.3741],
]

function desenharMapa(cidadesSelecionadas, caminhoIndices) {
  //inicializacao do mapa
  const map = L.map("map").setView([coordenadas[cidadesSelecionadas[0]][0], coordenadas[cidadesSelecionadas[0]][1]], 13)
  //adiciona fundo do mapa
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map).on('tileload', function(e) {
  console.log('Tileload', e.tile);

  map.invalidateSize();
});
  //Marca a cidade de origem e destino no mapa
  L.marker([coordenadas[cidadesSelecionadas[0]][0], coordenadas[cidadesSelecionadas[0]][1]])
    .addTo(map)
    .bindPopup("Cidade de origem: " + cidades[cidadesSelecionadas[0]]);
  
    L.marker([coordenadas[cidadesSelecionadas[1]][0], coordenadas[cidadesSelecionadas[1]][1]])
    .addTo(map)
    .bindPopup("Cidade de destino: " + cidades[cidadesSelecionadas[1]]);

  //desenha o caminho
  const caminhoLatLng = caminhoIndices.map(index => [coordenadas[index][0], coordenadas[index][1]]);
  L.polyline(caminhoLatLng, {color: "#2980b9", weight: 4 }).addTo(map);
}

function dijkstra(matriz, inicio, destino) {
  const n = matriz.length;
  const distancias = Array(n).fill(Infinity);
  const anteriores = Array(n).fill(null);
  const visitados = Array(n).fill(false);
  distancias[inicio] = 0;

  for (let i = 0; i < n; i++) {
    let menorDistancia = Infinity;
    let menorIndice = -1;

    for (let j = 0; j < n; j++) {
      if (!visitados[j] && distancias[j] < menorDistancia) {
        menorDistancia = distancias[j];
        menorIndice = j;
      }
    }

    if (menorIndice === -1) break;

    visitados[menorIndice] = true;

    for (let k = 0; k < n; k++) {
      const distanciaAtual = matriz[menorIndice][k];
      if (distanciaAtual !== Infinity && !visitados[k]) {
        const novaDistancia = distancias[menorIndice] + distanciaAtual;
        if (novaDistancia < distancias[k]) {
          distancias[k] = novaDistancia;
          anteriores[k] = menorIndice;
        }
      }
    }
  }

  const caminho = [];
  for (let at = destino; at !== null; at = anteriores[at]) {
    caminho.push(at);
  }
  caminho.reverse();

  return {
    distancia: distancias[destino],
    caminho: caminho.map((index) => cidades[index]),
  };
}

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const partida = parseInt(document.getElementById("partida").value, 10);
  const chegada = parseInt(document.getElementById("chegada").value, 10);

  if (partida == chegada) {
    document.getElementById("resultado").innerText =
      "A cidade de partida e chegada devem ser diferentes";
    return;
  }

  const resultado = dijkstra(matrizAdjacente, partida, chegada);

  if (resultado.distancia === Infinity) {
    document.getElementById("resultado").innerText =
      "Não há caminho entre as cidades selecionadas.";
  } else {
    document.getElementById(
      "resultado"
    ).innerText = `Menor caminho: ${resultado.caminho.join(" -> ")}\n
      Distância total: ${resultado.distancia.toFixed(2)} km
      `;

    desenharMapa([partida, chegada], resultado.caminho.map(cidade => cidades.indexOf(cidade)));
  }
});
