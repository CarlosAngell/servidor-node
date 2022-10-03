const http = require("http");
const url = require("url");

const hostname = "127.0.0.1";
const port = 3000;

const headersCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token",
};

const headers = {
  ...headersCors,
  "Content-Type": "text/plain",
};

let dataObjList = [
  {
    id: 1,
    title: "Tarefa de exemplo",
    description: "Apenas um exemplo",
    status: "Sim",
  },
  {
    id: 2,
    title: "Segunda tarefa de exemplo",
    description: "Apenas o segundo exemplo",
    status: "Não",
  },
];

const server = http.createServer(async (req, res) => {
  let resultado;

  switch (req.method) {
    case "GET":
      resultado = await getToDoList(req);
      res.writeHead(200, headers);
      res.end(resultado);
      break;
    case "POST":
    case "PUT":
      resultado = await createNewTask(req);
      res.writeHead(201, headers);
      res.end(resultado);
      break;
    case "DELETE":
      resultado = await deleteTask(req);
      res.writeHead(201, headers);
      res.end(resultado);
      break;
    case "OPTIONS":
      res.writeHead(204, headersCors);
      res.end();
      break;
    default:
      res.writeHead(405, headers);
      res.end(`${req.method} não é aceito por este servidor`);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function getToDoList(request) {
  const urlObjeto = url.parse(request.url, true);

  if (Object.keys(urlObjeto.query).length != 0) {
    console.log(urlObjeto.query.id);
    if (urlObjeto.query.id) {
      for (dataObj of dataObjList) {
        if (dataObj.id == urlObjeto.query.id) {
          return JSON.stringify([
            {
              id: dataObj.id,
              title: dataObj.title,
              description: dataObj.description,
              status: dataObj.status,
            },
          ]);
        }
      }
    }
  }

  return JSON.stringify(dataObjList);
}

async function createNewTask(request) {
  const body = await getBodyParameters(request);

  if (body.id) {
    for (dataObj of dataObjList) {
      if (body.id == dataObj.id) {
        dataObj.title = body.title;
        dataObj.description = body.title;
        dataObj.status = body.isConcluded ? "Sim" : "Não";
        return JSON.stringify({ message: "Salvo com sucesso!" });
      }
    }
  } else {
    if (body.title || body.description) {
      dataObjList.push({
        id: dataObjList.length + 1,
        title: body.title,
        description: body.description,
        status: body.isConcluded ? "Sim" : "Não",
      });
      return JSON.stringify({
        message: "Salvo com sucesso!",
        data: {
          id: dataObjList.length + 1,
          title: body.title,
          description: body.description,
          status: body.isConcluded ? "Sim" : "Não",
        },
      });
    }
  }

  return;
}

async function deleteTask(request) {
  const urlObjeto = url.parse(request.url, true);

  for (dataObj of dataObjList) {
    if (dataObj.id == urlObjeto.query.id) {
      dataObjList.pop(dataObj);
    }
  }

  return JSON.stringify({ message: "Excluido com sucesso!" });
}

const getBodyParameters = (req) =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(JSON.parse(data));
    });
  });
