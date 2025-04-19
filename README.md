#  To Start

- if you have bash then run this command in terminal

```bash
./start-app.sh
```

- Or if you have dependencies installed

- For Go

```
cd backend
go mod tidy
```

- For Frontend

```
cd frontend
npm install
```

1. Terminal 1 

```
cd backend
go run main.go
```

2. Terminal 2 

```
cd frontend
npm start
```

# Blinket Gap Filler 🛍️

This is a hackathon project that supports local campus shopkeepers by showcasing items **not available on Blinkit**, but available inside our campus.

## 💡 Problem

Due to Blinkit delivery being widely available, students are ignoring local shops inside the campus. This is reducing their sales even though they offer unique and essential products.

## ✅ Solution

Our website helps:
- Highlight products that **are not on Blinkit**
- Promote **in-campus shops**
- Allow students to discover what’s available nearby

## 📁 Features

- 🛒 Student Login Page
- 🏠 Homepage to browse local shop products
- 🔍 Filter products not available on Blinkit
- 📍 Shop location (optional)
- 🧑‍💻 Admin/Shopkeeper panel (future enhancement)

## 🚀 Getting Started

To get started with the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/blinket-gap-filler.git

2. **Install dependencies**:

   #### For the Backend (Go):
   ```bash
   cd backend
   go mod tidy

3. **Initialize Go module**:
    ```bash
   go mod init github.com/<your-username>/blinket-gap-filler

4. **Run the Backend Server**:
   ```bash
   go run main.go

## 🌟 Features

- User login and homepage
- Listings of campus-only items
- Basic inventory and comparison with Blinkit

## 🚧 Future Scope

- Admin portal for shopkeepers
- Real-time inventory sync
- Mobile-friendly UI and delivery tracking
