fetch("http://localhost:3000").then(async (response) => {
  var data = await response.json();

  const headers = ["ID", "Titulo", "Descrição", "Status", "Editar"];
  createTable("todoList", headers, data);
});

const buttonSearch = document.getElementById("search");
buttonSearch.onclick = async () => {
  let id = document.getElementById("searchId").value;
  let title = document.getElementById("searchTitle").value;
  let description = document.getElementById("searchDescription").value;
  let status = document.getElementById("searchStatus").value;

  fetch(
    `http://localhost:3000?id=${id}&title=${title}&description=${description}&status=${status}`
  ).then(async (response) => {
    var data = await response.json();
    createTable("todoList", false, data);
  });
};

// Função de monta a tabela com as listas
function createTable(elementId, tHeaders, dataObjList) {
  // Pega o ID da tabela
  let table = document.getElementById(elementId);

  // Crea os elementos
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  // Adiciona os elementos criado a cima e adiciona na tabela
  table.appendChild(thead);
  table.appendChild(tbody);

  // Cria a primeira linha dento do thead
  let rowhead = document.createElement("tr");

  // Cria as colunas dentro do tr que esta dentro do thead
  if (tHeaders) {
    for (let header of tHeaders) {
      let columnHead = document.createElement("th");
      columnHead.innerHTML = header;
      rowhead.appendChild(columnHead);
    }
  }

  for (let dataObj in dataObjList) {
    let row = document.createElement("tr");
    let column = "";
    for (let index of Object.keys(dataObjList[dataObj])) {
      column = document.createElement("td");
      column.innerHTML = dataObjList[dataObj][index];
      row.appendChild(column);
    }

    if (true) {
      let column = document.createElement("td");
      column.innerHTML = `<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="edit">Editar</button>`;
      row.appendChild(column);
    }

    row.addEventListener;
    tbody.appendChild(row);
  }

  thead.appendChild(rowhead);
}

const buttonSave = document.getElementById("save");
buttonSave.onclick = async () => {
  await fetch("http://localhost:3000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      isConcluded: document.getElementById("isConcluded").checked,
    }),
  })
    .then(async (response) => {
      var data = (await response.json()).data;

      createTable("todoList", false, [data]);
    })
    .catch(async (err) => {
      throw console.error(await err);
    });
};
