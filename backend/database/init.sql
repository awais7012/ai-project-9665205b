CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(20),
    phone_number VARCHAR(20),
    is_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Sellers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    store_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES Sellers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(255),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT NOW(),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address VARCHAR(255),
    payment_method VARCHAR(255),
    order_status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE OrderItems (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT NOW(),
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(255),
    transaction_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Commissions (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES Sellers(id) ON DELETE CASCADE,
    order_id INTEGER NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);