<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll();
        echo json_encode([
            "status" => "success",
            "data" => $orders
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Create new order
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['id']) || empty($input['productName']) || empty($input['name'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO orders (id, product_name, variant, quantity, name, phone, address, date, bed, status) 
                               VALUES (:id, :product_name, :variant, :quantity, :name, :phone, :address, :date, :bed, :status)");
        
        $stmt->execute([
            ':id' => $input['id'],
            ':product_name' => $input['productName'],
            ':variant' => $input['variant'],
            ':quantity' => (int)$input['quantity'],
            ':name' => $input['name'],
            ':phone' => $input['phone'],
            ':address' => $input['address'],
            ':date' => $input['date'],
            ':bed' => (int)$input['bed'],
            ':status' => $input['status']
        ]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Order allocated successfully in database.",
            "data" => $input
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Delete/cancel order
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Order ID is required."]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode([
            "status" => "success",
            "message" => "Order cancelled/deleted successfully from database."
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
