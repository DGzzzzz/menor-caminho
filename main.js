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
  }
});
