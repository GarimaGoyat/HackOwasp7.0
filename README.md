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



# To connect db

```sql
CREATE DATABASE blinket_gap_filler;

USE blinket_gap_filler;

-- Create roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('admin'), ('user');

-- Insert sample users
INSERT INTO users (username, password, role_id) VALUES
('admin1', '<hashed_password>', 1), -- Replace <hashed_password> with a hashed password
('user1', '<hashed_password>', 2);
```
