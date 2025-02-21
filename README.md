# **📌 App Fitness - Backend + Frontend**

Este projeto é um **aplicativo de treinos** onde os usuários podem **fazer login, visualizar seus treinos do dia e registrar progresso**. O backend é feito com **Node.js, Express e Prisma**, enquanto o frontend usa **React Native com Expo**.

---

## **📌 1️⃣ Instalação do Backend**

### **1️⃣.1 - Clonar o Repositório**
```sh
git clone https://github.com/seu-repo/app-fitness.git
cd app-fitness/backend-fitness
```

### **1️⃣.2 - Configurar o Banco de Dados com Docker**
Se você ainda não tem o PostgreSQL rodando, execute:
```sh
docker run --name postgres-fitness -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=fitness_db -p 5432:5432 -d postgres
```
Para verificar se o banco está rodando:
```sh
docker ps
```

### **1️⃣.3 - Criar o Arquivo `.env`**
Crie um arquivo **`.env`** na pasta `backend-fitness/` e adicione:
```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/fitness_db?schema=public"
JWT_SECRET="seu_segredo_super_secreto"
```

### **1️⃣.4 - Instalar Dependências**
```sh
npm install
```

### **1️⃣.5 - Criar o Banco de Dados**
```sh
npx prisma migrate dev --name init
npx prisma generate
```

### **1️⃣.6 - Iniciar o Backend**
```sh
npx nodemon src/server.js
```
Se tudo estiver certo, você verá:
```
🔥 Servidor rodando na porta 4000
```

---

## **📌 2️⃣ Instalação do Frontend**

### **2️⃣.1 - Acessar a Pasta do App**
```sh
cd ../app-fitness
```

### **2️⃣.2 - Instalar Dependências**
```sh
npm install
```

### **2️⃣.3 - Configurar o Arquivo `api.js`**
📂 **Abra `src/api.js` e ajuste a `baseURL` para o seu ambiente**:

- **Se estiver testando no Expo Web (`localhost`)**
```js
export const api = axios.create({
  baseURL: "http://localhost:4000",
});
```
- **Se estiver testando no celular via Wi-Fi**
```js
export const api = axios.create({
  baseURL: "http://SEU_IP_LOCAL:4000", // Substitua pelo IP da sua máquina
});
```
Para descobrir seu IP local no **Windows**:
```sh
ipconfig
```
No **Mac/Linux**:
```sh
ifconfig
```

### **2️⃣.4 - Iniciar o App**
```sh
npx expo start
```
No Expo, selecione **"Run on web"**, **"Run on Android"** ou **"Run on iOS"**.

---

## **📌 3️⃣ Testando as Rotas da API**

### **3️⃣.1 - Criar um Usuário**
```sh
curl -X POST http://localhost:4000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Manoel",
  "email": "manoel@email.com",
  "password": "123456"
}'
```

### **3️⃣.2 - Fazer Login**
```sh
curl -X POST http://localhost:4000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "manoel@email.com",
  "password": "123456"
}'
```
✅ **Copie o token JWT da resposta para testar as rotas protegidas.**

### **3️⃣.3 - Buscar o Treino do Dia**
```sh
curl -X GET http://localhost:4000/api/workout-today \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## **📌 4️⃣ Estrutura do Projeto**
```
/app-fitness
│── /backend-fitness
│   ├── /prisma
│   │   ├── schema.prisma    # Esquema do banco de dados
│   ├── /src
│   │   ├── /controllers
│   │   │   ├── authController.js
│   │   │   ├── workoutController.js
│   │   │   ├── exerciseController.js
│   │   │   ├── progressController.js
│   │   ├── /routes
│   │   │   ├── authRoutes.js
│   │   │   ├── workoutRoutes.js
│   │   │   ├── exerciseRoutes.js
│   │   │   ├── progressRoutes.js
│   │   ├── /middlewares
│   │   │   ├── authMiddleware.js
│   │   ├── server.js
│   ├── .env
│   ├── package.json
│── /app
│   ├── /src
│   │   ├── api.js
│   │   ├── AuthContext.js
│   │   ├── LoginScreen.js
│   │   ├── WorkoutScreen.js
│   │   ├── styles.js
│   ├── App.js
│   ├── package.json
```

---

## **📌 5️⃣ Melhorias Futuras**
🚀 **Melhorias que podem ser implementadas no futuro:**
- ✅ **Login social (Google e Facebook)**
- ✅ **Registro de séries, peso e repetições**
- ✅ **Notificações para lembrar dos treinos**
- ✅ **Sincronização com dispositivos wearable (Apple Watch, Fitbit, etc.)**

---

## **📌 6️⃣ Contato**
Caso tenha dúvidas ou sugestões, entre em contato via [GitHub Issues](https://github.com/seu-repo/app-fitness/issues).

🚀💪

