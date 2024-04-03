// levantar servidor

const express = require('express');
const app = express();
const port = process.env.PORT || 3600;

const bodyParser = require('body-parser');

// Configuración de body-parser para analizar solicitudes application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Configuración de body-parser para analizar solicitudes application/json
app.use(bodyParser.json());


const vehicles = [
    { platenumber: 'ABC123', brand: 'Renault', model: 'Duster', price: 70000000, state: 'disponible' },
    { platenumber: 'XYZ789', brand: 'Chevrolet', model: 'Onix', price: 50000000, state: 'no disponible' }
  ];

const users = [
    { username: 'admin', fullname: 'Administrador', password: 'admin123', role: 1 },
    { username: 'user1', fullname: 'Usuario 1', password: 'pass123', role: 2 }
  ];

// Raíz de la app
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  });


// Método GET para /vehiculos
  app.get('/vehicles', (req, res) => {
    res.send(JSON.stringify(vehicles));
  });

// Método GET para /vehiculoxplaca/:nroplaca
app.get('/vehicles/:platenumber', (req, res) => {
    const vehicle = vehicles.find(v => v.platenumber === req.params.platenumber);
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).send('Vehículo no encontrado');
    }
  });

// Método POST para agregar un vehículo

app.post('/vehicles', (req, res) => {
    const { platenumber, brand, model, price, state } = req.body;
  
    // Verificar si el número de placa ya existe
    const existingVehicle = vehicles.find(vehicle => vehicle.platenumber === platenumber);
    if (existingVehicle) {
      return res.status(400).send('El número de placa ya existe');
    }
  
    // Agregar el nuevo vehículo al arreglo de vehículos
    vehicles.push({ platenumber, brand, model, price, state });
  
    res.status(201).send('Vehículo agregado correctamente');
  });
  
// Método PUT para actualizar un vehículo
app.put('/vehicles/:platenumber', (req, res) => {
    const platenumber = req.params.platenumber;
    const index = vehicles.findIndex(v => v.platenumber === platenumber);
    if (index !== -1) {
        vehicles[index] = req.body;
      res.send('Vehículo actualizado correctamente');
    } else {
      res.status(404).send('Vehículo no encontrado');
    }
  });
  
// Método DELETE para eliminar un vehículo
app.delete('/vehicles/:platenumber', (req, res) => {
    const platenumber = req.params.platenumber;
    const index = vehicles.findIndex(v => v.platenumber === platenumber);
    if (index !== -1) {
        vehicles.splice(index, 1);
      res.send('Vehículo eliminado correctamente');
    } else {
      res.status(404).send('Vehículo no encontrado');
    }
  });
  
// Método GET para iniciar sesión
app.get('/login', (req, res) => {
    const { username, password } = req.query;
  
    // Buscar el usuario en el arreglo de usuarios
    const user = users.find(u => u.username === username && u.password === password);
  
    if (!user) {
      return res.status(401).send('Credenciales inválidas');
    }
  
    // Verificar el rol del usuario
    if (user.role === 1) {
      res.send(`Bienvenido administrador ${user.username}`);
    } else {
      res.send(`Bienvenido usuario ${user.username}`);
    }
  });


app.listen(port,()=>{
    console.log(`Server in http://127.0.0.1:${port}`)
})